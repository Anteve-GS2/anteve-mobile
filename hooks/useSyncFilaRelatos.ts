import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { enviarFila } from '@/services/relatos';

// Quando a rede volta, envia os relatos que ficaram na fila.
export function useSyncFilaRelatos(onSynced?: (enviados: number) => void) {
  useEffect(() => {
    let busy = false;
    const run = async () => {
      if (busy) return;
      busy = true;
      try {
        const n = await enviarFila();
        if (n > 0) onSynced?.(n);
      } finally {
        busy = false;
      }
    };
    run();
    return NetInfo.addEventListener((s) => {
      if (s.isConnected && s.isInternetReachable !== false) run();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}