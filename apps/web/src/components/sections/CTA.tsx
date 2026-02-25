import React from 'react';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { AnimatedCard } from '../shared/AnimatedCard';
import { GradientButton, GhostButton } from '../shared/Buttons';

export default function CTA() {
  return (
    <section
      style={{
        background: 'var(--dark)',
        padding: 'clamp(72px, 8vw, 112px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(14,107,94,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <AnimatedCard>
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(14,107,94,0.2)',
              border: '1px solid rgba(14,107,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
            }}
          >
            <CalendarCheck size={28} color="var(--teal-light)" />
          </div>

          {/* Headline */}
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: '-0.01em',
            }}
          >
            Ready to transform{' '}
            <em style={{ color: 'var(--teal-light)', fontStyle: 'italic' }}>
              your practice?
            </em>
          </h2>

          <p
            style={{
              fontSize: '1.0625rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 480,
              margin: '0 auto 40px',
            }}
          >
            Join 500+ dental clinics already using Molave to reduce no-shows,
            automate recalls, and grow their patient base — for free.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <GradientButton as="a" href="/login">
              Start for Free — No Card Needed
              <ArrowRight size={16} />
            </GradientButton>
            <GhostButton>
              Book a Demo
            </GhostButton>
          </div>

          {/* Trust note */}
          <p style={{ marginTop: 24, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>
            Free plan available forever · HIPAA Compliant · Cancel anytime
          </p>
        </AnimatedCard>
      </div>
    </section>
  );
}
