import { useEffect, useRef, useState } from 'react';

const DEFAULT_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
  triggerOnce: true,
};

/**
 * Uses Intersection Observer to detect when element enters viewport.
 * Returns ref to attach to element and inView boolean.
 * When inView and triggerOnce, adds 'is-visible' class for scroll-triggered animations.
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const { threshold, rootMargin, triggerOnce } = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (triggerOnce) {
              el.classList.add('is-visible');
            }
          } else if (!triggerOnce) {
            setInView(false);
            el.classList.remove('is-visible');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, inView];
}

/**
 * Observer that adds 'is-visible' to children when they enter viewport.
 * Call from parent once, then pass ref to child or use data attribute.
 */
export function useScrollAnimationObserver(options = {}) {
  const ref = useRef(null);
  const { threshold, rootMargin, triggerOnce } = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll('.animate-on-scroll');
    if (!children.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && triggerOnce) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold, rootMargin }
    );

    children.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return ref;
}
