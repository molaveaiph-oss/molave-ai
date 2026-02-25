import React from 'react';

interface EyebrowTagProps {
  children: React.ReactNode;
  variant?: 'teal' | 'gold';
  icon?: React.ReactNode;
}

export default function EyebrowTag({ children, variant = 'teal', icon }: EyebrowTagProps) {
  return (
    <span className={variant === 'teal' ? 'eyebrow-teal' : 'eyebrow-gold'}>
      {icon && icon}
      {children}
    </span>
  );
}
