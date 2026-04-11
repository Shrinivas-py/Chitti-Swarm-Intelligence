import React, { useState } from 'react';

const CONTACT_OPTIONS = [
  { icon: '🚀', title: 'Demo Request', desc: 'See Chitti live with your actual use case', color: '#00d4aa' },
  { icon: '🤝', title: 'Partnership', desc: 'Integrate Chitti into your product', color: '#ffb84d' },
  { icon: '🔬', title: 'Research Collaboration', desc: 'Academic or enterprise research partnership', color: '#4d9eff' },
  { icon: '🐛', title: 'Bug Report', desc: 'Found something? Help us improve', color: '#ff5f7e' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', type: 'Demo Request', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: '#07080f', color: '#e8eaf6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", paddingTop: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none} }
        input, textarea, select { outline: none; font-family: inherit; }
        input:focus, textarea:focus, select:focus { border-color: #00d4aa !important; box-shadow: 0 0 0 1px rgba(0,212,170,0.2) !important; }
        .contact-opt:hover { border-color: rgba(0,212,170,0.3) !important; transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <section style={{ padding: '70px 24px 50px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 14 }}>GET IN TOUCH</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 16 }}>
          Let's talk about <span style={{ color: '#00d4aa' }}>your use case</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto' }}>
          Whether you want a demo, a collaboration or just to say hello — we're here.
        </p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        {/* Contact type cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 50 }}>
          {CONTACT_OPTIONS.map(({ icon, title, desc, color }) => (
            <div key={title} className="contact-opt" onClick={() => setForm(f => ({ ...f, type: title }))} style={{
              background: form.type === title ? `rgba(0,212,170,0.08)` : '#0d0f1a',
              border: `1px solid ${form.type === title ? color : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12, padding: '18px 16px', cursor: 'pointer',
              transition: 'all 0.2s', borderTop: form.type === title ? `3px solid ${color}` : `1px solid rgba(255,255,255,0.07)`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: form.type === title ? '#e8eaf6' : 'rgba(255,255,255,0.7)' }}>{title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Form / Success */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Form */}
          <div>
            {sent ? (
              <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 16, padding: 40, textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
                <div style={{ fontSize: 50, marginBottom: 16 }}>✓</div>
                <h2 style={{ fontSize: 22, fontFamily: "'Space Mono', monospace", color: '#00d4aa', marginBottom: 12 }}>Message sent!</h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                  We'll get back to you within 24 hours. In the meantime, try asking Chitti something hard.
                </p>
                <button onClick={() => setSent(false)} style={{ marginTop: 24, padding: '10px 24px', background: 'transparent', border: '1px solid rgba(0,212,170,0.4)', borderRadius: 8, color: '#00d4aa', fontSize: 12, fontFamily: "'Space Mono', monospace", cursor: 'pointer' }}>
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block', marginBottom: 7 }}>NAME</label>
                  <input
                    required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block', marginBottom: 7 }}>EMAIL</label>
                  <input
                    required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@company.com"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block', marginBottom: 7 }}>TYPE</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: '100%', background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box', transition: 'border-color 0.2s' }}>
                    {CONTACT_OPTIONS.map(o => <option key={o.title}>{o.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block', marginBottom: 7 }}>MESSAGE</label>
                  <textarea
                    required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your use case, what you're building, or what you'd like to know..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6, transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  />
                </div>
                <button type="submit" style={{
                  padding: '14px 28px', background: 'linear-gradient(135deg, #00d4aa, #00a882)',
                  border: 'none', borderRadius: 10, color: '#000', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Space Mono', monospace", letterSpacing: 1,
                  boxShadow: '0 0 16px rgba(0,212,170,0.25)',
                }}>SEND MESSAGE →</button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 14 }}>RESPONSE TIME</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: '#00d4aa', marginBottom: 8 }}>&lt;24h</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>We respond to all serious inquiries within one business day. Demo requests prioritised.</div>
            </div>

            <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 16 }}>QUICK LINKS</div>
              {[
                ['📊 Dashboard Demo', '/dashboard'],
                ['🧬 Why Chitti?', '/novelty'],
                ['💼 Use Cases', '/usecases'],
                ['ℹ️ About', '/about'],
              ].map(([label, path]) => (
                <a key={label} href={path} style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#00d4aa'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >{label}</a>
              ))}
            </div>

            <div style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                <strong style={{ color: '#00d4aa' }}>Chitti-AI</strong> is an open-source project. If you'd prefer to fork it and run it yourself, all code is available. We welcome contributions, issues, and experiments.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
