import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

// ── Agent definitions (matches real swarm styles) ──────────────────────────
export const AGENTS = [
  { id: 0, name: 'Agent A-01', role: 'Analytical Reasoning',  emoji: '🧠', color: '#0F8C8C', bg: 'rgba(15,140,140,0.12)',  style: 'analytical'  },
  { id: 1, name: 'Agent A-02', role: 'Creative Divergence',   emoji: '✦',  color: '#BF3F57', bg: 'rgba(191,63,87,0.12)',   style: 'creative'    },
  { id: 2, name: 'Agent A-03', role: 'Pattern Recognition',   emoji: '◈',  color: '#025959', bg: 'rgba(2,89,89,0.15)',     style: 'systematic'  },
  { id: 3, name: 'Agent A-04', role: 'Convergent Synthesis',  emoji: '◉',  color: '#732047', bg: 'rgba(115,32,71,0.15)',   style: 'convergent'  },
  { id: 4, name: 'Agent A-05', role: 'Pragmatic Evaluation',  emoji: '⬡',  color: '#4A6FA5', bg: 'rgba(74,111,165,0.12)', style: 'pragmatic'   },
];

// ── API base URL ────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function AppProvider({ children }) {
  const [theme,        setTheme]        = useState('dark');
  const [query,        setQuery]        = useState('');
  const [step,         setStep]         = useState(0);
  const [isThinking,   setIsThinking]   = useState(false);
  const [activeAgents, setActiveAgents] = useState(0);
  const [ideas,        setIdeas]        = useState([]);
  const [output,       setOutput]       = useState(null);
  const [iteration,    setIteration]    = useState(0);
  const [totalIterations, setTotalIterations] = useState(3);
  const [agentStats,   setAgentStats]   = useState(AGENTS.map(a => ({ ...a, ideas: 0, score: 0 })));
  const [error,        setError]        = useState(null);
  const [swarmMeta,    setSwarmMeta]    = useState(null); // final stats
  const eventSourceRef = useRef(null);

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const parseEventData = (raw) => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const getAgentIndex = (agentId) => {
    const match = String(agentId || '').match(/A-(\d+)/i);
    if (!match) return -1;
    const idx = Number(match[1]) - 1;
    return Number.isFinite(idx) ? idx : -1;
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  const reset = useCallback(() => {
    closeEventSource();
    setQuery(''); setStep(0); setIsThinking(false);
    setActiveAgents(0); setIdeas([]); setOutput(null);
    setIteration(0); setError(null); setSwarmMeta(null);
    setAgentStats(AGENTS.map(a => ({ ...a, ideas: 0, score: 0 })));
  }, [closeEventSource]);

  /**
   * askChitti - the main integration function.
   * Connects to GET /api/ask?q=... via EventSource and processes SSE events.
   */
  const askChitti = useCallback((question, { iterations = 3, numAgents = 5 } = {}) => {
    reset();
    setQuery(question);
    setIsThinking(true);
    setTotalIterations(iterations);
    setError(null);

    const url = `${API_BASE}/api/ask?q=${encodeURIComponent(question)}&iterations=${iterations}&num_agents=${numAgents}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    // ── session_start ───────────────────────────────────────────────────────
    es.addEventListener('session_start', (e) => {
      const data = parseEventData(e.data) || {};
      setStep(1);
      setTotalIterations(Number(data.iterations) || iterations);
    });

    // ── agent_activated ─────────────────────────────────────────────────────
    es.addEventListener('agent_activated', (e) => {
      const data = parseEventData(e.data) || {};
      setActiveAgents(Number(data.agent_index) + 1 || 0);
      setStep(1);
    });

    // ── swarm_running ───────────────────────────────────────────────────────
    es.addEventListener('swarm_running', () => {
      setStep(2);
    });

    // ── iteration_start ─────────────────────────────────────────────────────
    es.addEventListener('iteration_start', (e) => {
      const data = parseEventData(e.data) || {};
      setIteration(Number(data.iteration) || 0);
      setStep(2);
    });

    // ── idea_generated (visual / fake streaming) ────────────────────────────
    es.addEventListener('idea_generated', (e) => {
      const data = parseEventData(e.data) || {};
      // Update agent stats for visualization
      const agentIdx = getAgentIndex(data.agent_id);
      if (agentIdx >= 0 && agentIdx < AGENTS.length) {
        setAgentStats(prev => prev.map((a, i) =>
          i === agentIdx ? { ...a, ideas: (a.ideas || 0) + 1 } : a
        ));
      }
    });

    // ── real_idea (actual ideas from swarm) ─────────────────────────────────
    es.addEventListener('real_idea', (e) => {
      const data = parseEventData(e.data) || {};
      setIdeas(prev => [...prev, {
        content: data.content || '',
        agent_id: data.agent_id || '',
        agent_style: data.agent_style || '',
        iteration: Number(data.iteration) || 0,
        score: Number(data.score) || 0,
        id: `${data.agent_id}-${data.iteration}-${Math.random().toString(36).slice(2,6)}`
      }]);
      // Update agent score
      const agentIdx = getAgentIndex(data.agent_id);
      if (agentIdx >= 0 && agentIdx < AGENTS.length) {
        setAgentStats(prev => prev.map((a, i) =>
          i === agentIdx ? { ...a, score: Math.max(a.score || 0, Number(data.score) || 0) } : a
        ));
      }
    });

    // ── scoring_start ───────────────────────────────────────────────────────
    es.addEventListener('scoring_start', () => {
      setStep(3);
    });

    // ── final_output ────────────────────────────────────────────────────────
    es.addEventListener('final_output', (e) => {
      const data = parseEventData(e.data) || {};
      setOutput(data.answer || '');
      setSwarmMeta({
        totalIdeas: data.total_ideas,
        iterationsRun: data.iterations_run,
        agentsStarted: data.agents_started,
        agentsSurvived: data.agents_survived,
        topIdeas: data.top_ideas || [],
        agentSummary: data.agent_summary || [],
      });
      setStep(4);
      setIsThinking(false);
    });

    // ── session_end ─────────────────────────────────────────────────────────
    es.addEventListener('session_end', () => {
      closeEventSource();
    });

    // ── error ───────────────────────────────────────────────────────────────
    es.addEventListener('error', (e) => {
      try {
        const data = parseEventData(e.data) || {};
        setError(data.message || 'Unknown error');
      } catch {
        setError('Connection error — is the backend running?');
      }
      setIsThinking(false);
      setStep(0);
      closeEventSource();
    });

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) return;
      setError('Lost connection to Chitti backend. Ensure the server is running on port 8000.');
      setIsThinking(false);
      closeEventSource();
    };
  }, [closeEventSource, reset]);

  useEffect(() => () => closeEventSource(), [closeEventSource]);

  return (
    <AppCtx.Provider value={{
      theme, toggleTheme,
      query, setQuery,
      step, setStep,
      isThinking, setIsThinking,
      activeAgents, setActiveAgents,
      ideas, setIdeas,
      output, setOutput,
      iteration, setIteration,
      totalIterations,
      agentStats, setAgentStats,
      error, setError,
      swarmMeta,
      reset,
      askChitti,
      API_BASE,
    }}>
      {children}
    </AppCtx.Provider>
  );
}
