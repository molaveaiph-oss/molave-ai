import React from 'react';
import { Building2, CalendarCheck, TrendingUp } from 'lucide-react';
import EyebrowTag from '../shared/EyebrowTag';
import { SectionHeading, SectionSub } from '../shared/SectionHeading';
import { AnimatedGroup, AnimatedItem } from '../shared/AnimatedCard';
import { AnimatedCard } from '../shared/AnimatedCard';

const STEPS = [
  {
    number: '01',
    icon: Building2,
    title: 'Set Up Your Clinic',
    body: 'Add your services, dentists, working hours, and branch locations in minutes. Import existing patients from your old system with one CSV upload.',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Accept Bookings Online',
    body: 'Share your booking link or embed it on your website. Patients pick a service, choose a dentist, select a time, and confirm — no phone calls needed.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Grow Your Practice',
    body: 'Automated reminders reduce no-shows. Recall sequences fill empty slots. Analytics show what\'s working so you can double down on growth.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(72px, 8vw, 112px) clamp(20px, 5vw, 48px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <AnimatedCard style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <EyebrowTag variant="gold">How It Works</EyebrowTag>
          </div>
          <SectionHeading center>
            Up and running{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--teal)' }}>in one afternoon</span>
          </SectionHeading>
          <div style={{ marginTop: 16 }}>
            <SectionSub center>
              No IT team required. No lengthy onboarding. Just three steps between you
              and a fully automated dental practice.
            </SectionSub>
          </div>
        </AnimatedCard>

        {/* Steps */}
        <AnimatedGroup
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 32,
            position: 'relative',
          }}
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <AnimatedItem key={step.number}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'relative',
                  }}
                >
                  {/* Step number + icon row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    {/* Circle */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'var(--teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 16px rgba(14,107,94,0.3)',
                      }}
                    >
                      <Icon size={22} color="#fff" />
                    </div>
                    {/* Connector line (except last) */}
                    {i < STEPS.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background: 'linear-gradient(90deg, var(--teal), var(--border))',
                          opacity: 0.4,
                          minWidth: 40,
                          display: 'none', // hidden on mobile, shown in grid via CSS
                        }}
                        className="hidden lg:block"
                      />
                    )}
                  </div>

                  {/* Step number label */}
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--teal)',
                      letterSpacing: '0.08em',
                      marginBottom: 8,
                    }}
                  >
                    STEP {step.number}
                  </div>

                  <h3
                    className="font-serif"
                    style={{
                      fontSize: '1.3125rem',
                      fontWeight: 400,
                      color: 'var(--ink)',
                      marginBottom: 12,
                      lineHeight: 1.3,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </AnimatedItem>
            );
          })}
        </AnimatedGroup>
      </div>
    </section>
  );
}
