from __future__ import annotations
import asyncio
import json
import re

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

from swarm_engine.core.state import SwarmState
from swarm_engine.agents.factory import AgentFactory
from swarm_engine.memory.memory import SwarmMemory
from config import settings


def initialize_node(state: SwarmState) -> dict:
    print(f"\n{'='*50}\nSWARM — INITIALIZE\n{'='*50}")
    memory = SwarmMemory()
    memory.initialize(state["problem"])
    factory = AgentFactory(num_agents=state["num_agents"])
    factory.initialize()
    return {"memory": memory, "factory": factory, "current_iteration": 0, "final_output": None, "error": None}


async def generate_node(state: SwarmState) -> dict:
    memory: SwarmMemory = state["memory"]
    factory: AgentFactory = state["factory"]
    batch_size: int = state["batch_size"]

    iteration = memory.advance_iteration()
    agents = factory.get_active_agents()
    prior = memory.get_context_for_agents()
    batches = [agents[i:i + batch_size] for i in range(0, len(agents), batch_size)]

    for batch in batches:
        for agent in batch:
            try:
                result = await _invoke_agent(agent, memory.problem, iteration, prior)
                await asyncio.sleep(1.5)
            except Exception as e:
                if "rate_limit" in str(e).lower() or "429" in str(e):
                    print(f"[{agent.label()}] Rate limit — waiting 10s…")
                    await asyncio.sleep(10)
                    try:
                        result = await _invoke_agent(agent, memory.problem, iteration, prior)
                    except Exception:
                        continue
                else:
                    print(f"[{agent.label()}] FAILED: {e}")
                    continue

            if not result:
                continue

            content = result.get("content", "").strip()
            action_type = result.get("action_type", "generate")
            reason = result.get("reason", "")
            if not content:
                continue

            parent_ids = []
            scored = sorted([i for i in memory.get_all_ideas() if i.score > 0], key=lambda x: x.score, reverse=True)
            if action_type == "refine" and scored:
                parent_ids = [scored[0].idea_id]
            elif action_type == "combine" and len(scored) >= 2:
                parent_ids = [scored[0].idea_id, scored[1].idea_id]

            memory.add_idea(text=content, agent_id=agent.id, agent_style=agent.style,
                           action_type=action_type, reason=reason, parent_ids=parent_ids)

        await asyncio.sleep(2)

    return {"memory": memory, "current_iteration": iteration}


async def _invoke_agent(agent, problem, iteration, prior):
    chain = agent.build_chain()
    data = agent.build_invoke_input(problem, iteration, prior)
    res = await chain.ainvoke(data)
    if not res:
        return None
    res = res.strip()
    parsed = None
    if res.startswith("{"):
        try:
            parsed = json.loads(res)
        except Exception:
            pass
    if not parsed:
        first, last = res.find("{"), res.rfind("}")
        if first != -1 and last > first:
            try:
                parsed = json.loads(res[first:last + 1])
            except Exception:
                pass
    if parsed and "content" in parsed:
        return {"content": parsed["content"].strip(), "action_type": parsed.get("action_type", "generate"), "reason": parsed.get("reason", "")}
    return {"content": res, "action_type": "generate" if iteration <= 1 else "refine", "reason": ""}


async def score_node(state: SwarmState) -> dict:
    memory = state["memory"]
    factory = state["factory"]
    iteration = state["current_iteration"]
    ideas = memory.get_ideas_for_iteration(iteration)
    if not ideas:
        return {}

    ideas_text = "\n".join(f"{i+1}. {idea.text}" for i, idea in enumerate(ideas))
    prompt = f"Score each idea 1-10.\n\nProblem: {memory.problem}\n\nIdeas:\n{ideas_text}\n\nReturn ONLY a JSON array like: [7.2, 8.5]\nNo text. Only the array."

    llm = ChatGroq(model=settings.SCORING_MODEL, api_key=settings.GROQ_API_KEY,
                   temperature=settings.TEMPERATURE_SCORING, max_tokens=settings.MAX_TOKENS_SCORING)
    scores = [5.0] * len(ideas)
    for attempt in range(3):
        try:
            response = await llm.ainvoke([HumanMessage(content=prompt)])
            match = re.search(r"\[[\d\s.,]+\]", response.content.strip())
            if match:
                scores = json.loads(match.group())
            break
        except Exception as e:
            if "429" in str(e) or "rate_limit" in str(e).lower():
                await asyncio.sleep(15 * (attempt + 1))
            else:
                break

    for i, idea in enumerate(ideas):
        score = float(scores[i]) if i < len(scores) else 5.0
        memory.update_score(idea.idea_id, score)
        agent = factory.get_agent_by_id(idea.agent_id)
        if agent:
            agent.record_score(score)
    return {"memory": memory, "factory": factory}


def evolve_node(state: SwarmState) -> dict:
    state["factory"].evolve()
    return {"factory": state["factory"]}


async def synthesize_node(state: SwarmState) -> dict:
    memory = state["memory"]
    ideas = memory.get_top_ideas()
    if not ideas:
        return {"final_output": "No ideas generated."}

    ideas_text = "\n".join(f"{i+1}. {idea.text}" for i, idea in enumerate(ideas))
    prompt = f"Problem: {memory.problem}\n\nTop swarm ideas:\n{ideas_text}\n\nSynthesise into one final structured answer."

    llm = ChatGroq(model=settings.SCORING_MODEL, api_key=settings.GROQ_API_KEY,
                   temperature=settings.TEMPERATURE_SYNTHESIS, max_tokens=settings.MAX_TOKENS_SYNTHESIS)
    for attempt in range(3):
        try:
            response = await llm.ainvoke([HumanMessage(content=prompt)])
            return {"final_output": response.content.strip()}
        except Exception as e:
            if "429" in str(e) or "rate_limit" in str(e).lower():
                await asyncio.sleep(15 * (attempt + 1))
            else:
                break
    fallback = "\n".join(f"- {idea.text}" for idea in ideas)
    return {"final_output": f"[Top ideas]\n{fallback}"}


def error_node(state: SwarmState) -> dict:
    return {"final_output": f"Error: {state.get('error')}"}
