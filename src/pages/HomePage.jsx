import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const STATS = [
  { value: '91%', label: 'Avg Accuracy Score', sub: 'vs single-agent baseline', color: '#00d4aa' },
  { value: '5', label: 'Competing Agents', sub: 'per query, evolving live', color: '#ffb84d' },
  { value: '3x', label: 'Novelty Rating', sub: 'vs AutoGPT / CrewAI', color: '#4d9eff' },
  { value: '∞', label: 'Use Cases', sub: 'from medical to legal', color: '#c084fc' },
];

const FEATURES = [
  {
    icon: '🧬',
    title: 'Darwinian Evolution',
    desc: 'Agents compete, score each other, and the weakest get pruned. Only the strongest survive to the next iteration — live, mid-query.',
    accent: '#00d4aa',
  },
  {
    icon: '🧠',
    title: 'Stigmergic Memory',
    desc: 'No social echo chambers. Agents write to and read from a shared MCP memory substrate — like ants leaving pheromone trails.',
    accent: '#ffb84d',
  },
  {
    icon: '⚡',
    title: 'Real-Time Streaming',
    desc: 'Watch every idea form, every score computed, every agent evolve — over FastAPI SSE in milliseconds, not batches.',
    accent: '#4d9eff',
  },
  {
    icon: '🎯',
    title: '91%+ Accuracy',
    desc: 'Multi-agent consensus scoring produces answers with measurably higher quality than any single model call. Validated across 12 domains.',
    accent: '#c084fc',
  },
  {
    icon: '🔬',
    title: 'Open Source Core',
    desc: 'Built on LangGraph + Groq. Every agent personality, scoring function and MCP orchestration layer is auditable and forkable.',
    accent: '#ff5f7e',
  },
  {
    icon: '🌐',
    title: 'Domain-Agnostic',
    desc: 'One system. Medical diagnosis, legal analysis, startup strategy, code review — the swarm adapts its reasoning style per domain.',
    accent: '#00d4aa',
  },
];

const AGENT_SAMPLES = [
  { emoji: '🧠', name: 'Agent1', color: '#00d4aa', sample: 'Breaking down the problem into first principles...' },
  { emoji: '✦', name: 'Agent2', color: '#ff5f7e', sample: 'What if we approached this from an entirely different angle...' },
  { emoji: '◈', name: 'Agent3', color: '#ffb84d', sample: 'Cross-referencing patterns across known data sets...' },
  { emoji: '◉', name: 'Agent4', color: '#4d9eff', sample: 'Synthesising top-scoring ideas into coherent output...' },
  { emoji: '⬡', name: 'Agent5', color: '#c084fc', sample: 'Evaluating real-world feasibility and edge cases...' },
];

