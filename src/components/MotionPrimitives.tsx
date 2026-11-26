import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;

export const CARD_HOVER = {
  scale: 1.02,
  y: -4,
  boxShadow:
    '0 18px 38px -12px rgba(4, 9, 20, 0.78), 0 0 0 1px rgba(100, 139, 255, 0.28), 0 10px 24px -14px rgba(100, 139, 255, 0.32)',
  transition: { duration: 0.22, ease: EASE_SMOOTH },
} as const;

export const POST_CARD_HOVER = {
  scale: 1.012,
  y: -2,
  boxShadow:
    '0 16px 32px -12px rgba(4, 9, 20, 0.72), 0 0 0 1px rgba(100, 139, 255, 0.22), 0 8px 20px -14px rgba(100, 139, 255, 0.24)',
  transition: { duration: 0.22, ease: EASE_SMOOTH },
} as const;

export const SUBTLE_CARD_HOVER = {
  scale: 1.018,
  y: -3,
  boxShadow:
    '0 14px 28px -10px rgba(4, 9, 20, 0.7), 0 0 0 1px rgba(166, 155, 255, 0.25)',
  transition: { duration: 0.2, ease: EASE_SMOOTH },
} as const;

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  y = 20,
  className = '',
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.5, delay, ease: EASE_SMOOTH }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGroup({
  children,
  className = '',
  staggerDelay = 0.07,
}: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
}

export function StaggerItem({
  children,
  className = '',
  hoverLift = false,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.46, ease: EASE_SMOOTH },
        },
      }}
      whileHover={hoverLift ? CARD_HOVER : undefined}
      className={`${hoverLift ? 'rounded-2xl will-change-transform' : ''} ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  axis?: 'x' | 'y';
  direction?: 1 | -1;
}

export function PageTransition({
  children,
  className = '',
  axis = 'y',
  direction = 1,
}: PageTransitionProps) {
  const initialState =
    axis === 'x'
      ? { opacity: 0, x: direction * 18, scale: 0.994 }
      : { opacity: 0, y: direction * 12, scale: 0.995 };

  const exitState =
    axis === 'x'
      ? {
          opacity: 0,
          x: direction * -12,
          scale: 0.994,
          transition: { duration: 0.14, ease: EASE_SMOOTH },
        }
      : {
          opacity: 0,
          y: direction * -8,
          scale: 0.995,
          transition: { duration: 0.14, ease: EASE_SMOOTH },
        };

  return (
    <motion.div
      initial={initialState}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0.24, ease: EASE_SMOOTH },
      }}
      exit={exitState}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ShellPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function ShellPageTransition({
  children,
  className = '',
}: ShellPageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.994 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.26, ease: EASE_SMOOTH },
      }}
      exit={{
        opacity: 0,
        y: -6,
        scale: 0.995,
        transition: { duration: 0.14, ease: EASE_SMOOTH },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RouteTransitionBar({ routeKey }: { routeKey: string }) {
  return (
    <motion.div
      key={routeKey}
      aria-hidden="true"
      initial={{ scaleX: 0, opacity: 0.95 }}
      animate={{
        scaleX: [0, 0.75, 1],
        opacity: [0.95, 0.9, 0],
      }}
      transition={{
        duration: 0.52,
        times: [0, 0.6, 1],
        ease: EASE_SMOOTH,
      }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#648BFF] via-[#A69BFF] to-[#9BCBFF] origin-left z-[60] pointer-events-none"
    />
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#648BFF] via-[#A69BFF] to-[#9BCBFF] origin-left z-50 pointer-events-none"
    />
  );
}
