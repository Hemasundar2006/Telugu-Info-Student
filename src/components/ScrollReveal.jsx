import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScrollAnimationObserver } from '../hooks/useScrollAnimation';

/**
 * Single element: adds scroll-triggered fade-in + slide-up when in viewport.
 */
export function ScrollReveal({ children, className = '', as: Component = 'div', ...props }) {
  const [ref] = useScrollAnimation({ threshold: 0.08, rootMargin: '0px 0px -30px 0px', triggerOnce: true });

  return (
    <Component
      ref={ref}
      className={`animate-on-scroll ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Container whose direct children with .animate-on-scroll get .is-visible when in viewport.
 * Use for staggered card grids.
 */
export function ScrollRevealGroup({ children, className = '', as: Component = 'div', ...props }) {
  const ref = useScrollAnimationObserver({ threshold: 0.08, rootMargin: '0px 0px -50px 0px', triggerOnce: true });

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
}

export default ScrollReveal;