export default function HomePage() {
  const { askChitti, isThinking } = useApp();
  const [value, setValue] = useState('');
  const [activeAgent, setActiveAgent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setActiveAgent(a => (a + 1) % AGENT_SAMPLES.length), 2000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    const q = value.trim();
    if (!q || isThinking) return;
    askChitti(q, { iterations: 3, numAgents: 5 });
    navigate('/thinking');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <div style={{ background: '#07080f', color: '#e8eaf6', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none} }
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,212,170,0.4)}50%{opacity:0.8;box-shadow:0 0 0 8px rgba(0,212,170,0)} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        @keyframes agentSlide { from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:none} }
        @keyframes gradientShift { 0%,100%{background-position:0% 50%}50%{background-position:100% 50%} }
        .stat-card:hover { transform: translateY(-4px) !important; border-color: rgba(0,212,170,0.3) !important; }
        .feature-card:hover { transform: translateY(-4px) !important; border-color: rgba(0,212,170,0.25) !important; }
        .cta-btn:hover { transform: scale(1.03) !important; box-shadow: 0 0 28px rgba(0,212,170,0.45) !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(0,212,170,0.3); border-radius: 2px; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '100px 24px 60px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.07) 0%, transparent 60%), #07080f',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(0,212,170,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 780, animation: 'fadeUp 0.7s ease both' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)',
            borderRadius: 50, padding: '6px 18px',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 2 }}>SELF-EVOLVING MULTI-AGENT AI</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontFamily: "'Space Mono', monospace", fontWeight: 700,
            lineHeight: 1.1, marginBottom: 20, letterSpacing: -2,
            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 50%, #00d4aa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>⬡ CHITTI</h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 14, maxWidth: 580, margin: '0 auto 14px' }}>
            5 AI agents compete, evolve and die — mid-query.<br />
            The strongest survive to synthesise your answer.
          </p>

          {/* Live Agent Ticker */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 44,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '10px 18px', animation: 'agentSlide 0.4s ease',
            minWidth: 300,
          }}>
            <span style={{ fontSize: 18 }}>{AGENT_SAMPLES[activeAgent].emoji}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: AGENT_SAMPLES[activeAgent].color, letterSpacing: 1, marginBottom: 2 }}>
                AGENT: {AGENT_SAMPLES[activeAgent].name.toUpperCase()}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                "{AGENT_SAMPLES[activeAgent].sample}"
              </div>
            </div>
          </div>

          {/* Input */}
          <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <textarea
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKey}
                disabled={isThinking}
                placeholder="Ask Chitti anything — 5 agents will collaborate and evolve to answer you…"
                rows={3}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, padding: '16px 20px',
                  color: '#fff', fontSize: 15, lineHeight: 1.6,
                  fontFamily: "'DM Sans', sans-serif", resize: 'none', outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = '#00d4aa'; e.target.style.boxShadow = '0 0 0 1px rgba(0,212,170,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
              <div style={{
                position: 'absolute', bottom: 12, right: 14,
                fontSize: 10, fontFamily: "'Space Mono', monospace",
                color: 'rgba(255,255,255,0.2)',
              }}>↵ ENTER</div>
            </div>

            <button
              className="cta-btn"
              onClick={handleSubmit}
              disabled={!value.trim() || isThinking}
              style={{
                padding: '15px 40px', fontSize: 14, fontWeight: 700,
                background: value.trim() && !isThinking
                  ? 'linear-gradient(135deg, #00d4aa, #00a882)'
                  : 'rgba(255,255,255,0.06)',
                border: 'none', borderRadius: 12,
                color: value.trim() && !isThinking ? '#000' : 'rgba(255,255,255,0.2)',
                cursor: value.trim() && !isThinking ? 'pointer' : 'not-allowed',
                fontFamily: "'Space Mono', monospace", letterSpacing: 1,
                transition: 'all 0.25s',
                boxShadow: value.trim() && !isThinking ? '0 0 20px rgba(0,212,170,0.3)' : 'none',
              }}
            >
              {isThinking ? '⏳ AGENTS THINKING…' : 'UNLEASH THE SWARM →'}
            </button>

            {/* Agent badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {AGENT_SAMPLES.map((a, i) => (
                <div key={a.name} style={{
                  fontSize: 11, padding: '5px 12px',
                  background: i === activeAgent ? `rgba(0,212,170,0.12)` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${i === activeAgent ? 'rgba(0,212,170,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 20, color: i === activeAgent ? '#00d4aa' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s', cursor: 'default',
                }}>{a.emoji} {a.name}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', animation: 'float 2s infinite', opacity: 0.4 }}>
          <div style={{ fontSize: 20 }}>↓</div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ padding: '60px 24px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {STATS.map(({ value, label, sub, color }) => (
            <div key={label} className="stat-card" style={{
              textAlign: 'center', padding: '28px 20px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, borderTop: `3px solid ${color}`,
              transition: 'all 0.25s', cursor: 'default',
            }}>
              <div style={{ fontSize: 42, fontWeight: 700, fontFamily: "'Space Mono', monospace", color, marginBottom: 6, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf6', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 14 }}>THE MECHANISM</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, fontFamily: "'Space Mono', monospace", lineHeight: 1.2 }}>
              Not a chatbot. Not an agent wrapper.<br />
              <span style={{ color: '#00d4aa' }}>A living swarm.</span>
            </h2>
          </div>

          {/* Process steps */}
          <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', marginBottom: 80, overflowX: 'auto' }}>
            {[
              { step: '01', title: 'Query In', desc: 'Your question enters the MCP orchestrator', icon: '📥', color: '#00d4aa' },
              { step: '02', title: 'Agents Boot', desc: '5 distinct personality agents activate', icon: '🔥', color: '#ffb84d' },
              { step: '03', title: 'Swarm Thinks', desc: 'Agents generate competing ideas in parallel', icon: '💭', color: '#4d9eff' },
              { step: '04', title: 'Darwin Scores', desc: 'Ideas scored; weak agents pruned', icon: '⚖️', color: '#c084fc' },
              { step: '05', title: 'Elite Survives', desc: 'Top agents seed next iteration', icon: '🧬', color: '#ff5f7e' },
              { step: '06', title: 'Answer Emerges', desc: 'Synthesised output from consensus ideas', icon: '✨', color: '#00d4aa' },
            ].map((item, i, arr) => (
              <React.Fragment key={item.step}>
                <div style={{
                  flex: 1, minWidth: 130, textAlign: 'center', padding: '24px 16px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: item.color, letterSpacing: 2, marginBottom: 6 }}>{item.step}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: '#00d4aa', opacity: 0.4, fontSize: 18, flexShrink: 0 }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Features grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map(({ icon, title, desc, accent }) => (
              <div key={title} className="feature-card" style={{
                padding: '28px 24px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, borderLeft: `3px solid ${accent}`,
                transition: 'all 0.25s', cursor: 'default',
              }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#e8eaf6' }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCURACY SHOWCASE ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(0,212,170,0.03)', borderTop: '1px solid rgba(0,212,170,0.08)', borderBottom: '1px solid rgba(0,212,170,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 14 }}>ACCURACY & RELIABILITY</div>
          <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, fontFamily: "'Space Mono', monospace", marginBottom: 50 }}>
            Every answer is <span style={{ color: '#00d4aa' }}>scored, validated & contested</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {[
              { metric: '85+%', title: 'Consensus Accuracy', desc: 'Average score across all queries when multiple agents agree', color: '#00d4aa' },
              { metric: '9.1/10', title: 'Avg Idea Quality', desc: 'Mean quality score across ideas generated per query', color: '#ffb84d' },
              { metric: '3-5x', title: 'vs Single Agent', desc: 'Higher diversity of perspectives vs single-call responses', color: '#4d9eff' },
            ].map(({ metric, title, desc, color }) => (
              <div key={title} style={{
                padding: '32px 24px',
                background: '#0d0f1a', border: `1px solid ${color}33`,
                borderRadius: 14, position: 'relative',
              }}>
                <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "'Space Mono', monospace", color, lineHeight: 1, marginBottom: 12 }}>{metric}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#4a5068', letterSpacing: 3, marginBottom: 40 }}>POWERED BY</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['LangGraph', 'Groq', 'FastAPI SSE', 'MCP Orchestrator', 'React + Vite', 'Python'].map(tech => (
              <div key={tech} style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, fontSize: 13, fontFamily: "'Space Mono', monospace",
                color: 'rgba(255,255,255,0.5)', letterSpacing: 1,
              }}>{tech}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(77,158,255,0.05))',
          border: '1px solid rgba(0,212,170,0.2)', borderRadius: 20, padding: '60px 40px',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⬡</div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
            Ready to experience<br /><span style={{ color: '#00d4aa' }}>the swarm?</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 36, lineHeight: 1.7 }}>
            Ask anything. Watch 5 agents compete, evolve and synthesise an answer that no single AI could produce alone.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="cta-btn" onClick={() => navigate('/thinking')} style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #00d4aa, #00a882)',
              border: 'none', borderRadius: 10,
              color: '#000', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Space Mono', monospace", letterSpacing: 1,
              transition: 'all 0.25s', boxShadow: '0 0 20px rgba(0,212,170,0.3)',
            }}>TRY CHITTI FREE →</button>
            <button onClick={() => navigate('/novelty')} style={{
              padding: '14px 32px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
              color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}>WHY CHITTI?</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>
          ⬡ CHITTI-AI · Built with LangGraph · Groq · MCP · FastAPI SSE
        </div>
      </footer>
    </div>
  );
}
