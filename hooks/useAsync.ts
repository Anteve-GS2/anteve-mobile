import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from '@/utils/errors';

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const mounted = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const nextData = await fn();
      if (mounted.current && currentRequest === requestId.current) setData(nextData);
    } catch (e) {
      if (mounted.current && currentRequest === requestId.current) setError(errorMessage(e));
    } finally {
      if (mounted.current && currentRequest === requestId.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  return { data, loading, error, reload: run };
}