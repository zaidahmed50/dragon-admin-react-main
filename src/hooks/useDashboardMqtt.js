/**
 * useDashboardMqtt.js
 *
 * Subscribes to both "tickets/events" and "tasks/events" MQTT topics and fires
 * `onEvent` whenever a ticket or task is created, updated, approved, or cancelled.
 *
 * The dashboard uses this to auto-refresh stats without polling.
 *
 * Topics:
 *   tickets/events  — { event, ticketId, ticketNumber, status, priority }
 *   tasks/events    — { event, taskId, title, status, priority, isApproved }
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const MQTT_WS_URL      = import.meta.env.VITE_MQTT_WS_URL || 'ws://localhost:9001/mqtt';
const SUBSCRIBED_TOPICS = ['tickets/events', 'tasks/events'];

/**
 * @param {function} onTicketEvent  Called with parsed event object on each message.
 * @returns {{ connected: boolean }}
 */
export const useDashboardMqtt = (onTicketEvent) => {
    const clientRef    = useRef(null);
    const destroyedRef = useRef(false);
    const callbackRef  = useRef(onTicketEvent);
    const [connected, setConnected] = useState(false);

    useEffect(() => { callbackRef.current = onTicketEvent; }, [onTicketEvent]);

    const handleMessage = useCallback((_topic, payloadBuffer) => {
        try {
            const text = typeof payloadBuffer === 'string'
                ? payloadBuffer
                : new TextDecoder().decode(payloadBuffer);
            const event = JSON.parse(text);
            callbackRef.current?.(event);
        } catch (e) {
            console.error('[MQTT Dashboard] Failed to parse event payload', e);
        }
    }, []);

    useEffect(() => {
        destroyedRef.current = false;
        let mqttClient = null;

        import('mqtt')
            .then(mod => {
                const mqtt = mod.default ?? mod;
                if (destroyedRef.current) return;

                const clientId = `dragon-dashboard-${Date.now()}`;

                mqttClient = mqtt.connect(MQTT_WS_URL, {
                    clientId,
                    clean:           true,
                    reconnectPeriod: 3000,
                    connectTimeout:  10_000,
                    keepalive:       30,
                    protocolVersion: 4,
                });

                mqttClient.on('connect', () => {
                    if (destroyedRef.current) return;
                    setConnected(true);
                    console.info(`[MQTT Dashboard] Connected  clientId=${clientId}`);

                    SUBSCRIBED_TOPICS.forEach(topic => {
                        mqttClient.subscribe(topic, { qos: 0 }, (err) => {
                            if (err) console.error(`[MQTT Dashboard] Subscribe failed (${topic}):`, err.message);
                            else     console.info(`[MQTT Dashboard] Subscribed to ${topic}`);
                        });
                    });
                });

                mqttClient.on('message', handleMessage);

                mqttClient.on('error',     err => console.warn('[MQTT Dashboard] Error (real-time disabled):', err.message));
                mqttClient.on('close',     () => { if (!destroyedRef.current) setConnected(false); });
                mqttClient.on('offline',   () => { if (!destroyedRef.current) setConnected(false); });
                mqttClient.on('reconnect', () => console.info('[MQTT Dashboard] Reconnecting…'));

                clientRef.current = mqttClient;
            })
            .catch(err => {
                console.warn('[MQTT Dashboard] Package not available, falling back to REST-only:', err.message);
            });

        return () => {
            destroyedRef.current = true;
            setConnected(false);
            if (mqttClient) {
                try {
                    SUBSCRIBED_TOPICS.forEach(t => mqttClient.unsubscribe(t));
                    mqttClient.end(/* force= */ true);
                } catch { /* ignore cleanup errors */ }
            }
            clientRef.current = null;
        };
    // handleMessage is stable — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { connected };
};
