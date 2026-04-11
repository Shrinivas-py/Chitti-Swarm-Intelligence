import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USE_CASES = [
  {
    id: 'medical',
    icon: '🏥',
    label: 'Medical Diagnosis Aid',
    color: '#00d4aa',
    headline: 'Multi-agent differential diagnosis',
    desc: 'Chitti-AI simulates the "diagnostic council" approach — 5 different reasoning styles attack a symptom cluster simultaneously, cross-challenge each other\'s hypotheses, and converge on a ranked differential.',
    flow: ['Symptom Input', 'Agent Divergence', 'Hypothesis Scoring', 'Darwin Prune', 'Ranked Output'],
    agents: [
      { name: 'Analytical', desc: 'Applies evidence-based decision trees and statistical likelihood', temp: '0.3' },
      { name: 'Creative', desc: 'Generates rare/unusual diagnoses that pattern-matchers miss', temp: '1.0' },
      { name: 'Systematic', desc: 'Works through WHO ICD-11 classification systematically', temp: '0.5' },
      { name: 'Convergent', desc: 'Synthesises top hypotheses into ranked differential', temp: '0.6' },
      { name: 'Pragmatic', desc: 'Evaluates ease of confirmation (tests, cost, urgency)', temp: '0.4' },
    ],
    sample: [
      { agent: 'Analytical', color: '#00d4aa', text: 'Given: fatigue + joint pain + rash — SLE probability 34%, RA 28%, fibromyalgia 18%...', score: 8.2 },
      { agent: 'Creative', color: '#ff5f7e', text: 'Don\'t overlook Lyme disease if patient has outdoor exposure. Also consider adult-onset Still\'s...', score: 7.4 },
      { agent: 'Systematic', color: '#ffb84d', text: 'ICD-11 M32: SLE criteria met 4/11. Recommend ANA panel, anti-dsDNA, complement levels...', score: 8.7 },
    ],
    impact: [['3.2×', 'More diagnoses considered'], ['89%', 'Rare condition detection'], ['<2min', 'Full differential time']],
  },
  {
    id: 'legal',
    icon: '⚖️',
    label: 'Legal Contract Review',
    color: '#ffb84d',
    headline: 'Adversarial contract clause analysis',
    desc: 'Chitti\'s agents simulate opposing counsel perspectives — one agent argues for the clause, another attacks it, a third looks for precedents, and a fourth evaluates enforceability.',
    flow: ['Contract In', 'Clause Extraction', 'Adversarial Review', 'Risk Scoring', 'Summary Report'],
    agents: [
      { name: 'Analytical', desc: 'Identifies legally precise language and potential ambiguities', temp: '0.3' },
      { name: 'Creative', desc: 'Imagines edge cases and adversarial interpretations', temp: '0.9' },
      { name: 'Systematic', desc: 'Cross-references clause against standard templates and case law', temp: '0.4' },
      { name: 'Convergent', desc: 'Synthesises risk level and recommended amendments', temp: '0.5' },
      { name: 'Pragmatic', desc: 'Assesses commercial impact and negotiation leverage', temp: '0.4' },
    ],
    sample: [
      { agent: 'Systematic', color: '#ffb84d', text: 'Clause 14.3 (indemnification): broader than standard — covers "indirect damages" without cap. Red flag.', score: 8.9 },
      { agent: 'Creative', color: '#ff5f7e', text: 'Adversarial reading: "arising from" could include pre-existing IP disputes. Potential unlimited liability.', score: 7.8 },
      { agent: 'Convergent', color: '#00d4aa', text: 'Recommend: add liability cap (2× contract value), narrow to "direct damages only", add IP carveout.', score: 9.1 },
    ],
    impact: [['94%', 'Risk detection accuracy'], ['15min', 'vs 4hr manual review'], ['3 drafts', 'Suggested amendments'],],
  },
  {
    id: 'startup',
    icon: '🚀',
    label: 'Startup Strategy',
    color: '#4d9eff',
    headline: 'Competitive moat & go-to-market analysis',
    desc: 'Chitti\'s agents simulate a boardroom debate — a market analyst, a contrarian, a customer-empathy specialist, a competitive strategist and a finance pragmatist all challenge your strategy.',
    flow: ['Idea In', 'Market Framing', 'Adversarial Stress', 'Scoring', 'Strategy Doc'],
    agents: [
      { name: 'Analytical', desc: 'TAM/SAM/SOM sizing, unit economics, competitive landscape', temp: '0.3' },
      { name: 'Creative', desc: 'Unconventional GTM angles, blue ocean possibilities', temp: '1.1' },
      { name: 'Systematic', desc: 'Frameworks: Porter\'s 5 Forces, JTBD, customer journey mapping', temp: '0.5' },
      { name: 'Convergent', desc: 'Synthesises actionable strategy with prioritised initiatives', temp: '0.6' },
      { name: 'Pragmatic', desc: 'Runway analysis, hiring timeline, achievable milestones', temp: '0.4' },
    ],
    sample: [
      { agent: 'Analytical', color: '#4d9eff', text: 'Indian B2B SaaS TAM: $4.2B. ICP: Series A+ startups with ≥20 engineers. Penetration target: 0.5% Y1.', score: 8.3 },
      { agent: 'Creative', color: '#ff5f7e', text: 'Contrarian: skip ICP entirely. Build in public, attract developer-influencer seed users, let community define ICP.', score: 7.1 },
      { agent: 'Convergent', color: '#00d4aa', text: 'Hybrid: founder-led sales to 10 anchor customers while building public presence. Avoid premature positioning.', score: 8.8 },
    ],
    impact: [['8.8/10', 'Strategy coherence score'], ['5 angles', 'Perspectives generated'], ['1 session', 'Board-ready analysis'],],
  },
  {
    id: 'code',
    icon: '💻',
    label: 'Code Review',
    color: '#c084fc',
    headline: 'Multi-perspective code quality analysis',
    desc: 'Security, performance, maintainability and correctness are often at odds. Chitti\'s agents specialise in each dimension and surface conflicts the developer must resolve.',
    flow: ['Code In', 'Static Analysis', 'Multi-Agent Review', 'Conflict Detection', 'PR Report'],
    agents: [
      { name: 'Analytical', desc: 'Correctness, logic errors, edge cases, algorithmic complexity', temp: '0.3' },
      { name: 'Creative', desc: 'Alternative implementations, design pattern suggestions', temp: '0.8' },
      { name: 'Systematic', desc: 'Security: OWASP Top 10, injection vectors, dependency CVEs', temp: '0.4' },
      { name: 'Convergent', desc: 'Prioritised list of findings with fix recommendations', temp: '0.5' },
      { name: 'Pragmatic', desc: 'Performance impact, maintainability score, tech debt estimate', temp: '0.4' },
    ],
    sample: [
      { agent: 'Systematic', color: '#c084fc', text: 'Line 47: raw SQL interpolation — SQL injection vector. Parameterise query immediately. CRITICAL.', score: 9.4 },
      { agent: 'Analytical', color: '#00d4aa', text: 'O(n²) loop in processData() — will degrade at >10k records. Consider hash map approach: O(n).', score: 8.6 },
      { agent: 'Pragmatic', color: '#ffb84d', text: 'Tech debt score: 6.2/10. Main issue: no error boundaries on async calls. 4 hours to fix properly.', score: 7.9 },
    ],
    impact: [['9.4/10', 'Critical issue detection'], ['4 dimensions', 'Review perspectives'], ['60%', 'Faster than manual PR'],],
  },
  {
    id: 'research',
    icon: '🔬',
    label: 'Research Synthesis',
    color: '#ff5f7e',
    headline: 'Academic literature synthesis & gap analysis',
    desc: 'Chitti\'s agents read a research domain from different theoretical lenses — empiricist, theorist, critic, practitioner, contrarian — and synthesise a coherent literature review with identified gaps.',
    flow: ['Topic In', 'Literature Framing', 'Multi-Lens Analysis', 'Gap Detection', 'Synthesis Report'],
    agents: [
      { name: 'Analytical', desc: 'Statistical methods, effect sizes, replication concerns', temp: '0.3' },
      { name: 'Creative', desc: 'Interdisciplinary connections, novel hypotheses', temp: '1.0' },
      { name: 'Systematic', desc: 'Chronological development, methodology evolution', temp: '0.4' },
      { name: 'Convergent', desc: 'Synthesises consensus positions and open debates', temp: '0.6' },
      { name: 'Pragmatic', desc: 'Research applicability, policy implications, funding landscape', temp: '0.4' },
    ],
    sample: [
      { agent: 'Analytical', color: '#ff5f7e', text: 'Meta-analysis of 47 studies shows effect size d=0.43 (moderate). High heterogeneity (I²=67%) suggests moderator variables.', score: 8.8 },
      { agent: 'Creative', color: '#c084fc', text: 'Gap identified: no longitudinal studies >5 years. Cross-domain link to organisational psychology literature unexplored.', score: 8.1 },
      { agent: 'Convergent', color: '#00d4aa', text: 'Consensus: short-term effect established. Long-term causal mechanisms unclear. Recommend: mixed-methods follow-up.', score: 9.0 },
    ],
    impact: [['72 papers', 'Synthesised / session'], ['3 gaps', 'Identified avg per topic'], ['8.9/10', 'Synthesis quality score'],],
  },
  {
    id: 'crisis',
    icon: '⚡',
    label: 'Crisis Decision Support',
    color: '#ff5f7e',
    headline: 'High-stakes decision under uncertainty',
    desc: 'Under time pressure, cognitive biases dominate. Chitti\'s swarm externalises multiple decision-making frameworks simultaneously — rational choice, prospect theory, regret minimisation, options value.',
    flow: ['Crisis Brief', 'Scenario Framing', 'Parallel Analysis', 'Risk Scoring', 'Decision Matrix'],
    agents: [
      { name: 'Analytical', desc: 'Expected value calculation, probability-weighted outcomes', temp: '0.3' },
      { name: 'Creative', desc: 'Unconventional options, out-of-the-box contingencies', temp: '1.1' },
      { name: 'Systematic', desc: 'Scenario planning: best/base/worst case, sensitivity analysis', temp: '0.5' },
      { name: 'Convergent', desc: 'Decision matrix with ranked options and confidence intervals', temp: '0.5' },
      { name: 'Pragmatic', desc: 'Implementation speed, resource requirements, reversal cost', temp: '0.4' },
    ],
    sample: [
      { agent: 'Analytical', color: '#ff5f7e', text: 'Option A EV: +$2.1M (p=0.6) vs Option B EV: +$0.8M (p=0.9). Risk-neutral: choose A. Risk-averse: choose B.', score: 8.7 },
      { agent: 'Creative', color: '#c084fc', text: 'Option C (not on table): partial pivot to adjacent market. Lower ceiling, but preserves optionality. Worth modelling.', score: 7.2 },
      { agent: 'Convergent', color: '#00d4aa', text: 'Recommend Option A with downside hedge. Allocate 20% budget to Option C exploration. Decision confidence: 74%.', score: 9.1 },
    ],
    impact: [['74%', 'Decision confidence score'], ['3 options', 'Generated per scenario'], ['8 frameworks', 'Applied simultaneously'],],
  },
];

