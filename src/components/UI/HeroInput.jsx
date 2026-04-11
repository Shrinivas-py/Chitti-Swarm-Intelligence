import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

export default function HeroInput() {
  const { askChitti, isThinking } = useApp();
  const [value, setValue] = useState('');
  const navigate = useNavigate();

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
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#020817', fontFamily: "'Inter','Segoe UI',sans-serif", padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#0F8C8C', letterSpacing: -2, lineHeight: 1 }}>⬡ CHITTI</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8, letterSpacing: 3 }}>
            SELF-EVOLVING MULTI-AGENT AI
          </div>
        </div>

        {/* Input box */}
        <div style={{ width: '100%', position: 'relative' }}>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            disabled={isThinking}
            placeholder="Ask Chitti anything — 5 agents will collaborate and evolve to answer you…"
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14, padding: '18px 20px',
              color: '#fff', fontSize: 15, lineHeight: 1.6,
              fontFamily: 'inherit', resize: 'none', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#0F8C8C'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isThinking}
          style={{
            padding: '14px 40px', fontSize: 15, fontWeight: 700,
            background: value.trim() && !isThinking
              ? 'linear-gradient(135deg, #0F8C8C, #025959)'
              : 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: 10,
            color: value.trim() && !isThinking ? '#fff' : 'rgba(255,255,255,0.25)',
            cursor: value.trim() && !isThinking ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {isThinking ? '⏳ Agents Thinking…' : 'Ask Chitti →'}
        </button>

        {/* Agent badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['🧠 Analytical','✦ Creative','◈ Systematic','◉ Convergent','⬡ Pragmatic'].map(a => (
            <div key={a} style={{
              fontSize: 11, padding: '5px 12px',
              background: 'rgba(15,140,140,0.1)', border: '1px solid rgba(15,140,140,0.3)',
              borderRadius: 20, color: 'rgba(255,255,255,0.5)',
            }}>{a}</div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.8 }}>
          Powered by LangGraph · Groq · MCP Orchestrator · FastAPI SSE
        </div>
      </div>
    </div>
  );
}
