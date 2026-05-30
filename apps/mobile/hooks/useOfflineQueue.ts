import { useState, useEffect, useRef } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

export function useOfflineQueue() {
  const netInfo = useNetInfo();
  const [pendingCount, setPendingCount] = useState(0);
  const queueRef = useRef<any[]>([]);

  useEffect(() => {
    if (netInfo.isConnected && queueRef.current.length > 0) {
      queueRef.current = [];
      setPendingCount(0);
    }
  }, [netInfo.isConnected]);

  const enqueue = (item: any) => {
    queueRef.current.push(item);
    setPendingCount(queueRef.current.length);
  };

  return { enqueue, pendingCount };
}
