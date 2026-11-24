import { useState, useEffect } from 'react';

/**
 * Custom hook to evaluate media queries
 * @param {string} query - e.g. "(max-width: 639px)"
 * @returns {boolean} matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const updateMatch = (e) => setMatches(e.matches);

    // Initial check
    setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', updateMatch);
    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}
