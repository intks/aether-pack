import { useRef, useReducer, useCallback } from "react";
import useIsMountedRef from "./use-is-mounted-ref";

type AsyncStatus = "idle" | "pending" | "resolved" | "rejected";

interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: Error;
}

interface AsyncAction<T> {
  status: AsyncStatus;
  data?: T;
  error?: Error;
}

function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.status) {
    case "pending":
      return { ...state, status: action.status };
    case "resolved":
      return { ...state, data: action.data, status: action.status };
    case "rejected":
      return { ...state, error: action.error, status: action.status };
    case "idle":
      return { data: action.data, error: action.error, status: action.status };
    default:
      throw new Error("Unhandled action type");
  }
}

interface AsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

interface UseAsyncReturn<T> {
  run: (
    promise: Promise<T>,
    options?: AsyncOptions<T>
  ) => Promise<T | Error | undefined>;
  reset: () => void;
  data?: T;
  error?: Error;
  status: AsyncStatus;
  isIdle: boolean;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

/**
 * Custom hook for handling asynchronous operations.
 *
 * @template T - The type of data returned by the asynchronous operation.
 * @param initialState - The initial state of the asynchronous operation.
 * @returns An object containing the state of the asynchronous operation and utility functions.
 */
const useAsync = <T>(
  initialState: Partial<AsyncState<T>> = {}
): UseAsyncReturn<T> => {
  const isMountedRef = useIsMountedRef();
  const latestPromiseRef = useRef<Promise<T>>();
  const defaultStateRef = useRef<AsyncState<T>>({
    data: undefined,
    error: undefined,
    status: "idle",
    ...initialState,
  });

  const [state, dispatch] = useReducer(asyncReducer<T>, {
    ...defaultStateRef.current,
  });

  const safeDispatch = useCallback(
    (action: AsyncAction<T>) => {
      if (isMountedRef.current) {
        dispatch(action);
      }
    },
    [isMountedRef]
  );

  const reset = useCallback(() => {
    safeDispatch({ ...defaultStateRef.current, status: "idle" });
    latestPromiseRef.current = undefined;
  }, [safeDispatch]);

  const run = useCallback(
    (promise: Promise<T>, options: AsyncOptions<T> = {}) => {
      if (!promise || !promise.then) {
        throw new Error("The argument passed to run must be a promise");
      }

      latestPromiseRef.current = promise;
      safeDispatch({ status: "pending" });

      return promise
        .then((data) => {
          if (promise === latestPromiseRef.current) {
            safeDispatch({ status: "resolved", data });
            options.onSuccess?.(data);
            return data;
          }
        })
        .catch((error: Error) => {
          if (promise === latestPromiseRef.current) {
            safeDispatch({ status: "rejected", error });
            options.onError?.(error);
            return error;
          }
        })
        .finally(() => {
          if (promise === latestPromiseRef.current) {
            options.onSettled?.();
          }
        });
    },
    [safeDispatch]
  );

  return {
    run,
    reset,
    ...state,
    isIdle: state.status === "idle",
    isError: state.status === "rejected",
    isLoading: state.status === "pending",
    isSuccess: state.status === "resolved",
  };
};

export default useAsync;
