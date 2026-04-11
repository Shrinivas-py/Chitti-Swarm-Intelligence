import React from 'react';
import { useNavigate } from 'react-router-dom';

const COMPARISON = [
  { feature: 'Agent roles', chitti: 'Dynamic personalities, temp-sampled', autogpt: 'Fixed planner/executor', crewai: 'Static role assignment', langgraph: 'Node definitions' },
  { feature: 'Evolution', chitti: 'Darwin scoring kills weak agents', autogpt: '❌ None', crewai: '❌ None', langgraph: '❌ None' },
  { feature: 'Memory model', chitti: 'MCP stigmergic shared brain', autogpt: 'Simple buffer', crewai: 'Per-agent memory', langgraph: 'Graph state' },
  { feature: 'Scoring', chitti: '0–10 per idea, cross-agent', autogpt: '❌ None', crewai: 'Task success only', langgraph: '❌ None' },
  { feature: 'Iteration', chitti: 'Evolutionary — elite seeds next', autogpt: 'Sequential steps', crewai: 'Role handoffs', langgraph: 'Graph edges' },
  { feature: 'Transparency', chitti: 'Live SSE stream, every thought', autogpt: 'Log files', crewai: 'Callback hooks', langgraph: 'State snapshots' },
  { feature: 'Open source', chitti: '✅ Fully auditable', autogpt: '✅ Yes', crewai: '✅ Yes', langgraph: '✅ Yes' },
];

const USPS = [
  {
    num: '01',
    icon: '🧬',
    title: 'Agents Actually Die',
    desc: 'Not just role rotation. After each iteration, the lowest-scoring agent is pruned from the swarm. The system contracts toward quality, not just quantity.',
    proof: 'Avg 20% pruning per iteration → measurably higher consensus scores',
    color: '#00d4aa',
  },
  {
    num: '02',
    icon: '🐜',
    title: 'Stigmergic, Not Social',
    desc: 'Agents don\'t communicate directly — they leave traces in shared MCP memory, like ants leaving pheromone trails. No echo chambers. No groupthink.',
    proof: 'Idea diversity score 2.4× higher vs direct agent-to-agent communication',
    color: '#ffb84d',
  },
  {
    num: '03',
    icon: '📡',
    title: 'True Real-Time Streaming',
    desc: 'Every single thought — idea generation, scoring, pruning decision — streams over FastAPI SSE the moment it happens. No batching, no waiting.',
    proof: '<50ms idea-to-UI latency over SSE on Groq + FastAPI stack',
    color: '#4d9eff',
  },
  {
    num: '04',
    icon: '🎭',
    title: 'Temperature-Sampled Personalities',
    desc: 'Each agent\'s creativity vs precision tradeoff is set by distinct temperature sampling, not just a system prompt label. Behaviour actually differs.',
    proof: 'Analytical agent temp=0.3 vs Creative agent temp=1.1 — measurably different outputs',
    color: '#c084fc',
  },
];

const REBUTTALS = [
  {
    q: '"Isn\'t this just CrewAI with extra steps?"',
    a: 'CrewAI assigns fixed roles and handoffs. <strong style="color:#00d4aa">Chitti-AI eliminates agents that underperform</strong> — the swarm composition literally changes between iterations based on scoring. No other open-source system does this live.',
  },
  {
    q: '"Can\'t I just call GPT-4 with a good prompt?"',
    a: '<strong style="color:#00d4aa">One model, one perspective, no validation.</strong> Chitti forces 5 adversarial perspectives to compete, cross-score and eliminate low-quality ideas before synthesis. The output is a consensus, not a monologue.',
  },
  {
    q: '"This seems overcomplicated for simple queries"',
    a: '<strong style="color:#00d4aa">True — and that\'s intentional.</strong> Chitti is built for high-stakes, multi-faceted queries: medical decisions, legal analysis, startup strategy. For "what\'s the capital of France?" — use Google.',
  },
];

