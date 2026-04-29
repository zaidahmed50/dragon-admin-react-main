/**
 * ChatNotificationContext.jsx
 *
 * Single global MQTT connection that:
 *   1. Subscribes to  ticket/chat/#  to count unread messages per ticket.
 *   2. Filters  ticket/chat/{id}/notify/{userId}  topics to show a snackbar
 *      when the current user is @mentioned: "Khuram mentioned you in TID-1002".
 *
 * Consumers:
 *   useChatNotification() — exposes unreadCounts, markRead, setActiveChatTicket
 *
 * The provider lives inside <AuthProvider> so it can read the current user.
 * It creates a single MQTT client regardless of how many tickets are open.
 */

import React, {
    createContext, useCallback, useContext,
    useEffect, useRef, useState,
} from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from './AuthContext';

/* ─── constants ──────────────────────────────────────────────────────────── */

const MQTT_WS_URL = import.meta.env.VITE_MQTT_WS_URL || 'ws://localhost:9001/mqtt';

/* ─── context ────────────────────────────────────────────────────────────── */

const ChatNotificationContext = createContext(null);

/* ─── provider ───────────────────────────────────────────────────────────── */

export const ChatNotificationProvider = ({ children }) => {
    const { user } = useAuth();
    // Auth object stores ID as "userId"; fall back to "id" for safety
    const currentUserId = user?.userId ?? user?.id ?? null;

    /* unreadCounts: { [ticketId: number]: number } */
    const [unreadCounts, setUnreadCounts] = useState({});

    /* snackbar state */
    const [snackbar, setSnackbar] = useState({
        open:         false,
        message:      '',
        ticketId:     null,
        ticketNumber: null,
    });

    /* Set tracking all ticket IDs whose chat popups are currently open/visible.
     * We don't increment unread for messages in any active (open) popup. */
    const activeTicketIdsRef = useRef(new Set());

    /* Stable ref for currentUserId so the MQTT handler never needs to re-register */
    const currentUserIdRef = useRef(currentUserId);
    useEffect(() => { currentUserIdRef.current = currentUserId; }, [currentUserId]);

    /* Keep markRead stable ref for setActiveChatTicket */
    const markReadRef = useRef(null);

    const destroyedRef = useRef(false);
    const clientRef    = useRef(null);

    /* ── public API ─────────────────────────────────────────────────────── */

    /** Call when the user opens a ticket's chat panel. Clears unread for that ticket. */
    const markRead = useCallback((ticketId) => {
        if (!ticketId) return;
        setUnreadCounts(prev => {
            if (!prev[ticketId]) return prev; // already zero — skip re-render
            const next = { ...prev };
            delete next[ticketId];
            return next;
        });
    }, []);

    useEffect(() => { markReadRef.current = markRead; }, [markRead]);

    /**
     * Add or remove a ticket from the "active" set.
     * active=true  → marks ticket as open (no unread increments) + clears badge.
     * active=false → removes from active set (unread will accumulate again).
     * ticketId=null → clears all active tickets (legacy usage).
     */
    const setActiveChatTicket = useCallback((ticketId, active = true) => {
        if (ticketId == null) {
            activeTicketIdsRef.current.clear();
            return;
        }
        const id = Number(ticketId);
        if (active) {
            activeTicketIdsRef.current.add(id);
            markReadRef.current?.(id);
        } else {
            activeTicketIdsRef.current.delete(id);
        }
    }, []);

    /* ── stable MQTT message handler ────────────────────────────────────── */

    const handleMessage = useCallback((topic, payloadBuffer) => {
        try {
            const text = typeof payloadBuffer === 'string'
                ? payloadBuffer
                : new TextDecoder().decode(payloadBuffer);
            const msg = JSON.parse(text);

            /*
             * Topic patterns:
             *   ticket/chat/{ticketId}                    — regular chat message
             *   ticket/chat/{ticketId}/notify/{userId}    — mention notification
             */
            const parts    = topic.split('/');
            const ticketId = parseInt(parts[2], 10);
            const isNotify = parts[3] === 'notify';

            if (isNaN(ticketId)) return;

            if (isNotify) {
                /* ── Mention notification ─────────────────────────────── */
                const notifiedUserId = parseInt(parts[4], 10);
                if (notifiedUserId !== currentUserIdRef.current) return;

                const ticketRef = msg.ticketNumber || `#${ticketId}`;
                setSnackbar({
                    open:         true,
                    message:      `${msg.senderName || 'Someone'} mentioned you in chat of ${ticketRef}`,
                    ticketId,
                    ticketNumber: msg.ticketNumber ?? null,
                });

            } else {
                /* ── Regular message — increment unread ───────────────── */
                // Skip if this ticket's chat popup is currently open/visible
                if (activeTicketIdsRef.current.has(ticketId)) return;

                setUnreadCounts(prev => ({
                    ...prev,
                    [ticketId]: (prev[ticketId] || 0) + 1,
                }));
            }
        } catch (e) {
            console.error('[ChatNotification] Failed to handle MQTT message', e);
        }
    }, []); // stable — reads currentUserId and activeTicketId via refs

    /* ── MQTT lifecycle ─────────────────────────────────────────────────── */

    useEffect(() => {
        if (!currentUserId) return; // not logged in yet

        destroyedRef.current = false;
        let mqttClient = null;

        import('mqtt')
            .then(mod => {
                const mqtt = mod.default ?? mod;
                if (destroyedRef.current) return;

                const clientId = `dragon-notif-${currentUserId}-${Date.now()}`;

                mqttClient = mqtt.connect(MQTT_WS_URL, {
                    clientId,
                    clean:           true,
                    reconnectPeriod: 5000,
                    connectTimeout:  10_000,
                    keepalive:       30,
                    protocolVersion: 4,   // MQTT 3.1.1
                });

                mqttClient.on('connect', () => {
                    if (destroyedRef.current) return;
                    console.info(`[ChatNotification] Connected  clientId=${clientId}`);

                    // Single wildcard subscription captures both regular messages
                    // (ticket/chat/{id}) and mention notifications (ticket/chat/{id}/notify/{uid})
                    mqttClient.subscribe('ticket/chat/#', { qos: 0 }, (err) => {
                        if (err) console.error('[ChatNotification] Subscribe failed:', err.message);
                        else     console.info('[ChatNotification] Subscribed to ticket/chat/#');
                    });
                });

                mqttClient.on('message', handleMessage);
                mqttClient.on('error',   err => console.warn('[ChatNotification] MQTT error:', err.message));
                mqttClient.on('close',   () => {});
                mqttClient.on('reconnect', () => console.info('[ChatNotification] Reconnecting…'));

                clientRef.current = mqttClient;
            })
            .catch(err => {
                console.warn('[ChatNotification] MQTT unavailable — notifications disabled:', err.message);
            });

        return () => {
            destroyedRef.current = true;
            if (mqttClient) {
                try {
                    mqttClient.unsubscribe('ticket/chat/#');
                    mqttClient.end(/* force= */ true);
                } catch { /* ignore cleanup errors */ }
            }
            clientRef.current = null;
        };
    // handleMessage is stable (uses refs) — intentionally not in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    /* ── snackbar close ─────────────────────────────────────────────────── */

    const closeSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    /* ── render ─────────────────────────────────────────────────────────── */

    return (
        <ChatNotificationContext.Provider value={{ unreadCounts, markRead, setActiveChatTicket }}>
            {children}

            {/* Global mention snackbar — shown anywhere in the app */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={7000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity="info"
                    variant="filled"
                    icon={<ChatIcon fontSize="small" />}
                    sx={{
                        minWidth:   300,
                        alignItems: 'center',
                        bgcolor:    'primary.main',
                        '& .MuiAlert-icon': { color: 'primary.contrastText' },
                    }}
                >
                    <Typography variant="body2" fontWeight={600} color="primary.contrastText">
                        {snackbar.message}
                    </Typography>
                </Alert>
            </Snackbar>
        </ChatNotificationContext.Provider>
    );
};

/* ─── hook ───────────────────────────────────────────────────────────────── */

export const useChatNotification = () => {
    const ctx = useContext(ChatNotificationContext);
    if (!ctx) throw new Error('useChatNotification must be used within ChatNotificationProvider');
    return ctx;
};
