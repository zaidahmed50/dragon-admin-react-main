import { useState, useEffect, useCallback } from 'react';
import { trackingDeviceService } from '../services/trackingService';

export function useTrackingDevicesQuery() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    trackingDeviceService.getDevices()
      .then((res) => {
        if (!cancelled) {
          const devices = res?.data ?? res ?? [];
          setData(Array.isArray(devices) ? devices : []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setData([]);
          setIsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [fetchKey]);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  return { data, isLoading, error, refetch };
}
