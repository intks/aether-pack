import { useCallback, useRef, useState } from "react";

interface HistoryOptions {
  capacity?: number;
}

interface HistoryControl<T> {
  history: T[];
  pointer: number;
  back: () => void;
  forward: () => void;
  go: (index: number) => void;
  clear: () => void;
}

type SetStateAction<T> = T | ((prevState: T) => T);

/**
 * Custom hook that provides state management with history functionality.
 *
 * @template T - The type of the state value.
 * @param {T} defaultValue - The initial value of the state.
 * @param {HistoryOptions} [options] - Optional configuration for the history functionality.
 * @param {number} [options.capacity=10] - The maximum number of history entries to keep.
 * @returns {[T, (value: SetStateAction<T>) => void, HistoryControl<T>]} - A tuple containing the current state value, a function to update the state, and an object with history control functions.
 */
function useStateWithHistory<T>(
  defaultValue: T,
  { capacity = 10 }: HistoryOptions = {}
): [T, (value: SetStateAction<T>) => void, HistoryControl<T>] {
  const [value, setValue] = useState<T>(defaultValue);
  const historyRef = useRef<T[]>([value]);
  const pointerRef = useRef<number>(0);

  const set = useCallback(
    (action: SetStateAction<T>) => {
      const resolvedValue =
        typeof action === "function"
          ? (action as (prevState: T) => T)(value)
          : action;

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

  const go = useCallback((index: number) => {
    if (index < 0 || index > historyRef.current.length - 1) return;
    pointerRef.current = index;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const clear = useCallback(() => {
    historyRef.current = [value];
    pointerRef.current = 0;
  }, [value]);

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
}

export default useStateWithHistory;
