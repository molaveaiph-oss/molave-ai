import React from 'react';

interface FeatIconProps {
  children: React.ReactNode;
  size?: number;
  variant?: 'teal' | 'gold' | 'dark';
}

export default function FeatIcon({ children, size = 48, variant = 'teal' }: FeatIconProps) {
  const styles: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...(variant === 'teal' && { background: 'var(--teal-light)', color: 'var(--teal)' }),
    ...(variant === 'gold' && { background: 'var(--gold-light)', color: 'var(--gold)' }),
    ...(variant === 'dark' && { background: 'rgba(14,107,94,0.15)', color: 'var(--teal-light)' }),
  };

  return <div style={styles}>{children}</div>;
}
