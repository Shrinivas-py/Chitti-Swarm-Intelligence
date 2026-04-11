import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/novelty', label: 'Why Chitti' },
    { to: '/usecases', label: 'Use Cases' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <style>{`
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #00d4aa !important; }
        .nav-link.active { color: #00d4aa !important; }
        .nav-link.active::after { width: 100% !important; }
        @keyframes navFade { from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none} }
        @keyframes mobileSlide { from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none} }
      `}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(7,8,15,0.96)' : 'rgba(7,8,15,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s ease',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #00d4aa, #00a882)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, boxShadow: '0 0 14px rgba(0,212,170,0.3)',
            }}>⬡</div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, color: '#00d4aa', letterSpacing: 2 }}>CHITTI</span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {links.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} className={`nav-link${active ? ' active' : ''}`} style={{
                  textDecoration: 'none',
                  color: active ? '#00d4aa' : 'rgba(255,255,255,0.55)',
                  fontSize: 13, fontWeight: 500,
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: active ? 'rgba(0,212,170,0.08)' : 'transparent',
                  position: 'relative',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s',
                }}>{label}</Link>
              );
            })}
            <Link to="/thinking" style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #00d4aa, #00a882)',
              color: '#000', fontSize: 12, fontWeight: 700,
              padding: '7px 16px', borderRadius: 8,
              fontFamily: "'Space Mono', monospace", letterSpacing: 0.5,
              marginLeft: 8, transition: 'all 0.2s',
              boxShadow: '0 0 12px rgba(0,212,170,0.25)',
            }}>TRY NOW →</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
