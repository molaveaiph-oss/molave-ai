import React from 'react';
import { Stethoscope, Twitter, Linkedin, Github } from 'lucide-react';

const FOOTER_COLS = [
  {
    title: 'Product',
    links: ['Features', 'How It Works', 'Pricing', 'Changelog', 'Roadmap'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Compliance'],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--dark)',
        color: 'rgba(255,255,255,0.55)',
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 40,
            paddingBottom: 48,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
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
              <span className="font-sans" style={{ color: '#fff', fontWeight: 700, fontSize: '1.125rem' }}>
                Molave
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 24, maxWidth: 220 }}>
              The smarter way to run your dental practice. Built for modern clinics.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.55)',
                    transition: 'background 0.2s, color 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p
                className="font-sans"
                style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: 16, letterSpacing: '0.02em' }}
              >
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: 'rgba(255,255,255,0.5)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.9)')}
                      onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            paddingTop: 24,
            fontSize: '0.8125rem',
          }}
        >
          <p>© {new Date().getFullYear()} Molave. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <span
              style={{
                background: 'rgba(14,107,94,0.2)',
                color: 'var(--teal-light)',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              HIPAA Compliant
            </span>
            <span
              style={{
                background: 'rgba(200,148,58,0.15)',
                color: 'var(--gold)',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              SOC 2 Type II
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
