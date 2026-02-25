import React, { useState, useEffect } from 'react';
import { Stethoscope, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
];

const scrollTo = (id: string) => {
  document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: 68,
    display: 'flex',
    alignItems: 'center',
    padding: '0 clamp(20px, 5vw, 48px)',
    transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
    ...(scrolled && {
      background: 'rgba(245,243,239,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 12px rgba(26,24,20,0.06)',
    }),
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: scrolled ? 'var(--ink)' : '#ffffff',
  };

  const linkStyle: React.CSSProperties = {
    color: scrolled ? 'var(--muted)' : 'rgba(255,255,255,0.75)',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
  };

  const signInStyle: React.CSSProperties = {
    color: scrolled ? 'var(--ink)' : 'rgba(255,255,255,0.85)',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
  };

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <a href="/" style={logoStyle}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stethoscope size={18} color="#fff" />
          </div>
          <span className="font-sans" style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Molave
          </span>
        </a>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            margin: '0 auto',
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
            <span
              key={link.label}
              style={linkStyle}
              onClick={() => scrollTo(link.href)}
            >
              {link.label}
            </span>
          ))}
        </div>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }} className="hidden md:flex">
          <a href="/login" style={signInStyle}>
            Sign In
          </a>
          <a
            href="/login"
            style={{
              background: 'var(--teal)',
              color: '#fff',
              padding: '9px 20px',
              borderRadius: 9999,
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
              boxShadow: scrolled ? '0 2px 10px rgba(14,107,94,0.25)' : 'none',
            }}
          >
            Get Started
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: scrolled ? 'var(--ink)' : '#fff',
            cursor: 'pointer',
            padding: 8,
          }}
          className="flex md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 68,
            left: 0,
            right: 0,
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
            padding: '16px 24px 24px',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {NAV_LINKS.map((link) => (
            <span
              key={link.label}
              onClick={() => { scrollTo(link.href); setMobileOpen(false); }}
              style={{
                padding: '12px 8px',
                color: 'var(--ink)',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </span>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            <a href="/login" style={{ color: 'var(--muted)', textAlign: 'center', textDecoration: 'none', fontWeight: 500 }}>
              Sign In
            </a>
            <a
              href="/login"
              style={{
                background: 'var(--teal)',
                color: '#fff',
                padding: '12px',
                borderRadius: 9999,
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </>
  );
}
