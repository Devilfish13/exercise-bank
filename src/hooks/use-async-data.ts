"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export type UseAsyncData<T> = AsyncState<T> & {
  retry: () => void;
};

/**
 * Fetch-on-mount data hook with loading, error, and retry handling.
 * The fetcher is held in a ref so callers don't need to memoise it, and
 * state is only set after the awaited fetch resolves (never synchronously
 * inside the effect) to keep renders predictable.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>): UseAsyncData<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });
  const [reloadKey, setReloadKey] = useState(0);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const data = await fetcherRef.current();
        if (!cancelled) setState({ data, error: null, isLoading: false });
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            error: error instanceof Error ? error : new Error("Unknown error"),
            isLoading: false,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { ...state, retry };
}
