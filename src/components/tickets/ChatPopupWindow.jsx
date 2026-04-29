/**
 * ChatPopupWindow.jsx
 *
 * A single floating chat popup window, Facebook-style.
 * Renders fixed at the bottom of the screen, stacked from right to left.
 *
 * Props:
 *   ticket       — ticket object
 *   minimized    — boolean
 *   index        — position from right (0 = rightmost)
 *   unreadCount  — badge count shown when minimized
 *   onClose      — fn()
 *   onMinimize   — fn()
 */

import React, { useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import CloseIcon  from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import TicketChatPanel from './TicketChatPanel';
import { useChatNotification } from '../../contexts/ChatNotificationContext';

/* ── Layout constants ─────────────────────────────────────────────────────── */
const POPUP_WIDTH   = 500;
const POPUP_HEIGHT  = 540;
const POPUP_GAP     = 20;

/* ── Status → accent colour map ──────────────────────────────────────────── */
const STATUS_ACCENT = {
    OPEN:        '#0288d1',
    ASSIGNED:    '#ed6c02',
    IN_PROGRESS: '#1976d2',
    RESOLVED:    '#2e7d32',
    CLOSED:      '#9e9e9e',
};

/* ─────────────────────────────────────────────────────────────────────────── */

const ChatPopupWindow = ({ ticket, minimized, index, unreadCount, onClose, onMinimize }) => {
    const { setActiveChatTicket } = useChatNotification();
    useEffect(() => {
        if (!minimized) {
            setActiveChatTicket(ticket.id, true);
        } else {
            setActiveChatTicket(ticket.id, false);
        }
    }, [minimized, ticket.id, setActiveChatTicket]);
    useEffect(() => {
        return () => setActiveChatTicket(ticket.id, false);
    }, [ticket.id, setActiveChatTicket]);

    const rightOffset = index * (POPUP_WIDTH + POPUP_GAP) + POPUP_GAP;
    const accent      = STATUS_ACCENT[ticket.status] ?? '#1976d2';

    return (
        <Box
            sx={{
                position:      'fixed',
                bottom:        0,
                right:         rightOffset,
                width:         POPUP_WIDTH,
                height:        minimized ? 50 : POPUP_HEIGHT,
                display:       'flex',
                flexDirection: 'column',
                borderRadius:  '12px 12px 0 0',
                overflow:      'hidden',
                boxShadow:     '0 6px 32px rgba(0,0,0,0.22)',
                zIndex:        1300 + index,
                transition:    'height 0.25s cubic-bezier(0.4,0,0.2,1)',
                border:        '1px solid',
                borderColor:   'divider',
                borderBottom:  'none',
            }}
        >
            {/* ── Header ────────────────────────────────────────────────── */}
            <Box
                onClick={onMinimize}
                sx={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           0.5,
                    px:            1.5,
                    minHeight:     50,
                    bgcolor:       'primary.main',
                    color:         'white',
                    cursor:        'pointer',
                    flexShrink:    0,
                    userSelect:    'none',
                    position:      'relative',
                    '&:hover':     { bgcolor: 'primary.dark' },
                    transition:    'background-color 0.15s',
                }}
            >
                {/* Coloured status strip on left edge */}
                <Box sx={{
                    position:  'absolute',
                    left:      0,
                    top:       0,
                    bottom:    0,
                    width:     4,
                    bgcolor:   accent,
                }} />

                {/* Ticket info */}
                <Box sx={{ flex: 1, minWidth: 0, pl: 0.5, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                            variant="caption"
                            fontWeight={700}
                            noWrap
                            sx={{ color: 'inherit', lineHeight: 1.3 }}
                        >
                            #{ticket.ticketNumber}
                        </Typography>

                        {/* Unread badge — only shown when minimized */}
                        {minimized && unreadCount > 0 && (
                            <Box sx={{
                                bgcolor:      'error.main',
                                color:        'white',
                                borderRadius: '10px',
                                px:           0.7,
                                fontSize:     '0.58rem',
                                fontWeight:   800,
                                lineHeight:   1.5,
                                flexShrink:   0,
                            }}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Box>
                        )}
                    </Box>
                    <Typography
                        variant="caption"
                        noWrap
                        sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.62rem', display: 'block', lineHeight: 1.3 }}
                    >
                        {ticket.title}
                    </Typography>
                </Box>

                {/* Minimize */}
                <Tooltip title={minimized ? 'Open chat' : 'Minimize'} placement="top">
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                        sx={{ color: 'white', p: 0.4, '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}
                    >
                        {minimized
                            ? <OpenInFullIcon sx={{ fontSize: 15 }} />
                            : <RemoveIcon    sx={{ fontSize: 15 }} />
                        }
                    </IconButton>
                </Tooltip>

                {/* Close */}
                <Tooltip title="Close" placement="top">
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        sx={{ color: 'white', p: 0.4, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                    >
                        <CloseIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* ── Chat body ─────────────────────────────────────────────── */}
            {!minimized && (
                <Box sx={{
                    flex:          1,
                    minHeight:     0,
                    display:       'flex',
                    flexDirection: 'column',
                    overflow:      'hidden',
                    bgcolor:       'background.paper',
                }}>
                    {/* hideHeader — popup window already shows ticket info */}
                    <TicketChatPanel ticket={ticket} onClose={onClose} hideHeader />
                </Box>
            )}
        </Box>
    );
};

export default ChatPopupWindow;
