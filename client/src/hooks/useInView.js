import { useCallback, useState } from 'react';

/**
 * Returns [ref, isInView].
 *
 * Uses a callback ref instead of useRef so the observer is attached
 * correctly even when the target element is conditionally rendered —
 * the callback fires the moment the element enters the DOM.
 */
export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);

  const ref = useCallback((el) => {
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, ...options }
    );

    observer.observe(el);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, isInView];
}
