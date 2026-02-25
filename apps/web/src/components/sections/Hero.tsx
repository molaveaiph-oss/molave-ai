import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users } from 'lucide-react';
import { GradientButton, GhostButton } from '../shared/Buttons';
import EyebrowTag from '../shared/EyebrowTag';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
  }),
};

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 68,
      }}
    >
      {/* Background layers */}
      <div className="hero-grid" />
      <div className="hero-mesh" />
      <div className="hero-orb" />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: 'clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)',
          maxWidth: 860,
          width: '100%',
        }}
      >
        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
        >
          <EyebrowTag variant="teal" icon={<Star size={11} />}>
            Trusted by 500+ Dental Clinics
          </EyebrowTag>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          animate="visible"
          className="font-serif"
          style={{
            fontSize: 'clamp(2.75rem, 7vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: 24,
          }}
        >
          <span style={{ color: '#fff' }}>The Smarter Way</span>{' '}
          <br />
          <span
            style={{
              fontStyle: 'italic',
              WebkitTextStroke: '1px rgba(255,255,255,0.4)',
              color: 'transparent',
            }}
          >
            to Run
          </span>{' '}
          <span className="text-underline-teal" style={{ color: '#fff' }}>
            Your Practice
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={0.2}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            maxWidth: 580,
            margin: '0 auto 40px',
          }}
        >
          Molave brings smart booking, automated patient recall, and real-time analytics
          into one seamless platform — so you can focus on patient care, not admin.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          custom={0.3}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 48 }}
        >
          <GradientButton as="a" href="/login">
            Start for Free
            <ArrowRight size={16} />
          </GradientButton>
          <GhostButton>
            <Play size={15} />
            Watch Demo
          </GhostButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          custom={0.4}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {['#0e6b5e', '#c8943a', '#12877a', '#5d5248', '#0e6b5e'].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: color,
                    border: '2px solid var(--dark)',
                    marginLeft: i === 0 ? 0 : -10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {['DR', 'NL', 'MA', 'JB', '+'][i]}
                </div>
              ))}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>
              500+ clinics
            </span>
          </div>

          <div
            style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }}
            className="hidden sm:block"
          />

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
              ))}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>
              4.9/5 from 1,200+ reviews
            </span>
          </div>

          <div
            style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }}
            className="hidden sm:block"
          />

          {/* Users */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={15} color="rgba(255,255,255,0.4)" />
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>
              No credit card required
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
          zIndex: 2,
        }}
      />
    </section>
  );
}
