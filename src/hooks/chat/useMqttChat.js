

import { useEffect, useRef, useState, useCallback } from 'react';

const MQTT_WS_URL = import.meta.env.VITE_MQTT_WS_URL || 'ws://localhost:9001/mqtt';

export const useMqttChat = (ticketId, currentUserId, onNewMessage) => {
    const clientRef           = useRef(null);
    const destroyedRef        = useRef(false);
    const onNewMessageRef     = useRef(onNewMessage);
    const [connected, setConnected] = useState(false);

    // Keep ref in sync so the stable handleMessage closure always has latest callback
    useEffect(() => { onNewMessageRef.current = onNewMessage; }, [onNewMessage]);

    // Stable message handler — never recreated, so mqtt.on('message') is only wired once
    const handleMessage = useCallback((_topic, payloadBuffer) => {
        try {
            const text = typeof payloadBuffer === 'string'
                ? payloadBuffer
                : new TextDecoder().decode(payloadBuffer);
            const msg = JSON.parse(text);
            onNewMessageRef.current?.(msg);
        } catch (e) {
            console.error('[MQTT] Failed to parse payload', e);
        }
    }, []);

    useEffect(() => {
        if (!ticketId) return;
        destroyedRef.current = false;

        let mqttClient = null;

        import('mqtt')
            .then(mod => {
                // Handle both ESM default and CJS exports
                const mqtt = mod.default ?? mod;
                if (destroyedRef.current) return;

                const clientId = `dragon-web-${currentUserId ?? 'anon'}-${Date.now()}`;

                mqttClient = mqtt.connect(MQTT_WS_URL, {
                    clientId,
                    clean:            true,   // simple clean session for browser clients
                    reconnectPeriod:  3000,
                    connectTimeout:   10_000,
                    keepalive:        30,
                    protocolVersion:  4,      // MQTT 3.1.1
                });

                mqttClient.on('connect', () => {
                    if (destroyedRef.current) return;
                    setConnected(true);
                    console.info(`[MQTT] Connected  clientId=${clientId}`);

                    const topics = [`ticket/chat/${ticketId}`];
                    if (currentUserId) topics.push(`ticket/chat/${ticketId}/notify/${currentUserId}`);

                    mqttClient.subscribe(topics, { qos: 0 }, (err) => {
                        if (err) console.error('[MQTT] Subscribe failed:', err.message);
                        else     console.info('[MQTT] Subscribed to', topics);
                    });
                });

                mqttClient.on('message', handleMessage);

                mqttClient.on('error', err => {
                    // Swallow — broker may not be running in dev; REST still works
                    console.warn('[MQTT] Error (real-time disabled):', err.message);
                });

                mqttClient.on('close',     () => { if (!destroyedRef.current) setConnected(false); });
                mqttClient.on('reconnect', () => console.info('[MQTT] Reconnecting…'));
                mqttClient.on('offline',   () => { if (!destroyedRef.current) setConnected(false); });

                clientRef.current = mqttClient;
            })
            .catch(err => {
                // mqtt package not installed — real-time disabled, REST still works
                console.warn('[MQTT] Package not available, falling back to REST-only:', err.message);
            });

        return () => {
            destroyedRef.current = true;
            setConnected(false);
            if (mqttClient) {
                try {
                    const topics = [`ticket/chat/${ticketId}`];
                    if (currentUserId) topics.push(`ticket/chat/${ticketId}/notify/${currentUserId}`);
                    mqttClient.unsubscribe(topics);
                    mqttClient.end(/* force= */ true);
                } catch { /* ignore cleanup errors */ }
            }
            clientRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketId, currentUserId]); // handleMessage is stable — intentionally excluded

    return { connected };
};
