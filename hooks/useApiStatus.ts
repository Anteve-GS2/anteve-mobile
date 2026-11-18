import { useEffect, useState } from 'react';
import { verificarApi } from '@/services/health';

export interface ApiStatus {
  available: boolean | null;
  checking: boolean;
}

export function useApiStatus(enabled: boolean): ApiStatus {
  const [status, setStatus] = useState<ApiStatus>({
    available: null,
    checking: enabled,
  });

  useEffect(() => {
    if (!enabled) {
      setStatus({ available: null, checking: false });
      return;
    }

    let active = true;

    async function checkApi() {
      setStatus((current) => ({ ...current, checking: true }));
      try {
        const health = await verificarApi();
        if (active) {
          setStatus({
            available: health.status === 'UP' && health.service === 'anteve-api-java',
            checking: false,
          });
        }
      } catch {
        if (active) setStatus({ available: false, checking: false });
      }
    }

    checkApi();
    const interval = setInterval(checkApi, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [enabled]);

  return status;
}
