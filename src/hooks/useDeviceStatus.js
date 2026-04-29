import { useEffect, useRef, useCallback } from 'react';
import { create } from 'zustand';
import { connectMqtt, disconnectMqtt, onDeviceStatus } from '../services/mqttClient';

export const useDeviceStatusStore = create((set) => ({
  statuses: {},
  setStatus: (deviceId, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [deviceId]: status },
    })),
}));

export function useDeviceStatusMqtt() {
  const setStatus = useDeviceStatusStore((s) => s.setStatus);
  const connectedRef = useRef(false);

  const handleEvent = useCallback(
    (event) => {
      setStatus(event.deviceId, event.status);
    },
    [setStatus]
  );

  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;

    connectMqtt();
    const unsubscribe = onDeviceStatus(handleEvent);

    return () => {
      unsubscribe();
      disconnectMqtt();
      connectedRef.current = false;
    };
  }, [handleEvent]);
}

export function useDeviceLiveStatus(deviceUuid) {
  return useDeviceStatusStore((s) => s.statuses[deviceUuid]);
}
