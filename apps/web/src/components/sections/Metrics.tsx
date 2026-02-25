import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const STATS: StatItem[] = [
  { value: 500, suffix: '+', label: 'Dental Clinics', description: 'Trust Molave across the country' },
  { value: 50, suffix: 'k+', label: 'Appointments Booked', description: 'Every month through our platform' },
  { value: 98, suffix: '%', label: 'Patient Satisfaction', description: 'Rated by patients post-visit' },
  { value: 4.9, suffix: '/5', label: 'Average Rating', description: 'From verified clinic reviews' },
];

function useCountUp(target: number, decimals = 0, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      setCount(parseFloat(current.toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, decimals, active]);

  return count;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const decimals = stat.value % 1 !== 0 ? 1 : 0;
  const count = useCountUp(stat.value, decimals, active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 } },
      }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '32px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Teal accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 3,
          height: '100%',
          background: 'var(--teal)',
          borderRadius: '2px 0 0 2px',
          opacity: 0.6,
        }}
      />
      <div
        className="font-serif"
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
          fontWeight: 400,
          color: 'var(--teal)',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {decimals > 0 ? count.toFixed(1) : Math.round(count)}
        <span style={{ fontSize: '0.55em', color: 'var(--gold)' }}>{stat.suffix}</span>
      </div>
      <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '1rem', marginBottom: 4 }}>
        {stat.label}
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
        {stat.description}
      </p>
    </motion.div>
  );
}

export default function Metrics() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: 'clamp(60px, 8vw, 96px) clamp(20px, 5vw, 48px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
