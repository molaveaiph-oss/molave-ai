import React from 'react';
import { motion } from 'framer-motion';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCard({ children, className, style }: AnimatedCardProps) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedGroupProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedGroup({ children, className, style }: AnimatedGroupProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className, style }: AnimatedGroupProps) {
  return (
    <motion.div variants={reveal} className={className} style={style}>
      {children}
    </motion.div>
  );
}
