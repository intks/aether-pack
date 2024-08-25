import { useCallback, useRef, useState } from "react";

/**
 * Custom hook that provides state management with history tracking.
 *
 * @param defaultValue - The initial value for the state.
 * @param capacity - The maximum number of history entries to keep (default: 10).
 * @returns An array containing the current value, a setter function to update the value,
 * and an object with history-related functions and properties.
 */
const useStateWithHistory = (defaultValue, { capacity = 10 }) => {
  const [value, setValue] = useState(defaultValue);
  const historyRef = useRef([value]);
  const pointerRef = useRef(0);

  const clear = useCallback(() => {
    historyRef.current = [value];
    pointerRef.current = 0;
  }, []);

  const set = useCallback(
    (v) => {
      const resolvedValue = typeof v === "function" ? v(value) : v;

      if (historyRef.current[pointerRef.current] !== resolvedValue) {
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current.splice(pointerRef.current + 1);
        }

        historyRef.current.push(resolvedValue);

        while (historyRef.current.length > capacity) {
          historyRef.current.shift();
        }

        pointerRef.current = historyRef.current.length - 1;
      }

      setValue(resolvedValue);
    },
    [capacity, value]
  );

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return;
    pointerRef.current--;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    pointerRef.current++;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const go = useCallback((index) => {
    if (index < 0 || index > historyRef.current.length - 1) return;
    pointerRef.current = index;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  return [
    value,
    set,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      back,
      forward,
      go,
      clear,
    },
  ];
};

export default useStateWithHistory;
