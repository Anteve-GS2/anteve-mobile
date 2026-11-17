import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  connected: boolean;
  checking: boolean;
}

function toStatus(state: NetInfoState): NetworkStatus {
  return {
    connected: state.isConnected === true && state.isInternetReachable !== false,
    checking: state.isConnected === null || state.isInternetReachable === null,
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({ connected: true, checking: true });

  useEffect(() => {
    let active = true;
    NetInfo.fetch().then((state) => {
      if (active) setStatus(toStatus(state));
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (active) setStatus(toStatus(state));
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return status;
}
