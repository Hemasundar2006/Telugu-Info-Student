/**
 * Central animation timing and easing constants.
 * Use for CSS custom properties or JS-driven animations.
 */

export const DURATION = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 400,
  slower: 500,
  pageLoad: 600,
  hero: 800,
};

export const EASING = {
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  easeInOut: 'ease-in-out',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const STAGGER = {
  navItem: 100,
  card: 80,
  listItem: 50,
};

export const SCROLL = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
};

export const TOAST_DURATION = 4000;
