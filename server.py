"""
Chitti-AI  —  Integrated Gateway Server
Run: python server.py
"""

import asyncio
import json
import sys
import os
import time
from typing import AsyncIterator

# ── CRITICAL: Set up sys.path BEFORE any local imports ─────────────────────
ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.join(ROOT, "backend")

# Add BOTH root and backend so all relative imports resolve correctly
for p in [ROOT, BACKEND]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Load .env before anything touches os.getenv
from dotenv import load_dotenv
load_dotenv(os.path.join(ROOT, ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI(title="Chitti-AI Gateway", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str
    iterations: int = 3
    num_agents: int = 5


def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


async def run_chitti_stream(question: str, iterations: int, num_agents: int) -> AsyncIterator[str]:
    try:
        # Import INSIDE the function — after sys.path is already set
        from swarm_engine.api import execute_swarm_sync
        from chitti.orchestrator import ChittiOrchestrator

        yield sse("session_start", {
            "problem": question,
            "num_agents": num_agents,
            "iterations": iterations,
            "timestamp": time.time(),
        })
        await asyncio.sleep(0.1)

        agent_styles = ["analytical", "creative", "systematic", "convergent", "pragmatic"]
        for i in range(num_agents):
            yield sse("agent_activated", {
                "agent_index": i,
                "agent_id": f"A-{i+1:02d}",
                "style": agent_styles[i % len(agent_styles)],
                "temperature": round(0.1 + (i * 0.18), 2),
                "total_agents": num_agents,
            })
            await asyncio.sleep(0.15)

        yield sse("swarm_running", {
            "message": "Swarm engine initialising LangGraph workflow…",
            "status": "running",
        })

        loop = asyncio.get_event_loop()

        def _run_swarm():
            return execute_swarm_sync(
                problem=question,
                num_agents=num_agents,
                num_iterations=iterations,
                send_to_mcp=False,
            )

        swarm_task = loop.run_in_executor(None, _run_swarm)

        # Stream visual iteration events while swarm runs in background
        iter_duration = 2.5
        for it in range(1, iterations + 1):
            yield sse("iteration_start", {
                "iteration": it,
                "total_iterations": iterations,
                "message": f"Iteration {it}: Agents generating and refining ideas…",
            })
            ideas_this_iter = num_agents * 2
            for idea_idx in range(ideas_this_iter):
                await asyncio.sleep(iter_duration / ideas_this_iter)
                agent_idx = idea_idx % num_agents
                yield sse("idea_generated", {
                    "iteration": it,
                    "idea_index": idea_idx,
                    "agent_id": f"A-{agent_idx+1:02d}",
                    "agent_style": agent_styles[agent_idx % len(agent_styles)],
                    "status": "thinking",
                    "ideas_this_iter": ideas_this_iter,
                })
            yield sse("iteration_end", {
                "iteration": it,
                "ideas_generated": ideas_this_iter,
            })

        yield sse("scoring_start", {"message": "MCP orchestrator scoring and synthesising ideas…"})

        result = await swarm_task

        orchestrator = ChittiOrchestrator(agent_count=num_agents)
        orchestrator.initialize(question)
        orchestrator.ingest_swarm_result(result.to_dict())

        all_ideas = result.all_ideas if hasattr(result, "all_ideas") else []
        for idea_data in all_ideas[:25]:
            yield sse("real_idea", {
                "content": idea_data.get("text", idea_data.get("content", ""))[:400],
                "agent_id": idea_data.get("agent_id", "?"),
                "agent_style": idea_data.get("agent_style", "unknown"),
                "iteration": idea_data.get("iteration", 1),
                "score": idea_data.get("score", 0),
            })
            await asyncio.sleep(0.04)

        yield sse("final_output", {
            "answer": result.final_output or "",
            "total_ideas": result.total_ideas,
            "iterations_run": result.iterations_run,
            "agents_started": result.agents_started,
            "agents_survived": result.agents_survived,
            "top_ideas": result.top_ideas[:5],
            "agent_summary": result.agent_summary,
        })

        yield sse("session_end", {
            "status": "success",
            "message": "Chitti-AI has synthesised the best answer.",
            "timestamp": time.time(),
        })

    except Exception as exc:
        import traceback
        yield sse("error", {
            "message": str(exc),
            "traceback": traceback.format_exc()[-1000:],
        })


SSE_HEADERS = {
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
    "Connection": "keep-alive",
}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "chitti-ai-gateway"}


@app.post("/api/ask")
async def ask_post(body: QueryRequest):
    return StreamingResponse(
        run_chitti_stream(body.question, body.iterations, body.num_agents),
        media_type="text/event-stream",
        headers=SSE_HEADERS,
    )


@app.get("/api/ask")
async def ask_get(q: str, iterations: int = 3, num_agents: int = 5):
    return StreamingResponse(
        run_chitti_stream(q, iterations, num_agents),
        media_type="text/event-stream",
        headers=SSE_HEADERS,
    )


if __name__ == "__main__":
    import uvicorn
    print("\n🤖 Chitti-AI Gateway starting…")
    print("   Backend  → http://localhost:8000")
    print("   Frontend → http://localhost:5173")
    print("   Health   → http://localhost:8000/health\n")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
