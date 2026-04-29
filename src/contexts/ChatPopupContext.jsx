/**
 * ChatPopupContext.jsx
 *
 * Manages the list of floating chat popup windows (Facebook-style).
 * Each popup corresponds to one ticket chat.
 *
 * API exposed via useChatPopup():
 *   openChats    — array of { ticket, minimized }
 *   openChat(ticket)      — open a new popup or restore a minimized one
 *   closeChat(ticketId)   — remove popup
 *   minimizeChat(ticketId) — toggle minimized state
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatPopupContext = createContext(null);

const MAX_POPUPS = 4; // max simultaneous popups

export const ChatPopupProvider = ({ children }) => {
    // openChats: [{ ticket: TicketObject, minimized: boolean }]
    const [openChats, setOpenChats] = useState([]);

    /** Open a chat popup. If already open, unminimize it. */
    const openChat = useCallback((ticket) => {
        setOpenChats(prev => {
            const exists = prev.find(c => c.ticket.id === ticket.id);
            if (exists) {
                // Already open — just restore if minimized
                return prev.map(c =>
                    c.ticket.id === ticket.id ? { ...c, minimized: false } : c
                );
            }
            // At the limit — drop the oldest popup to make room
            const list = prev.length >= MAX_POPUPS ? prev.slice(1) : prev;
            return [...list, { ticket, minimized: false }];
        });
    }, []);

    /** Close and remove a popup. */
    const closeChat = useCallback((ticketId) => {
        setOpenChats(prev => prev.filter(c => c.ticket.id !== ticketId));
    }, []);

    /** Toggle minimized state of a popup. */
    const minimizeChat = useCallback((ticketId) => {
        setOpenChats(prev =>
            prev.map(c =>
                c.ticket.id === ticketId ? { ...c, minimized: !c.minimized } : c
            )
        );
    }, []);

    return (
        <ChatPopupContext.Provider value={{ openChats, openChat, closeChat, minimizeChat }}>
            {children}
        </ChatPopupContext.Provider>
    );
};

export const useChatPopup = () => {
    const ctx = useContext(ChatPopupContext);
    if (!ctx) throw new Error('useChatPopup must be used within ChatPopupProvider');
    return ctx;
};
