import { useCallback, useEffect, useRef, useState } from 'react';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

type UseApiEasyProps<T, Arg = undefined> = {
  apiPromise: Arg extends undefined
    ? (signal?: AbortSignal) => Promise<T>
    : (arg: Arg, signal?: AbortSignal) => Promise<T>;
  initialCall?: boolean;
  initialArg?: Arg;
  useAbortController?: boolean; // ✅ Optional AbortController
  enableCache?: boolean; // ✅ Optional Caching
  cacheExpiryMs?: number; // ✅ Optional Cache Expiry (default: no expiry)
};

type UseApiEasyReturn<T, Arg = undefined> = {
  isLoading: boolean;
  response: T | null;
  error: Error | null;
  eventCall: (arg?: Arg, forceFresh?: boolean) => Promise<T>;
  abort: () => void;
};

// ✅ Global cache storage with timestamps
const cache = new Map<string, CacheEntry<unknown>>();

const useApiEasy = <T, Arg = undefined>({
  apiPromise,
  initialCall = false,
  initialArg,
  useAbortController = false,
  enableCache = false, // Default is false (no caching)
  cacheExpiryMs, // Default is undefined (cache never expires)
}: UseApiEasyProps<T, Arg>): UseApiEasyReturn<T, Arg> => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(initialCall);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateCacheKey = (props?: Arg) => JSON.stringify(props) ?? 'default';

  const abort = useCallback(() => {
    if (useAbortController && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [useAbortController]);

  const eventCall = useCallback(
    async (props?: Arg, forceFresh: boolean = false) => {
      const cacheKey = generateCacheKey(props);

      // ✅ Check cache only if enabled and not forcing fresh data
      if (enableCache && !forceFresh) {
        const cachedEntry = cache.get(cacheKey);

        if (cachedEntry) {
          const now = Date.now();

          // ✅ If cache expiry is set, check if it's expired
          if (
            cacheExpiryMs === undefined ||
            now - cachedEntry.timestamp < cacheExpiryMs
          ) {
            setResponse(cachedEntry.data as T);
            return cachedEntry.data as T;
          }

          // ✅ Cache expired, remove it
          cache.delete(cacheKey);
        }
      }

      if (useAbortController) {
        abort(); // ✅ Abort previous request only if enabled
        abortControllerRef.current = new AbortController();
      }

      const signal = useAbortController
        ? abortControllerRef.current!.signal
        : undefined;

      setLoading(true);
      try {
        const res = await (
          apiPromise as (arg: Arg, signal?: AbortSignal) => Promise<T>
        )(props as Arg, signal);

        if (!signal || !signal.aborted) {
          setResponse(res);

          // ✅ Store response in cache if caching is enabled
          if (enableCache) {
            cache.set(cacheKey, { data: res, timestamp: Date.now() });
          }
        }

        return res;
      } catch (err) {
        if (!signal || !signal.aborted) {
          setError(err as Error);
          setResponse(null);
        }
        throw err;
      } finally {
        if (!signal || !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [apiPromise, abort, useAbortController, enableCache, cacheExpiryMs]
  );

  useEffect(() => {
    if (initialCall) {
      eventCall(initialArg as Arg);
    }
    return () => {
      abort(); // ✅ Cleanup only if AbortController is used
    };
  }, [initialCall, initialArg, eventCall, abort]);

  return { isLoading, response, error, eventCall, abort };
};

export default useApiEasy;
