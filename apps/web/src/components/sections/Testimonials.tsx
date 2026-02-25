import React from 'react';
import { Star, Quote } from 'lucide-react';
import EyebrowTag from '../shared/EyebrowTag';
import { SectionHeading, SectionSub } from '../shared/SectionHeading';
import { AnimatedGroup, AnimatedItem } from '../shared/AnimatedCard';
import { AnimatedCard } from '../shared/AnimatedCard';

const TESTIMONIALS = [
  {
    initials: 'DR',
    name: 'Dr. Rosa Santos',
    role: 'Owner — Brighter Smile Dental, Makati',
    gradient: 'linear-gradient(135deg, #0e6b5e, #12877a)',
    rating: 5,
    quote:
      'Molave cut our no-show rate by 42% in the first month. The automated recall alone has paid for the subscription ten times over. I genuinely don\'t know how we managed without it.',
  },
  {
    initials: 'NL',
    name: 'Dr. Nathan Lim',
    role: 'Clinical Director — SmilePro Clinics (3 branches)',
    gradient: 'linear-gradient(135deg, #c8943a, #e0a84a)',
    rating: 5,
    quote:
      'Managing three branches used to mean three separate spreadsheets and constant phone tag. With Molave, I can see every chair across all locations from one screen. It\'s transformed how we operate.',
  },
  {
    initials: 'MA',
    name: 'Dr. Maria Aquino',
    role: 'Founder — Aquino Family Dental',
    gradient: 'linear-gradient(135deg, #5d5248, #7a6e62)',
    rating: 5,
    quote:
      'The patient inbox is a game-changer. My staff used to answer the same questions 30 times a day. Molave\'s automated replies handle 80% of them now — freeing my team to focus on patients in the chair.',
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      style={{
        background: 'var(--bg2)',
        padding: 'clamp(72px, 8vw, 112px) clamp(20px, 5vw, 48px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <AnimatedCard style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <EyebrowTag variant="gold">Testimonials</EyebrowTag>
          </div>
          <SectionHeading center>
            Dentists who{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--teal)' }}>love Molave</span>
          </SectionHeading>
          <div style={{ marginTop: 16 }}>
            <SectionSub center>
              Real feedback from real clinics. No cherry-picking.
            </SectionSub>
          </div>
        </AnimatedCard>

        {/* Cards */}
        <AnimatedGroup
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((t) => (
            <AnimatedItem key={t.name}>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 'clamp(24px, 3vw, 32px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  height: '100%',
                  position: 'relative',
                }}
              >
                {/* Quote icon */}
                <div style={{ position: 'absolute', top: 24, right: 24, opacity: 0.07 }}>
                  <Quote size={40} color="var(--teal)" />
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--ink2)',
                    lineHeight: 1.75,
                    fontStyle: 'italic',
                    flex: 1,
                  }}
                >
                  "{t.quote}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: t.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem', lineHeight: 1.3 }}>
                      {t.name}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
