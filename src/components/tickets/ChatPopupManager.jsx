/**
 * ChatPopupManager.jsx
 *
 * Renders all open chat popup windows (Facebook-style bottom-right stack).
 * Place once at the top of the app, outside the router.
 */

import React from 'react';
import { useChatPopup }        from '../../contexts/ChatPopupContext';
import { useChatNotification } from '../../contexts/ChatNotificationContext';
import ChatPopupWindow         from './ChatPopupWindow';

const ChatPopupManager = () => {
    const { openChats, closeChat, minimizeChat } = useChatPopup();
    const { unreadCounts }                       = useChatNotification();

    if (!openChats.length) return null;

    return (
        <>
            {openChats.map((chat, index) => (
                <ChatPopupWindow
                    key={chat.ticket.id}
                    ticket={chat.ticket}
                    minimized={chat.minimized}
                    index={index}
                    unreadCount={unreadCounts[chat.ticket.id] ?? 0}
                    onClose={()    => closeChat(chat.ticket.id)}
                    onMinimize={() => minimizeChat(chat.ticket.id)}
                />
            ))}
        </>
    );
};

export default ChatPopupManager;
