from __future__ import annotations
from typing import TypedDict, Optional
from swarm_engine.memory.memory import SwarmMemory
from swarm_engine.agents.factory import AgentFactory


class SwarmState(TypedDict):
    problem: str
    max_iterations: int
    batch_size: int
    num_agents: int
    memory: Optional[SwarmMemory]
    factory: Optional[AgentFactory]
    current_iteration: int
    final_output: Optional[str]
    error: Optional[str]
