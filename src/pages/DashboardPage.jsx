import React, { useState, useEffect } from 'react';

const AGENTS = [
  { emoji: '🧠', name: 'Agent A-01', role: 'Analytical Reasoning', color: '#00d4aa', bg: 'rgba(0,212,170,0.1)', score: 8.7, ideas: 11 },
  { emoji: '✦', name: 'Agent A-02', role: 'Creative Divergence', color: '#ff5f7e', bg: 'rgba(255,95,126,0.1)', score: 7.2, ideas: 9 },
  { emoji: '◈', name: 'Agent A-03', role: 'Pattern Recognition', color: '#ffb84d', bg: 'rgba(255,184,77,0.1)', score: 8.1, ideas: 10 },
  { emoji: '◉', name: 'Agent A-04', role: 'Convergent Synthesis', color: '#4d9eff', bg: 'rgba(77,158,255,0.1)', score: 6.9, ideas: 8 },
  { emoji: '⬡', name: 'Agent A-05', role: 'Pragmatic Evaluation', color: '#c084fc', bg: 'rgba(192,132,252,0.1)', score: 7.8, ideas: 9 },
];

const SAMPLE_IDEAS = [
  { agent: 0, content: 'Start with fundamentals: HTML structure defines content hierarchy, not visual layout.', score: 8.7, iter: 1 },
  { agent: 1, content: 'Gamify learning: build a real project from Day 1, even if broken — momentum > perfection.', score: 7.2, iter: 1 },
  { agent: 2, content: 'Day 1–2: HTML. Day 3–4: CSS box model. Day 5–6: JS basics. Day 7: deploy something.', score: 8.1, iter: 2 },
  { agent: 3, content: 'Synthesising top ideas: structured roadmap + project-based learning + daily deployment targets.', score: 8.5, iter: 3 },
  { agent: 4, content: 'Pragmatically: free resources only. FreeCodeCamp + MDN + GitHub Pages. Zero friction entry.', score: 7.8, iter: 2 },
];

