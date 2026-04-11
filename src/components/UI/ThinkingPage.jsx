import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AGENTS } from '../../store/AppContext';

const STEP_LABELS = ['Idle', 'Agents Online', 'Swarm Thinking', 'Scoring', 'Done'];

function computeAccuracy(ideas) {
  if (ideas.length < 2) return null;
  const scored = ideas.filter(i => i.score > 0);
  if (scored.length < 2) return null;
  const avg = scored.reduce((s, i) => s + i.score, 0) / scored.length;
  const max = Math.max(...scored.map(i => i.score));
  return { avg: avg.toFixed(1), max: max.toFixed(1), count: scored.length };
}

function ProgressRing({ value, max, size = 70, stroke = 5, color = '#00d4aa', label, sublabel }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const dash = circ * pct;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      </svg>
      <div style={{ position: 'absolute', top: 0, width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color, fontFamily: "'Space Mono', monospace" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color = '#00d4aa' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 4, width: '100%', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
    </div>
  );
}

function MetricCard({ label, value, sub, color = '#00d4aa', icon }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, padding: '12px 14px', borderTop: `2px solid ${color}`,
    }}>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, marginBottom: 6, display: 'flex', gap: 5 }}>
        {icon && <span>{icon}</span>}{label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function AgentCard({ agent, stat, isElite, isPruned }) {
  const active = stat.ideas > 0;
  const statusColor = isPruned ? '#ff5f7e' : isElite ? '#ffb84d' : agent.color;
  return (
    <div style={{
      background: active ? agent.bg : 'rgba(255,255,255,0.02)',
      border: `1px solid ${active ? statusColor + '55' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 10, padding: '10px 14px', transition: 'all 0.4s ease',
      opacity: isPruned ? 0.5 : 1, position: 'relative', overflow: 'hidden',
    }}>
      {isElite && <div style={{ position: 'absolute', top: 0, right: 0, background: '#ffb84d', color: '#000', fontSize: 8, fontWeight: 800, padding: '2px 7px', borderBottomLeftRadius: 8, letterSpacing: 1 }}>ELITE</div>}
      {isPruned && <div style={{ position: 'absolute', top: 0, right: 0, background: '#ff5f7e', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 7px', borderBottomLeftRadius: 8, letterSpacing: 1 }}>PRUNED</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 15 }}>{agent.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: statusColor, fontFamily: "'Space Mono', monospace" }}>{agent.name}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{agent.role}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#ffb84d', fontFamily: "'Space Mono', monospace" }}>
          {stat.score > 0 ? stat.score.toFixed(1) : '—'}
        </div>
      </div>
      <ProgressBar value={stat.ideas} max={12} color={statusColor} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
        <span>{stat.ideas} ideas</span>
        <span>{stat.score > 0 ? `★ ${stat.score.toFixed(1)}` : 'pending'}</span>
      </div>
    </div>
  );
}

function IdeaFeed({ ideas }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [ideas]);
  if (ideas.length === 0) return (
    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', padding: '24px 0', fontFamily: "'Space Mono', monospace" }}>
      ▸ AWAITING AGENT TRANSMISSIONS...
    </div>
  );
  return (
    <div ref={ref} style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {ideas.map((idea) => {
        const agentDef = AGENTS.find(a => a.style === idea.agent_style) || AGENTS[0];
        return (
          <div key={idea.id} style={{
            background: agentDef.bg, border: `1px solid ${agentDef.color}33`,
            borderLeft: `3px solid ${agentDef.color}`, borderRadius: 8,
            padding: '8px 12px', animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 3, alignItems: 'center' }}>
              <span style={{ fontSize: 11 }}>{agentDef.emoji}</span>
              <span style={{ fontSize: 10, color: agentDef.color, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{idea.agent_id}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>iter {idea.iteration}</span>
              {idea.score > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#ffb84d', fontWeight: 800, fontFamily: "'Space Mono', monospace" }}>
                  ★ {idea.score.toFixed(1)}
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{idea.content}</div>
          </div>
        );
      })}
    </div>
  );
}

function AccuracyDashboard({ ideas, swarmMeta, iteration, totalIterations, agentStats }) {
  const acc = computeAccuracy(ideas);
  const avgScore = acc ? parseFloat(acc.avg) : 0;
  const topIdeas = ideas.filter(i => i.score >= 7);
  const consensusPct = ideas.length > 0 ? Math.round((topIdeas.length / Math.max(ideas.length, 1)) * 100) : 0;
  const iterPct = Math.round((iteration / Math.max(totalIterations, 1)) * 100);
  const survivalRate = swarmMeta ? Math.round((swarmMeta.agentsSurvived / swarmMeta.agentsStarted) * 100) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}>SWARM ACCURACY DASHBOARD</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-around', padding: '8px 0' }}>
        <ProgressRing value={avgScore} max={10} color="#00d4aa" label={avgScore > 0 ? `${avgScore}` : '—'} sublabel="AVG SCORE" />
        <ProgressRing value={consensusPct} max={100} color="#ffb84d" label={`${consensusPct}%`} sublabel="CONSENSUS" />
        <ProgressRing value={iterPct} max={100} color="#4d9eff" label={`${iterPct}%`} sublabel="PROGRESS" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricCard label="TOTAL IDEAS" value={ideas.length} sub="generated by swarm" color="#00d4aa" icon="💡" />
        <MetricCard label="TOP SCORE" value={acc ? acc.max : '—'} sub="best idea score /10" color="#ffb84d" icon="★" />
        <MetricCard label="ACTIVE AGENTS" value={agentStats.filter(a=>a.ideas>0).length} sub={survivalRate !== null ? `${survivalRate}% survival` : 'of 5 total'} color="#4d9eff" icon="⬡" />
        <MetricCard label="ITERATION" value={`${iteration}/${totalIterations}`} sub="evolution cycles" color="#c084fc" icon="🔄" />
      </div>
    </div>
  );
}

function FinalOutput({ output, swarmMeta, onReset }) {
  if (!output) return null;
  const started = swarmMeta?.agentsStarted || 1;
  const survived = swarmMeta?.agentsSurvived || 0;
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(77,158,255,0.04))',
      border: '1px solid rgba(0,212,170,0.3)', borderRadius: 14, padding: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 10px #00d4aa' }} />
        <div style={{ fontSize: 10, color: '#00d4aa', fontWeight: 700, letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}>CHITTI SYNTHESISED ANSWER</div>
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 1.8, whiteSpace: 'pre-wrap', borderLeft: '2px solid rgba(0,212,170,0.25)', paddingLeft: 14 }}>
        {output}
      </div>
      <div style={{ marginTop: 18, padding: '12px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, marginBottom: 10, fontFamily: "'Space Mono', monospace" }}>RUN SUMMARY</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            ['Ideas Generated', swarmMeta?.totalIdeas || 0, '#00d4aa'],
            ['Agents Started', started, '#4d9eff'],
            ['Pruned', started - survived, '#ff5f7e'],
            ['Elite Survived', survived, '#ffb84d'],
            ['Iterations', swarmMeta?.iterationsRun || '—', '#c084fc'],
          ].map(([label, value, color]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: "'Space Mono', monospace" }}>{value}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onReset} style={{
        marginTop: 14, padding: '9px 20px', background: 'transparent',
        border: '1px solid rgba(0,212,170,0.4)', borderRadius: 8, color: '#00d4aa',
        fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono', monospace", letterSpacing: 1,
      }}>← NEW QUERY</button>
    </div>
  );
}

export default function ThinkingPage() {
  const { query, step, isThinking, activeAgents, ideas, output, iteration, totalIterations, agentStats, error, swarmMeta, reset } = useApp();
  const navigate = useNavigate();
  const [showDarwin, setShowDarwin] = useState(false);
  useEffect(() => { if (step >= 3) setShowDarwin(true); }, [step]);
  const handleReset = () => { reset(); navigate('/'); };

  const sortedStats = [...agentStats].sort((a, b) => b.score - a.score);
  const eliteIds = new Set(sortedStats.slice(0, 1).filter(a => a.score > 0).map(a => a.id));
  const prunedIds = new Set(sortedStats.slice(-1).filter(a => a.score > 0).map(a => a.id));

  return (
    <div style={{ minHeight: '100vh', background: '#07080f', color: '#e8eaf6', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: '0 0 60px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        @keyframes spin { to { transform:rotate(360deg); } }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '13px 24px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,8,15,0.94)', backdropFilter: 'blur(16px)' }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#00d4aa', fontFamily: "'Space Mono', monospace" }}>⬡ CHITTI</div>
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{query}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isThinking ? 'rgba(0,212,170,0.08)' : 'rgba(77,158,255,0.08)', border: `1px solid ${isThinking ? '#00d4aa44' : '#4d9eff44'}`, borderRadius: 20, padding: '4px 11px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: isThinking ? '#00d4aa' : '#4d9eff', animation: isThinking ? 'pulse 1s infinite' : 'none' }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: isThinking ? '#00d4aa' : '#4d9eff', fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>{isThinking ? STEP_LABELS[step].toUpperCase() : 'COMPLETE'}</span>
        </div>
        {!isThinking && <button onClick={handleReset} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'rgba(255,255,255,0.45)', padding: '5px 11px', cursor: 'pointer', fontSize: 10, fontFamily: "'Space Mono', monospace" }}>NEW QUERY</button>}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
            <AccuracyDashboard ideas={ideas} swarmMeta={swarmMeta} iteration={iteration} totalIterations={totalIterations} agentStats={agentStats} />
          </div>
          {step >= 2 && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 10 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>SWARM PROGRESS</span>
                <span style={{ color: '#00d4aa', fontFamily: "'Space Mono', monospace" }}>ITER {iteration} / {totalIterations}</span>
              </div>
              <ProgressBar value={iteration} max={totalIterations} color="#00d4aa" />
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {Array.from({ length: totalIterations }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 22, borderRadius: 5, background: i < iteration ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i < iteration ? '#00d4aa44' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: i < iteration ? '#00d4aa' : 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                    {i < iteration ? '✓' : `${i+1}`}
                  </div>
                ))}
              </div>
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(255,95,126,0.08)', border: '1px solid #ff5f7e44', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ color: '#ff5f7e', fontWeight: 700, marginBottom: 4, fontFamily: "'Space Mono', monospace", fontSize: 10 }}>⚠ SWARM ERROR</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{error}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Is the backend running on port 8000?</div>
              <button onClick={handleReset} style={{ marginTop: 10, background: 'none', border: '1px solid #ff5f7e', color: '#ff5f7e', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>Retry</button>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}>LIVE AGENT FEED</div>
              {ideas.length > 0 && <div style={{ fontSize: 9, color: '#00d4aa', fontFamily: "'Space Mono', monospace" }}>{ideas.length} ideas generated</div>}
            </div>
            <IdeaFeed ideas={ideas} />
          </div>
          <FinalOutput output={output} swarmMeta={swarmMeta} onReset={handleReset} />
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}>AGENT SWARM ({activeAgents}/{AGENTS.length})</div>
          {AGENTS.map((agent) => {
            const stat = agentStats[agent.id] || { ideas: 0, score: 0 };
            return <AgentCard key={agent.id} agent={agent} stat={stat} isElite={showDarwin && eliteIds.has(agent.id) && stat.score > 0} isPruned={showDarwin && prunedIds.has(agent.id) && stat.score > 0} />;
          })}
          {showDarwin && (
            <div style={{ background: 'rgba(255,184,77,0.05)', border: '1px solid rgba(255,184,77,0.2)', borderRadius: 10, padding: '10px 12px', fontSize: 10, lineHeight: 1.7 }}>
              <div style={{ color: '#ffb84d', fontWeight: 700, marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>⬡ DARWIN ENGINE</div>
              <div style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ color: '#ffb84d' }}>ELITE</span> = top 20%, seeds next iteration<br />
                <span style={{ color: '#ff5f7e' }}>PRUNED</span> = bottom 30%, removed
              </div>
            </div>
          )}
          <div style={{ background: 'rgba(77,158,255,0.05)', border: '1px solid rgba(77,158,255,0.2)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ color: '#4d9eff', fontWeight: 700, marginBottom: 4, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>⬡ MCP SHARED BRAIN</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
              Agents write to & read from shared MCP memory. Stigmergic, not social — no echo chambers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
