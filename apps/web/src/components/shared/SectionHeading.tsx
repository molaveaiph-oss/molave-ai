import React from 'react';

interface SectionHeadingProps {
  children: React.ReactNode;
  center?: boolean;
  light?: boolean;
}

export function SectionHeading({ children, center = false, light = false }: SectionHeadingProps) {
  return (
    <h2
      className="font-serif"
      style={{
        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
        fontWeight: 400,
        lineHeight: 1.15,
        color: light ? '#ffffff' : 'var(--ink)',
        textAlign: center ? 'center' : 'left',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h2>
  );
}

interface SectionSubProps {
  children: React.ReactNode;
  center?: boolean;
  light?: boolean;
}

export function SectionSub({ children, center = false, light = false }: SectionSubProps) {
  return (
    <p
      style={{
        fontSize: '1.0625rem',
        lineHeight: 1.7,
        color: light ? 'rgba(255,255,255,0.65)' : 'var(--muted)',
        maxWidth: '560px',
        textAlign: center ? 'center' : 'left',
        margin: center ? '0 auto' : '0',
      }}
    >
      {children}
    </p>
  );
}
