import React from 'react';
import { useNavigate } from 'react-router-dom';

const TEAM_PRINCIPLES = [
  { icon: '🧬', title: 'Evolution over Configuration', desc: 'Systems that adapt beat systems that are perfectly tuned. Chitti agents evolve every query.' },
  { icon: '🎯', title: 'Accuracy is Non-Negotiable', desc: 'Multi-agent consensus scoring exists to ensure quality, not just quantity of ideas.' },
  { icon: '🔬', title: 'Radical Transparency', desc: 'Every agent thought, every score, every pruning decision is visible. No black boxes.' },
  { icon: '🌐', title: 'Open Source First', desc: 'AI infrastructure should be auditable. Every component of Chitti is MIT-licensed and forkable.' },
];

const TECH_LAYERS = [
  { layer: 'Frontend', tech: 'React + Vite', desc: 'Real-time SSE streaming UI with live agent dashboards', color: '#00d4aa' },
  { layer: 'Orchestration', tech: 'FastAPI + SSE', desc: 'Sub-50ms event streaming for every agent thought', color: '#ffb84d' },
  { layer: 'Agent Graph', tech: 'LangGraph', desc: 'Stateful multi-agent workflow with Darwin evolution nodes', color: '#4d9eff' },
  { layer: 'Inference', tech: 'Groq API', desc: 'Ultra-fast LLaMA inference — because slow agents lose evolutionary pressure', color: '#c084fc' },
  { layer: 'Memory', tech: 'MCP Server', desc: 'Shared stigmergic memory substrate — agents communicate through traces', color: '#ff5f7e' },
  { layer: 'Scoring', tech: 'Custom Scorer', desc: 'Cross-agent idea quality scoring with entropy-weighted consensus', color: '#00d4aa' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#07080f', color: '#e8eaf6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", paddingTop: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none} }
      `}</style>

      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.05) 0%, transparent 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 16 }}>ABOUT CHITTI-AI</div>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', fontFamily: "'Space Mono', monospace", fontWeight: 700, lineHeight: 1.2, marginBottom: 22 }}>
            Built to prove that<br /><span style={{ color: '#00d4aa' }}>competition beats collaboration</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 540, margin: '0 auto' }}>
            Chitti-AI started as a research question: <em>"What if AI agents had to compete for survival?"</em> The result is a self-evolving multi-agent system that produces measurably better answers by forcing adversarial reasoning at every step.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: 70 }}>

        {/* Origin Story */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 12 }}>ORIGIN STORY</div>
            <h2 style={{ fontSize: 28, fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 18 }}>Why "Chitti"?</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 16 }}>
              Named after the iconic Tamil sci-fi robot — an AI designed not just to serve, but to evolve. Chitti-AI embodies that vision: a system that doesn't just execute instructions but genuinely improves its reasoning with each iteration.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
              The multi-agent Darwin engine was inspired by natural selection: in biological systems, competition drives quality. We applied the same logic to AI reasoning — agents that produce weak ideas get pruned. The strong survive and seed the next generation.
            </p>
          </div>
          <div style={{ background: '#0d0f1a', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 64, textAlign: 'center', marginBottom: 20 }}>⬡</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['The Hypothesis', 'Competition forces quality'],
                ['The Mechanism', 'Darwin scoring + pruning'],
                ['The Result', '85%+ consensus accuracy'],
                ['The Insight', 'Stigmergy beats collaboration'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono', monospace" }}>{label}</span>
                  <span style={{ fontSize: 13, color: '#00d4aa', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Principles */}
        <div>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 12 }}>DESIGN PRINCIPLES</div>
          <h2 style={{ fontSize: 28, fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 32 }}>What we believe</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {TEAM_PRINCIPLES.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 12 }}>ARCHITECTURE</div>
          <h2 style={{ fontSize: 28, fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 32 }}>How it's built</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
            {TECH_LAYERS.map(({ layer, tech, desc, color }, i) => (
              <div key={layer} style={{ display: 'flex', gap: 20, padding: '18px 24px', alignItems: 'center', borderBottom: i < TECH_LAYERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width: 100, minWidth: 100 }}>
                  <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 3 }}>{layer.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontFamily: "'Space Mono', monospace", fontWeight: 700, color }}>{tech}</div>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(77,158,255,0.04))', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 20, padding: '60px 40px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔬</div>
          <h2 style={{ fontSize: 26, fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 16 }}>
            Open Source. <span style={{ color: '#00d4aa' }}>Fully Auditable.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Every agent personality, scoring algorithm and MCP orchestration layer is open and forkable. Build on top of it.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => navigate('/')} style={{
              padding: '13px 28px', background: 'linear-gradient(135deg, #00d4aa, #00a882)',
              border: 'none', borderRadius: 10, color: '#000', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Space Mono', monospace", letterSpacing: 1,
            }}>TRY IT LIVE →</button>
            <button onClick={() => navigate('/novelty')} style={{
              padding: '13px 28px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
              color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>WHY IT'S NOVEL</button>
          </div>
        </div>
      </div>
    </div>
  );
}
