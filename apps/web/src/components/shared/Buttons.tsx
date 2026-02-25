import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

export function GradientButton({ children, as: Tag = 'button', href, onClick, ...props }: ButtonProps) {
  if (Tag === 'a') {
    return (
      <a href={href} className="btn-gradient" {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className="btn-gradient" onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export function GhostButton({ children, as: Tag = 'button', href, onClick, ...props }: ButtonProps) {
  if (Tag === 'a') {
    return (
      <a href={href} className="btn-ghost" {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className="btn-ghost" onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export function GhostButtonDark({ children, as: Tag = 'button', href, onClick, ...props }: ButtonProps) {
  if (Tag === 'a') {
    return (
      <a href={href} className="btn-ghost-dark" {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className="btn-ghost-dark" onClick={onClick} {...props}>
      {children}
    </button>
  );
}
