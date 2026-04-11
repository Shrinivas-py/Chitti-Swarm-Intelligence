from __future__ import annotations
import asyncio
import json
from dataclasses import dataclass, asdict

from swarm_engine.core.workflow import run_swarm
from config import settings


@dataclass
class SwarmResult:
    problem: str
    final_output: str
    total_ideas: int
    iterations_run: int
    agents_started: int
    agents_survived: int
    top_ideas: list
    all_ideas: list
    agent_summary: list

    def to_dict(self) -> dict:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)


async def execute_swarm(
    problem: str,
    num_agents: int = None,
    num_iterations: int = None,
    batch_size: int = None,
    send_to_mcp: bool = False,
) -> SwarmResult:
    print(f"\n[API] Starting swarm | problem: {problem[:60]}")

    final_state = await run_swarm(
        problem=problem,
        num_agents=num_agents or settings.SWARM_NUM_AGENTS,
        num_iterations=num_iterations or settings.SWARM_NUM_ITERATIONS,
        batch_size=batch_size or settings.SWARM_BATCH_SIZE,
    )

    memory = final_state["memory"]
    factory = final_state["factory"]

    result = SwarmResult(
        problem=memory.problem,
        final_output=final_state.get("final_output", "") or "",
        total_ideas=len(memory.get_all_ideas()),
        iterations_run=memory.iteration,
        agents_started=factory.num_agents,
        agents_survived=len(factory.get_active_agents()),
        top_ideas=[idea.to_dict() for idea in memory.get_top_ideas()],
        all_ideas=[idea.to_dict() for idea in memory.get_all_ideas()],
        agent_summary=factory.summary()["agents"],
    )

    print(f"[API] Done | ideas={result.total_ideas} | agents={result.agents_survived}/{result.agents_started}")
    return result


def execute_swarm_sync(
    problem: str,
    num_agents: int = None,
    num_iterations: int = None,
    batch_size: int = None,
    send_to_mcp: bool = False,
) -> SwarmResult:
    return asyncio.run(
        execute_swarm(
            problem=problem,
            num_agents=num_agents,
            num_iterations=num_iterations,
            batch_size=batch_size,
            send_to_mcp=send_to_mcp,
        )
    )