function Ring({ value, max = 10, size = 110, stroke = 8, color = '#00d4aa', label, sub }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const dash = circ * pct;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', top: 0, width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{label}</div>
        {sub && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [time, setTime] = useState(0);
  const [activeIdea, setActiveIdea] = useState(0);
  const [iter, setIter] = useState(2);

  useEffect(() => {
    const t = setInterval(() => setTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveIdea(p => (p + 1) % SAMPLE_IDEAS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ background: '#07080f', color: '#e8eaf6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", paddingTop: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes pulse2 { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,212,170,0.4)}50%{opacity:.7;box-shadow:0 0 0 5px rgba(0,212,170,0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
        @keyframes ideaIn { from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none} }
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,212,170,0.2);border-radius:2px}
      `}</style>

      {/* Page Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 6 }}>LIVE DASHBOARD</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>Swarm Intelligence Monitor</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 20, padding: '6px 14px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', animation: 'pulse2 1.5s infinite' }} />
            <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 1 }}>LIVE SESSION</span>
          </div>
          <span style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.4)' }}>{fmt(time)}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Active Query */}
        <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 22px' }}>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 6 }}>ACTIVE QUERY</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>"Create a 7-day web development learning plan for beginners"</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['init', 'activate', 'thinking', 'scoring', 'output'].map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 2, background: i < iter ? '#00d4aa' : i === iter ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
                    {i === iter && <div style={{ position: 'absolute', top: 0, left: '-40%', width: '40%', height: '100%', background: '#00d4aa', animation: 'slide 1.4s ease-in-out infinite' }} />}
                  </div>
                  <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: i <= iter ? '#00d4aa' : 'rgba(255,255,255,0.2)', marginTop: 4 }}>{s}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {/* Consensus Ring */}
          <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 14 }}>CONSENSUS SCORE</div>
            <Ring value={8.5} max={10} color="#00d4aa" label="8.5" sub="/ 10" />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>Strong multi-agent consensus</div>
          </div>

          {/* Darwin Status */}
          <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 14 }}>DARWIN ENGINE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {AGENTS.map((a, i) => (
                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{a.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ width: `${(a.score / 10) * 100}%`, height: '100%', background: a.color, borderRadius: 2, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: a.color, minWidth: 30 }}>{a.score}</span>
                  {i === 0 && <span style={{ fontSize: 8, background: '#ffb84d', color: '#000', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>ELITE</span>}
                  {i === 3 && <span style={{ fontSize: 8, background: '#ff5f7e', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>LOW</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'TOTAL IDEAS', value: 47, color: '#00d4aa', sub: 'generated this session' },
              { label: 'ITERATIONS', value: '2/3', color: '#ffb84d', sub: 'evolution cycles' },
              { label: 'SURVIVAL RATE', value: '80%', color: '#4d9eff', sub: 'agents survived pruning' },
              { label: 'TOP SCORE', value: '8.7', color: '#c084fc', sub: 'best idea this session' },
            ].map(({ label, value, color, sub }) => (
              <div key={label} style={{ flex: 1, background: '#0d0f1a', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 10, padding: '12px 16px', borderTop: `2px solid ${color}` }}>
                <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", color }}>{value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Grid + Live Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Agent Cards */}
          <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 16 }}>AGENT SWARM STATUS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AGENTS.map((a, i) => (
                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: a.bg, borderRadius: 10, border: `1px solid ${a.color}22` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: `1px solid ${a.color}44` }}>{a.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: a.color }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{a.role}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${(a.ideas / 12) * 100}%`, height: '100%', background: a.color, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>{a.ideas} ideas</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: '#ffb84d' }}>{a.score}</div>
                  {i === 0 && <div style={{ fontSize: 8, background: '#ffb84d', color: '#000', padding: '2px 7px', borderRadius: 4, fontWeight: 800 }}>ELITE</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Live Idea Feed */}
          <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span>LIVE IDEA STREAM</span>
              <span style={{ color: '#00d4aa' }}>47 ideas</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SAMPLE_IDEAS.map((idea, i) => {
                const ag = AGENTS[idea.agent];
                return (
                  <div key={i} style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: i === activeIdea ? ag.bg : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${i === activeIdea ? ag.color + '44' : 'rgba(255,255,255,0.05)'}`,
                    borderLeft: `3px solid ${ag.color}`,
                    transition: 'all 0.3s ease',
                    animation: i === activeIdea ? 'ideaIn 0.4s ease' : 'none',
                  }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                      <span style={{ fontSize: 12 }}>{ag.emoji}</span>
                      <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: ag.color, fontWeight: 700 }}>{ag.name}</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>iter {idea.iter}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#ffb84d', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>★ {idea.score}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{idea.content}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Final Output Sample */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(77,158,255,0.04))', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 14, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 10px #00d4aa' }} />
            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 2 }}>SYNTHESISED ANSWER (PREVIEW)</div>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, borderLeft: '2px solid rgba(0,212,170,0.2)', paddingLeft: 16 }}>
            <strong style={{ color: '#00d4aa' }}>7-Day Web Dev Plan for Beginners:</strong><br />
            Day 1–2: HTML fundamentals — structure, semantics, forms. Build a static page.<br />
            Day 3–4: CSS — box model, flexbox, responsive basics. Style your page.<br />
            Day 5–6: JavaScript — variables, DOM manipulation, events.<br />
            Day 7: Integrate everything. Deploy to GitHub Pages. Celebrate. 🚀
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 20, padding: '14px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 10 }}>
            {[['47', 'Ideas Generated', '#00d4aa'], ['5', 'Agents Started', '#4d9eff'], ['1', 'Pruned', '#ff5f7e'], ['4', 'Survived', '#ffb84d'], ['3', 'Iterations', '#c084fc']].map(([v, l, c]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Space Mono', monospace", color: c }}>{v}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes slide{0%{left:-40%}100%{left:140%}}`}</style>
    </div>
  );
}
