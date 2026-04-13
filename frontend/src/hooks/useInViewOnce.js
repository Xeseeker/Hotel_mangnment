import { useEffect, useRef, useState } from "react";

/**
 * Adds isVisible when element enters viewport once (for reveal animations).
 */
export function useInViewOnce(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: options.rootMargin ?? "0px 0px -8% 0px", threshold: options.threshold ?? 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, options.rootMargin, options.threshold]);

  return { ref, isVisible };
}
