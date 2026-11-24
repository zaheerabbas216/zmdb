import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value
 * @param {any} value - The input value to debounce
 * @param {number} delay - Debounce delay in ms (default 400ms per spec)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
