import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Walk up to find .env (works whether run from backend/ or project root)
_here = Path(__file__).resolve().parent
for _candidate in [_here, _here.parent]:
    _env = _candidate / ".env"
    if _env.exists():
        load_dotenv(_env)
        break
else:
    load_dotenv()


class Settings:
    GROQ_API_KEY: str   = os.getenv("GROQ_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    AGENT_MODEL: str   = "llama-3.1-8b-instant"
    SCORING_MODEL: str = "llama-3.1-8b-instant"

    SWARM_NUM_AGENTS: int     = 5
    SWARM_NUM_ITERATIONS: int = 3
    SWARM_BATCH_SIZE: int     = 2

    TEMPERATURE_MIN: float       = 0.10
    TEMPERATURE_MAX: float       = 1.00
    TEMPERATURE_SCORING: float   = 0.10
    TEMPERATURE_SYNTHESIS: float = 0.50

    MAX_TOKENS_AGENT: int     = 200
    MAX_TOKENS_SCORING: int   = 80
    MAX_TOKENS_SYNTHESIS: int = 800

    PRIOR_IDEAS_CONTEXT_WINDOW: int = 10
    TOP_IDEAS_TO_KEEP: int          = 5
    PRUNE_RATE: float               = 0.30


settings = Settings()

if not settings.GROQ_API_KEY:
    print(
        "\n[CONFIG] WARNING: GROQ_API_KEY is not set.\n"
        "         Set it in your .env file and restart.\n",
        file=sys.stderr,
    )