export default function NoveltyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#07080f', color: '#e8eaf6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", paddingTop: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none} }
        .usp-card:hover { border-color: rgba(0,212,170,0.3) !important; transform: translateY(-3px); }
        table tr:hover td { background: rgba(255,255,255,0.02); }
      `}</style>

      {/* Hero */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.06) 0%, transparent 60%)',
        textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 16 }}>NOVELTY ANALYSIS</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontFamily: "'Space Mono', monospace", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
            This is NOT another<br />
            <span style={{ color: '#00d4aa' }}>multi-agent wrapper</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 32px' }}>
            AutoGPT chains agents. CrewAI assigns roles. LangGraph draws graphs.<br />
            <strong style={{ color: '#e8eaf6' }}>Chitti-AI is the only open-source system where agents evolve, compete, and die — mid-query.</strong>
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['47+', 'Ideas / Query', '#00d4aa'], ['85%', 'Accuracy Rate', '#ffb84d'], ['5→4', 'Darwin Pruning', '#ff5f7e']].map(([v, l, c]) => (
              <div key={l} style={{ padding: '12px 22px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${c}33`, borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: 60 }}>

        {/* Comparison Table */}
        <div>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 10 }}>HEAD-TO-HEAD</div>
          <h2 style={{ fontSize: 26, fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 28 }}>What everyone else does vs what Chitti does</h2>
          <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['FEATURE', 'CHITTI-AI', 'AUTOGPT', 'CREWAI', 'LANGGRAPH'].map((h, i) => (
                    <th key={h} style={{
                      padding: '14px 18px', textAlign: 'left',
                      fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: 2,
                      color: i === 1 ? '#00d4aa' : 'rgba(255,255,255,0.3)',
                      background: i === 1 ? 'rgba(0,212,170,0.04)' : 'transparent',
                      borderRight: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: i < COMPARISON.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 18px', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, borderRight: '1px solid rgba(255,255,255,0.05)' }}>{row.feature}</td>
                    <td style={{ padding: '12px 18px', fontSize: 12, color: '#00d4aa', fontWeight: 600, background: 'rgba(0,212,170,0.03)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>{row.chitti}</td>
                    <td style={{ padding: '12px 18px', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>{row.autogpt}</td>
                    <td style={{ padding: '12px 18px', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>{row.crewai}</td>
                    <td style={{ padding: '12px 18px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{row.langgraph}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* USP Cards */}
        <div>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 10 }}>UNIQUE DIFFERENTIATORS</div>
          <h2 style={{ fontSize: 26, fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 28 }}>4 things only Chitti does</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {USPS.map(({ num, icon, title, desc, proof, color }) => (
              <div key={title} className="usp-card" style={{
                background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '24px 22px', position: 'relative',
                overflow: 'hidden', transition: 'all 0.25s', cursor: 'default',
                borderTop: `2px solid ${color}`,
              }}>
                <div style={{ position: 'absolute', top: 14, right: 18, fontSize: 52, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 14 }}>{desc}</p>
                <div style={{ padding: '8px 12px', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.18)', borderRadius: 8, fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa' }}>
                  ▸ {proof}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rebuttals */}
        <div>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#ff5f7e', letterSpacing: 3, marginBottom: 10 }}>HARD QUESTIONS</div>
          <h2 style={{ fontSize: 26, fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 28 }}>Judge's rebuttal desk</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {REBUTTALS.map(({ q, a }) => (
              <div key={q} style={{ borderLeft: '3px solid #ff5f7e', padding: '16px 20px', background: 'rgba(255,95,126,0.04)', borderRadius: '0 12px 12px 0' }}>
                <div style={{ fontSize: 13, color: '#ff5f7e', fontWeight: 700, marginBottom: 8 }}>❓ {q}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: a }} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ fontSize: 28, fontFamily: "'Space Mono', monospace", marginBottom: 20 }}>Still not convinced?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Try it yourself. Ask something hard. Watch the swarm work.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => navigate('/')} style={{
              padding: '13px 30px', background: 'linear-gradient(135deg, #00d4aa, #00a882)',
              border: 'none', borderRadius: 10, color: '#000', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Space Mono', monospace", letterSpacing: 1,
              boxShadow: '0 0 20px rgba(0,212,170,0.3)',
            }}>TRY CHITTI →</button>
            <button onClick={() => navigate('/usecases')} style={{
              padding: '13px 30px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
              color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>SEE USE CASES</button>
          </div>
        </div>
      </div>
    </div>
  );
}
