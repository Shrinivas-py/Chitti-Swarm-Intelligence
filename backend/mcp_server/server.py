"""
Chitti-AI MCP Server
Exposes Chitti orchestrator tools via FastMCP.

Run standalone:
    python -m backend.mcp_server.server
"""
import sys
import os

# Ensure backend/ is on path
_HERE = os.path.dirname(os.path.abspath(__file__))
_BACKEND = os.path.dirname(_HERE)
if _BACKEND not in sys.path:
    sys.path.insert(0, _BACKEND)

from mcp.server.fastmcp import FastMCP
from chitti.orchestrator import ChittiOrchestrator

mcp = FastMCP("chitti-ai-server")
orchestrator = ChittiOrchestrator(agent_count=5)


@mcp.tool()
def initialize_chitti(problem: str) -> dict:
    """Initialize a new Chitti session with a user problem."""
    return orchestrator.initialize(problem)


@mcp.tool()
def run_chitti_iteration() -> dict:
    """Run one iteration where agents read shared memory and contribute ideas."""
    return orchestrator.run_real_swarm(num_iterations=1)


@mcp.tool()
def score_chitti_ideas() -> dict:
    """Score all ideas, vote on the best, and return the current winner."""
    return orchestrator.score_and_vote()


@mcp.tool()
def run_chitti_full(iterations: int = 3) -> dict:
    """Run the full Chitti process: init → swarm → score → final answer."""
    return orchestrator.run_full_process(iterations=iterations)


@mcp.tool()
def get_chitti_state() -> dict:
    """Get the current Chitti shared memory state."""
    return orchestrator.get_state()


if __name__ == "__main__":
    mcp.run()
