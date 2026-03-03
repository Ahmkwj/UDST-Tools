import { useState, useEffect, useCallback, useRef } from "react";

/**
 * A drop-in replacement for useState that persists the value to localStorage.
 * - On mount, reads the stored value (falls back to `initialValue`).
 * - On every state change, writes the new value to localStorage.
 * - Supports any JSON-serialisable type.
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    try {
      localStorage.setItem(keyRef.current, JSON.stringify(storedValue));
    } catch {
      /* quota exceeded -- silently ignore */
    }
  }, [storedValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        return next;
      });
    },
    [],
  );

  return [storedValue, setValue];
}
