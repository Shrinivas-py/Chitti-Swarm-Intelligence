# ⬡ Chitti-AI — Multi-Agent Intelligence System

Self-evolving swarm of AI agents that collaborate through a shared MCP memory
to generate, refine, score, and synthesise the best answer to any question.

---

## 🚀 Quick Start (2 terminals)

### Terminal 1 — Backend

```bash
cd Chitti-AI-Final

# 1. Create virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Start the server
python server.py
```

Backend runs at → http://localhost:8000

### Terminal 2 — Frontend

```bash
cd Chitti-AI-Final

# Install Node dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at → http://localhost:5173

---

## 🔑 API Keys

Already set in `.env`. To update:

```env
GROQ_API_KEY=your_groq_key_here      # Required — get free at console.groq.com
TAVILY_API_KEY=your_tavily_key        # Optional
```

---

## 🏗 Architecture

```
Browser (React + Vite)
    │  EventSource SSE
    ▼
server.py  (FastAPI gateway — port 8000)
    │
    ├── SwarmEngine (LangGraph)
    │       initialize → generate → score → evolve → synthesize
    │       Each node calls Groq LLM with different agent personalities
    │
    └── ChittiOrchestrator (MCP layer)
            Ingests swarm results, deduplicates, scores, votes
            Exposes tools via FastMCP for external MCP clients
```

## 📡 SSE Event Stream

| Event | Payload |
|---|---|
| `session_start` | problem, num_agents, iterations |
| `agent_activated` | agent_id, style, temperature |
| `swarm_running` | status message |
| `iteration_start` | iteration number |
| `idea_generated` | agent_id, style, status |
| `iteration_end` | ideas count |
| `scoring_start` | message |
| `real_idea` | content, agent_id, score |
| `final_output` | answer, stats, top_ideas |
| `session_end` | status |
| `error` | message, traceback |

---

## 🗂 Project Structure

```
Chitti-AI-Final/
├── server.py              ← FastAPI gateway (START HERE)
├── .env                   ← API keys
├── package.json           ← Frontend deps
├── vite.config.js
├── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── store/
│   │   └── AppContext.jsx ← SSE connection + state
│   └── components/UI/
│       ├── HeroInput.jsx  ← Landing page
│       └── ThinkingPage.jsx ← Agent live view
└── backend/
    ├── config.py          ← Settings + env loading
    ├── requirements.txt
    ├── chitti/            ← MCP orchestrator layer
    │   ├── orchestrator.py
    │   ├── memory.py
    │   └── scorer.py
    ├── mcp_server/
    │   └── server.py      ← FastMCP tool definitions
    └── swarm_engine/      ← LangGraph swarm
        ├── api.py
        ├── agents/
        │   ├── factory.py
        │   └── personalities.py  ← 20 agent personalities
        ├── core/
        │   ├── workflow.py
        │   ├── nodes.py
        │   └── state.py
        └── memory/
            └── memory.py
```
