import React from 'react';
import { Check, X, Zap } from 'lucide-react';
import EyebrowTag from '../shared/EyebrowTag';
import { SectionHeading, SectionSub } from '../shared/SectionHeading';
import { AnimatedGroup, AnimatedItem } from '../shared/AnimatedCard';
import { AnimatedCard } from '../shared/AnimatedCard';
import { GradientButton, GhostButtonDark } from '../shared/Buttons';

interface Feature {
  label: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  featured: boolean;
  badge?: string;
  features: Feature[];
}

const TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for solo practitioners getting started with digital scheduling.',
    cta: 'Start for Free',
    featured: false,
    features: [
      { label: 'Up to 100 appointments/mo', included: true },
      { label: '1 dentist & 1 branch', included: true },
      { label: 'Online booking page', included: true },
      { label: 'SMS & email reminders', included: true },
      { label: 'Patient recall', included: false },
      { label: 'Unified inbox', included: false },
      { label: 'Analytics dashboard', included: false },
      { label: 'Multi-branch support', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing clinics that need automation and deeper insights.',
    cta: 'Start Free Trial',
    featured: true,
    badge: 'Most Popular',
    features: [
      { label: 'Unlimited appointments', included: true },
      { label: 'Up to 5 dentists', included: true },
      { label: 'Online booking page', included: true },
      { label: 'SMS & email reminders', included: true },
      { label: 'Patient recall', included: true },
      { label: 'Unified inbox', included: true },
      { label: 'Analytics dashboard', included: true },
      { label: 'Multi-branch support', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For multi-branch groups and DSOs with advanced requirements.',
    cta: 'Talk to Sales',
    featured: false,
    features: [
      { label: 'Unlimited appointments', included: true },
      { label: 'Unlimited dentists', included: true },
      { label: 'Online booking page', included: true },
      { label: 'SMS & email reminders', included: true },
      { label: 'Patient recall', included: true },
      { label: 'Unified inbox', included: true },
      { label: 'Analytics dashboard', included: true },
      { label: 'Multi-branch support', included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(72px, 8vw, 112px) clamp(20px, 5vw, 48px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <AnimatedCard style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <EyebrowTag variant="teal">Pricing</EyebrowTag>
          </div>
          <SectionHeading center>
            Simple, transparent{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--teal)' }}>pricing</span>
          </SectionHeading>
          <div style={{ marginTop: 16 }}>
            <SectionSub center>
              No hidden fees. No per-seat surprises. Start free and upgrade when you're ready.
            </SectionSub>
          </div>
        </AnimatedCard>

        {/* Cards */}
        <AnimatedGroup
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            alignItems: 'center',
          }}
        >
          {TIERS.map((tier) => (
            <AnimatedItem key={tier.name}>
              <div
                className={tier.featured ? 'pricing-featured' : ''}
                style={{
                  background: tier.featured ? undefined : 'var(--surface)',
                  border: tier.featured ? undefined : '1px solid var(--border)',
                  borderRadius: 20,
                  padding: 'clamp(28px, 3vw, 36px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  position: 'relative',
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--teal)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 14px',
                      borderRadius: 9999,
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Zap size={11} />
                    {tier.badge}
                  </div>
                )}

                {/* Plan name */}
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: tier.featured ? 'var(--teal-light)' : 'var(--teal)',
                    marginBottom: 12,
                  }}
                >
                  {tier.name}
                </p>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span
                    className="font-serif"
                    style={{
                      fontSize: 'clamp(2.25rem, 4vw, 2.75rem)',
                      fontWeight: 400,
                      color: tier.featured ? '#fff' : 'var(--ink)',
                    }}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span style={{ fontSize: '0.9375rem', color: tier.featured ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>
                      {tier.period}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: tier.featured ? 'rgba(255,255,255,0.6)' : 'var(--muted)',
                    marginBottom: 28,
                  }}
                >
                  {tier.description}
                </p>

                {/* CTA */}
                {tier.featured ? (
                  <GradientButton style={{ width: '100%', justifyContent: 'center', marginBottom: 28 }}>
                    {tier.cta}
                  </GradientButton>
                ) : (
                  <GhostButtonDark
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: 28,
                      padding: '13px 28px',
                    }}
                  >
                    {tier.cta}
                  </GhostButtonDark>
                )}

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: tier.featured ? 'rgba(255,255,255,0.1)' : 'var(--border)',
                    marginBottom: 20,
                  }}
                />

                {/* Feature list */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {tier.features.map((feature) => (
                    <li key={feature.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {feature.included ? (
                        <Check
                          size={15}
                          color={tier.featured ? 'var(--teal-light)' : 'var(--teal)'}
                          strokeWidth={2.5}
                        />
                      ) : (
                        <X size={15} color={tier.featured ? 'rgba(255,255,255,0.2)' : 'var(--muted-2)'} strokeWidth={2} />
                      )}
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: feature.included
                            ? tier.featured ? 'rgba(255,255,255,0.85)' : 'var(--ink2)'
                            : tier.featured ? 'rgba(255,255,255,0.3)' : 'var(--muted)',
                        }}
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