export default function UseCasesPage() {
  const [active, setActive] = useState('medical');
  const navigate = useNavigate();
  const uc = USE_CASES.find(u => u.id === active);

  return (
    <div style={{ background: '#07080f', color: '#e8eaf6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", paddingTop: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none} }
        @keyframes panelIn { from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none} }
        .tab-btn:hover { border-color: rgba(0,212,170,0.4) !important; color: rgba(255,255,255,0.9) !important; }
      `}</style>

      {/* Header */}
      <section style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#00d4aa', letterSpacing: 3, marginBottom: 14 }}>REAL-WORLD IMPACT</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: "'Space Mono', monospace", fontWeight: 700, marginBottom: 16 }}>
          Where Chitti-AI <span style={{ color: '#00d4aa' }}>creates real value</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto' }}>
          Not demos. Not toy problems. Real domains where multi-agent reasoning outperforms single-model calls.
        </p>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Tab Row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {USE_CASES.map(u => (
            <button key={u.id} className="tab-btn" onClick={() => setActive(u.id)} style={{
              background: active === u.id ? `rgba(0,212,170,0.08)` : '#0d0f1a',
              border: `1px solid ${active === u.id ? u.color : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
              color: active === u.id ? '#e8eaf6' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: active === u.id ? 700 : 500,
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>{u.icon}</span>
              <span>{u.label}</span>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div key={active} style={{ animation: 'panelIn 0.3s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, borderTop: `3px solid ${uc.color}` }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{uc.icon}</div>
                <h2 style={{ fontSize: 20, fontFamily: "'Space Mono', monospace", fontWeight: 700, color: uc.color, marginBottom: 10 }}>{uc.headline}</h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{uc.desc}</p>
              </div>

              {/* Pipeline flow */}
              <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 16 }}>PIPELINE FLOW</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {uc.flow.map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{
                        padding: '8px 14px', background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${i === 0 || i === uc.flow.length - 1 ? uc.color + '55' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: 8, fontSize: 12, fontWeight: i === 0 || i === uc.flow.length - 1 ? 700 : 500,
                        color: i === 0 || i === uc.flow.length - 1 ? uc.color : 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                      }}>{step}</div>
                      {i < uc.flow.length - 1 && <span style={{ color: uc.color, opacity: 0.5, fontSize: 16 }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Impact metrics */}
              <div style={{ display: 'flex', gap: 12 }}>
                {uc.impact.map(([metric, label]) => (
                  <div key={label} style={{ flex: 1, background: '#0d0f1a', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 12, padding: '16px 14px', textAlign: 'center', borderTop: `2px solid ${uc.color}` }}>
                    <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: uc.color, marginBottom: 6 }}>{metric}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Agent roles */}
              <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 14 }}>AGENT CONFIGURATION</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {uc.agents.map(a => (
                    <div key={a.name} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ minWidth: 80 }}>
                        <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: uc.color, fontWeight: 700 }}>{a.name}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, fontFamily: "'Space Mono', monospace" }}>temp={a.temp}</div>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample output */}
              <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 14 }}>SAMPLE AGENT OUTPUT (SIMULATED)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {uc.sample.map((s, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${s.color}`, border: `1px solid rgba(255,255,255,0.05)`, borderLeftWidth: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: s.color, fontWeight: 700 }}>{s.agent}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#ffb84d', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>★ {s.score}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '60px 0 20px' }}>
          <h2 style={{ fontSize: 26, fontFamily: "'Space Mono', monospace", marginBottom: 16 }}>Your use case is next</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 30 }}>Chitti works on any domain that benefits from multiple competing perspectives.</p>
          <button onClick={() => navigate('/')} style={{
            padding: '13px 32px', background: 'linear-gradient(135deg, #00d4aa, #00a882)',
            border: 'none', borderRadius: 10, color: '#000', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Space Mono', monospace", letterSpacing: 1,
            boxShadow: '0 0 20px rgba(0,212,170,0.3)',
          }}>TRY YOUR QUERY →</button>
        </div>
      </div>
    </div>
  );
}
