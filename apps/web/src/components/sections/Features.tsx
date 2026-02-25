import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  BellRing,
  MessageSquare,
  BarChart3,
  Check,
} from 'lucide-react';
import EyebrowTag from '../shared/EyebrowTag';
import { SectionHeading, SectionSub } from '../shared/SectionHeading';
import FeatIcon from '../shared/FeatIcon';
import { AnimatedCard } from '../shared/AnimatedCard';

const FEATURES = [
  {
    id: 'booking',
    label: 'Smart Booking',
    icon: CalendarCheck,
    headline: 'Fill your chair. Automatically.',
    body: 'Patients book 24/7 from your website or a shareable link. Intelligent scheduling prevents double-bookings, respects chair capacity, and automatically sends confirmation reminders.',
    points: [
      'Real-time availability sync',
      'Multi-clinic & multi-dentist support',
      'Customisable service durations',
      'Automated SMS & email reminders',
    ],
  },
  {
    id: 'recall',
    label: 'Patient Recall',
    icon: BellRing,
    headline: 'Bring patients back before they drift.',
    body: 'Automated recall sequences reach out to lapsed patients at exactly the right time — by SMS, email, or push — with your clinic\'s voice and branding.',
    points: [
      'Personalised recall cadences',
      'Lapsed patient detection',
      'One-click rebooking links',
      'Open & click analytics per campaign',
    ],
  },
  {
    id: 'inbox',
    label: 'Unified Inbox',
    icon: MessageSquare,
    headline: 'Every patient message, one place.',
    body: 'Consolidate SMS, email, and booking chat into a single inbox shared by your whole team. Assign conversations, leave internal notes, and never lose a message again.',
    points: [
      'Shared team inbox',
      'Automated FAQ replies',
      'Appointment-linked threads',
      'HIPAA-compliant messaging',
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    headline: 'Know your clinic inside out.',
    body: 'Track chair utilisation, no-show rates, revenue per service, and patient lifetime value — all in a live dashboard that updates as appointments happen.',
    points: [
      'Live chair utilisation',
      'Revenue by dentist & service',
      'No-show & cancellation trends',
      'Exportable reports (CSV / PDF)',
    ],
  },
];

export default function Features() {
  const [active, setActive] = useState('booking');
  const current = FEATURES.find((f) => f.id === active)!;
  const Icon = current.icon;

  return (
    <section
      id="features"
      style={{
        background: 'var(--bg2)',
        padding: 'clamp(72px, 8vw, 112px) clamp(20px, 5vw, 48px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <AnimatedCard style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <EyebrowTag variant="teal">Platform Features</EyebrowTag>
          </div>
          <SectionHeading center>
            Everything your clinic needs,{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--teal)' }}>beautifully integrated</span>
          </SectionHeading>
          <div style={{ marginTop: 16 }}>
            <SectionSub center>
              From the first booking to the final recall, Molave handles the full patient lifecycle
              so you can focus on delivering exceptional care.
            </SectionSub>
          </div>
        </AnimatedCard>

        {/* Tab + Panel layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(180px, 26%, 260px) 1fr',
            gap: 24,
            alignItems: 'start',
          }}
          className="block md:grid"
        >
          {/* Tab list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FEATURES.map((f) => {
              const TabIcon = f.icon;
              const isActive = f.id === active;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s, color 0.2s',
                    background: isActive ? 'var(--teal-light)' : 'transparent',
                    color: isActive ? 'var(--teal)' : 'var(--muted)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9375rem',
                    width: '100%',
                    outline: 'none',
                  }}
                >
                  <TabIcon size={18} />
                  {f.label}
                  {isActive && (
                    <div
                      style={{
                        marginLeft: 'auto',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--teal)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 'clamp(28px, 4vw, 40px)',
              }}
            >
              <FeatIcon size={52} variant="teal">
                <Icon size={24} />
              </FeatIcon>
              <h3
                className="font-serif"
                style={{
                  fontSize: 'clamp(1.375rem, 3vw, 1.75rem)',
                  fontWeight: 400,
                  color: 'var(--ink)',
                  marginTop: 20,
                  marginBottom: 12,
                  lineHeight: 1.25,
                }}
              >
                {current.headline}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 28 }}>
                {current.body}
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
                {current.points.map((point) => (
                  <li key={point} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--teal-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} color="var(--teal)" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--ink2)' }}>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
