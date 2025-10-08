import { useState, useEffect, useCallback } from "react";

export function useCartCounter() {
  const [count, setCount] = useState(() => {
    const saved = sessionStorage.getItem("cartCount");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("cartCount", JSON.stringify(count));
  }, [count]);

  const increment = useCallback((value = 1) => setCount(prev => prev + value), []);
  const decrement = useCallback((value = 1) => setCount(prev => Math.max(0, prev - value)), []);
  const reset = useCallback(() => setCount(0), []);
  const set = useCallback((value) => setCount(value), []);

  return { count, increment, decrement, reset, set };
}
