/**
 * TicketChatPanel.jsx
 *
 * Ticket internal employee chat panel.
 *
 * Modes:
 *   Normal      — participant can read + send messages
 *   readOnly    — SUPER_ADMIN viewing any chat without participating
 *                 Input bar is hidden; "Viewing as Super Admin" banner shown.
 *
 * Data flow:
 *   Open        → POST /chat/history  { ticketId, page:0, size:50 }
 *   Send text   → POST /chat/message  { ticketId, text, mentionedUserIds[] }
 *   Send audio  → POST /chat/audio/{ticketId}  multipart
 *   Real-time   → MQTT ws://localhost:9001  topic: ticket/chat/{ticketId}
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Alert, Avatar, Box, Chip, CircularProgress, ClickAwayListener,
    Divider, IconButton, List, ListItem, ListItemAvatar,
    ListItemText, Paper, Popper, Skeleton, Snackbar,
    TextField, Tooltip, Typography,
} from '@mui/material';
import SendIcon            from '@mui/icons-material/Send';
import MicIcon             from '@mui/icons-material/Mic';
import StopIcon            from '@mui/icons-material/Stop';
import DeleteIcon          from '@mui/icons-material/Delete';
import CloseIcon           from '@mui/icons-material/Close';
import PlayArrowIcon       from '@mui/icons-material/PlayArrow';
import PauseIcon           from '@mui/icons-material/Pause';
import WifiIcon            from '@mui/icons-material/Wifi';
import WifiOffIcon         from '@mui/icons-material/WifiOff';
import RefreshIcon         from '@mui/icons-material/Refresh';
import AttachFileIcon      from '@mui/icons-material/AttachFile';
import DownloadIcon        from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import ticketChatService   from '../../services/ticketChatService.js';
import { useMqttChat }     from '@/hooks/chat/useMqttChat.js';
import { useEmployeeData } from '@/hooks/useEmployeeData.js';
import { formatDateTime }  from '../../helper/helper.jsx';
import {useAuth} from "../../contexts/AuthContext.jsx";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const STATUS_COLORS   = { OPEN: 'info', ASSIGNED: 'warning', IN_PROGRESS: 'primary', RESOLVED: 'success', CLOSED: 'default' };
const PRIORITY_COLORS = { HIGH: 'error', MEDIUM: 'warning', LOW: 'success' };

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');

const stringToColor = (str = '') => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return `hsl(${Math.abs(h) % 360},55%,45%)`;
};

const fmtAudio = (sec) => {
    // Guard against NaN (metadata not loaded yet) and Infinity (streaming / no Content-Length)
    if (!Number.isFinite(sec) || sec < 0) return '--:--';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

const isSuperAdmin = (user) =>
    user?.userType === 'SUPER_ADMIN' ||
    user?.userType?.userTypeTitle === 'Super Admin';

/* ─── Audio helpers ──────────────────────────────────────────────────────── */

/**
 * Returns the best supported audio MIME type including codec hints.
 * Priority: webm/opus (Chrome/Firefox) → ogg/opus (Firefox) → mp4 (Safari) → fallback
 */
const getBestMimeType = () => {
    const preferred = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
    ];
    return preferred.find(t => {
        try { return MediaRecorder.isTypeSupported(t); } catch { return false; }
    }) ?? '';
};

/** Maps MIME type to a file extension the server can use for Content-Type detection. */
const getAudioExtension = (mimeType = '') => {
    if (mimeType.includes('ogg'))  return 'ogg';
    if (mimeType.includes('mp4'))  return 'm4a';
    return 'webm';
};

/* ─── AudioMessage ───────────────────────────────────────────────────────── */

const AudioMessage = ({ src, hintDuration, onPlay }) => {
    const audioRef = useRef(null);
    const [playing,   setPlaying]   = useState(false);
    const [progress,  setProgress]  = useState(0);
    const [current,   setCurrent]   = useState(0);
    // Seed duration from server-provided value so something sensible shows immediately.
    // onLoadedMetadata will overwrite with the exact value once the browser reads the file.
    const [duration,  setDuration]  = useState(hintDuration ?? 0);
    const [loadError, setLoadError] = useState(false);

    // When src changes (blob → real URL after upload) force the element to reload
    useEffect(() => {
        setPlaying(false);
        setProgress(0);
        setCurrent(0);
        setLoadError(false);
        // Re-seed the hint so the label doesn't flash back to --:-- on src change
        setDuration(hintDuration ?? 0);
        if (src) audioRef.current?.load();
    }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

    // Exposed pause handler — the panel calls this to stop us when another audio starts
    const pause = () => {
        audioRef.current?.pause();
        setPlaying(false);
    };

    const toggle = async () => {
        if (!audioRef.current || !src) return;
        try {
            if (playing) {
                audioRef.current.pause();
                setPlaying(false);
            } else {
                // Notify the panel so it can stop whoever was playing before
                onPlay?.(pause);
                await audioRef.current.play();
                setPlaying(true);
            }
        } catch (err) {
            console.error('[AudioMessage] play() rejected:', err.name, err.message);
            if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
                setLoadError(true);
            }
            setPlaying(false);
        }
    };

    if (!src || loadError) {
        return (
            <Typography variant="caption" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                {!src ? 'Loading audio…' : 'Audio unavailable'}
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
            {/* Native audio element — controlled programmatically via ref */}
            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                onLoadedMetadata={e => {
                    const d = e.target.duration;
                    // Only overwrite the hint if the browser reports a real finite duration
                    if (Number.isFinite(d) && d > 0) setDuration(d);
                }}
                onTimeUpdate={e => {
                    const t = e.target.currentTime;
                    const d = e.target.duration || 1;
                    setCurrent(t);
                    setProgress((t / d) * 100);
                }}
                onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
                onError={() => setLoadError(true)}
            />

            <IconButton size="small" onClick={toggle} sx={{ color: 'inherit', flexShrink: 0 }}>
                {playing ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>

            {/* Progress bar */}
            <Box sx={{ flex: 1, position: 'relative', height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.15)', cursor: 'pointer' }}
                onClick={e => {
                    if (!audioRef.current || !duration) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct  = (e.clientX - rect.left) / rect.width;
                    audioRef.current.currentTime = pct * duration;
                }}
            >
                <Box sx={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: `${progress}%`, bgcolor: 'currentcolor',
                    borderRadius: 2, opacity: 0.85, transition: 'width 0.1s',
                }} />
            </Box>

            {/* Show current time while playing, total duration otherwise */}
            <Typography variant="caption" sx={{ minWidth: 34, opacity: 0.85, fontSize: '0.65rem', flexShrink: 0 }}>
                {fmtAudio(playing || progress > 0 ? current : duration)}
            </Typography>
        </Box>
    );
};

/* ─── AttachmentMessage ──────────────────────────────────────────────────── */

/** Format bytes → human-readable size string */
const fmtSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

const isImage = (mime = '') => mime.startsWith('image/');

const AttachmentMessage = ({ msg, isMine }) => {
    const url      = ticketChatService.resolveAttachmentUrl(msg.attachmentUrl);
    const mime     = msg.attachmentMimeType || '';
    const name     = msg.attachmentOriginalName || 'file';
    const size     = msg.attachmentSize;
    const imgStyle = { maxWidth: '100%', maxHeight: 200, borderRadius: 6, display: 'block', cursor: 'pointer' };

    if (isImage(mime)) {
        return (
            <Box>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={name} style={imgStyle} />
                </a>
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.75 }}>
                    {name} {size ? `· ${fmtSize(size)}` : ''}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
            <InsertDriveFileIcon sx={{ fontSize: 32, opacity: 0.7, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap sx={{ wordBreak: 'break-all' }}>
                    {name}
                </Typography>
                {size > 0 && (
                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                        {fmtSize(size)}
                    </Typography>
                )}
            </Box>
            <Tooltip title="Download">
                <IconButton
                    size="small"
                    component="a"
                    href={url}
                    download={name}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'inherit', flexShrink: 0 }}
                >
                    <DownloadIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

/* ─── MentionDropdown ────────────────────────────────────────────────────── */

const MentionDropdown = ({ open, anchorEl, employees, query, onSelect, onClose }) => {
    const list = (employees || [])
        .filter(e => (e.name || '').toLowerCase().includes((query || '').toLowerCase()))
        .slice(0, 8);

    if (!open || !list.length) return null;

    return (
        <Popper open anchorEl={anchorEl} placement="top-start" sx={{ zIndex: 9999 }}>
            <ClickAwayListener onClickAway={onClose}>
                <Paper elevation={6} sx={{
                    maxHeight: 220, overflowY: 'auto', minWidth: 230,
                    border: 1, borderColor: 'divider', borderRadius: 2, mb: 1,
                }}>
                    <List dense disablePadding>
                        {list.map(emp => (
                            <ListItem
                                key={emp.userId ?? emp.id}
                                onClick={() => onSelect(emp)}
                                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, px: 1.5, py: 0.8 }}
                            >
                                <ListItemAvatar sx={{ minWidth: 36 }}>
                                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: stringToColor(emp.name ?? '') }}>
                                        {getInitials(emp.name)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={emp.name}
                                    secondary={emp.designation?.[0]?.name ?? emp.email ?? ''}
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </ClickAwayListener>
        </Popper>
    );
};

/* ─── ChatBubble ─────────────────────────────────────────────────────────── */

const ChatBubble = ({ msg, isMine, onAudioPlay }) => {
    const renderText = () => {
        const parts = (msg.text || '').split(/(@\S+)/g);
        return (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {parts.map((part, i) =>
                    part.startsWith('@') ? (
                        <Box key={i} component="span" sx={{
                            fontWeight: 700,
                            bgcolor: isMine ? 'rgba(255,255,255,0.2)' : 'primary.50',
                            color:   isMine ? 'inherit' : 'primary.main',
                            borderRadius: 0.5, px: 0.4,
                        }}>{part}</Box>
                    ) : part
                )}
            </Typography>
        );
    };

    return (
        <Box sx={{
            display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row',
            alignItems: 'flex-end', gap: 1, mb: 1.5, width: '100%',
        }}>
            {!isMine && (
                <Avatar sx={{ width: 30, height: 30, fontSize: '0.68rem', bgcolor: stringToColor(msg.senderName ?? ''), flexShrink: 0 }}>
                    {getInitials(msg.senderName)}
                </Avatar>
            )}
            <Box sx={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                {!isMine && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3, pl: 0.5, fontWeight: 600 }}>
                        {msg.senderName}
                    </Typography>
                )}
                <Box sx={{
                    px: 1.5, py: 1,
                    borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    bgcolor:      isMine ? 'primary.main' : 'background.paper',
                    color:        isMine ? 'primary.contrastText' : 'text.primary',
                    border:       isMine ? 'none' : 1,
                    borderColor:  'divider',
                    boxShadow:    1,
                    opacity:      msg._uploading ? 0.65 : 1,
                    transition:   'opacity 0.2s',
                }}>
                    {msg.type === 'AUDIO'
                        ? <AudioMessage
                            src={ticketChatService.resolveAudioUrl(msg.audioUrl)}
                            hintDuration={msg.audioDurationSeconds ?? null}
                            onPlay={onAudioPlay}
                          />
                        : msg.type === 'ATTACHMENT'
                        ? <AttachmentMessage msg={msg} isMine={isMine} />
                        : renderText()
                    }
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, px: 0.5, fontSize: '0.62rem' }}>
                    {msg.createdAt ? formatDateTime(msg.createdAt) : ''}
                    {msg._uploading && ' · uploading…'}
                    {msg._failed   && ' · failed to send'}
                </Typography>
            </Box>
        </Box>
    );
};

/* ─── Skeleton loading ───────────────────────────────────────────────────── */

const SkeletonBubbles = () => (
    <>
        {[0.6, 0.4, 0.75, 0.5, 0.65].map((w, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: i % 2 ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                <Skeleton variant="rounded" width={`${w * 100}%`} height={44} sx={{ borderRadius: 3 }} />
            </Box>
        ))}
    </>
);

/* ─── Main ───────────────────────────────────────────────────────────────── */

const TicketChatPanel = ({ ticket, onClose, hideHeader = false }) => {
    const { user: authUser } = useAuth();
    const currentUser = {
        id:       authUser?.userId ?? authUser?.id ?? null,
        name:     authUser?.name ?? 'You',
        userType: authUser?.userType ?? null,
    };
    const readOnly = isSuperAdmin(currentUser);

    /* State */
    const [messages,  setMessages]  = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending,   setSending]   = useState(false);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);

    const pendingMentions = useRef([]);

    const [mentionOpen,  setMentionOpen]  = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const inputRef = useRef(null);

    const [recording,        setRecording]        = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const mediaRecorderRef  = useRef(null);
    const audioChunksRef    = useRef([]);
    const recordingTimerRef = useRef(null);
    // When true, the onstop handler discards the recorded chunks instead of uploading
    const cancelledRef      = useRef(false);

    // ── Snackbar (error / info toasts) ───────────────────────────────────────
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'error' });
    const showError = (msg) => setSnack({ open: true, message: msg, severity: 'error' });
    const showInfo  = (msg) => setSnack({ open: true, message: msg, severity: 'info'  });
    const closeSnack = () => setSnack(s => ({ ...s, open: false }));

    // ── Attachment ───────────────────────────────────────────────────────────
    const fileInputRef          = useRef(null);
    const [attachPreview, setAttachPreview] = useState(null); // { file, localUrl, isImage }

    const bottomRef = useRef(null);

    // Tracks the pause() function of the currently playing AudioMessage.
    // When a new audio starts we call the stored function to stop the previous one.
    const activeAudioRef = useRef(null);
    const handleAudioPlay = useCallback((pauseFn) => {
        if (activeAudioRef.current && activeAudioRef.current !== pauseFn) {
            activeAudioRef.current();   // pause the previously-playing message
        }
        activeAudioRef.current = pauseFn;
    }, []);

    const { employees, fetchEmployees } = useEmployeeData();
    useEffect(() => { if (!readOnly) fetchEmployees?.('', 0); }, []); // eslint-disable-line

    /* ── Load history — POST /chat/history { ticketId, page, size } ────── */

    const loadHistory = useCallback(async () => {
        if (!ticket?.id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await ticketChatService.getHistory(ticket.id, 0, 50);
            // Spring Page: content is newest-first → reverse for chronological display
            const content = Array.isArray(data?.content)
                ? data.content
                : Array.isArray(data) ? data : [];
            setMessages([...content].reverse());
        } catch (err) {
            const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to load messages';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [ticket?.id]);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    /* ── MQTT real-time ─────────────────────────────────────────────────── */

    const handleMqttMessage = useCallback((incoming) => {
        setMessages(prev => {
            if (prev.some(m => m.id != null && m.id === incoming.id)) return prev;
            return [...prev, incoming];
        });
    }, []);

    const { connected: mqttConnected } = useMqttChat(ticket?.id, currentUser.id, handleMqttMessage);

    /* ── Auto-scroll ────────────────────────────────────────────────────── */

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /* ── Input / @mention ───────────────────────────────────────────────── */

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputText(val);
        const cursor = e.target.selectionStart ?? val.length;
        const match  = val.slice(0, cursor).match(/@(\w[\w ]*)$/);
        if (match) { setMentionQuery(match[1]); setMentionOpen(true); }
        else        { setMentionOpen(false);    setMentionQuery(''); }
    };

    const handleMentionSelect = (emp) => {
        const cursor = inputRef.current?.selectionStart ?? inputText.length;
        const before = inputText.slice(0, cursor).replace(/@(\w[\w ]*)$/, `@${emp.name} `);
        setInputText(before + inputText.slice(cursor));
        setMentionOpen(false);
        setMentionQuery('');
        const uid = emp.userId ?? emp.id;
        if (uid && !pendingMentions.current.some(m => m.id === uid))
            pendingMentions.current.push({ id: uid, name: emp.name });
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    /* ── Send text ──────────────────────────────────────────────────────── */

    const handleSend = useCallback(async () => {
        const text = inputText.trim();
        if (!text || sending || readOnly) return;

        const mentionIds = pendingMentions.current.map(m => m.id);
        pendingMentions.current = [];
        setSending(true);

        const optId  = `opt-${Date.now()}`;
        const optMsg = {
            id: optId, type: 'TEXT', text,
            senderId: currentUser.id, senderName: currentUser.name,
            createdAt: new Date().toISOString(), mentions: [],
        };
        setMessages(prev => [...prev, optMsg]);
        setInputText('');

        try {
            const saved = await ticketChatService.sendMessage(ticket.id, text, mentionIds);
            setMessages(prev => prev.map(m => m.id === optId ? saved : m));
        } catch (err) {
            console.error('[Chat] sendMessage failed:', err);
            setMessages(prev => prev.map(m =>
                m.id === optId ? { ...m, _failed: true } : m
            ));
        } finally {
            setSending(false);
        }
    }, [inputText, sending, readOnly, ticket?.id, currentUser]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    /* ── Audio recording ────────────────────────────────────────────────── */

    const startRecording = async () => {
        if (readOnly) return;
        try {
            const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = getBestMimeType();
            const mr       = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = mr;
            audioChunksRef.current   = [];

            cancelledRef.current = false;  // reset on every new recording
            mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            mr.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());
                if (cancelledRef.current) {
                    audioChunksRef.current = [];
                    return;
                }
                const actualMimeType = mr.mimeType || mimeType || 'audio/webm';
                const ext            = getAudioExtension(actualMimeType);
                const blob           = new Blob(audioChunksRef.current, { type: actualMimeType });
                const localUrl       = URL.createObjectURL(blob);

                const optId  = `opt-audio-${Date.now()}`;
                const optMsg = {
                    id: optId, type: 'AUDIO', audioUrl: localUrl,
                    senderId: currentUser.id, senderName: currentUser.name,
                    createdAt: new Date().toISOString(), _uploading: true,
                };
                setMessages(prev => [...prev, optMsg]);

                try {
                    const saved = await ticketChatService.sendAudio(
                        ticket.id, blob, `voice-note.${ext}`);
                    setMessages(prev => prev.map(m => m.id === optId ? saved : m));
                    setTimeout(() => URL.revokeObjectURL(localUrl), 2000);
                } catch (err) {
                    console.error('[Chat] sendAudio failed:', err);
                    setMessages(prev => prev.map(m =>
                        m.id === optId ? { ...m, _uploading: false, _failed: true } : m
                    ));
                }
            };

            mr.start(250);
            setRecording(true);
            setRecordingSeconds(0);
            recordingTimerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
        } catch {
            alert('Microphone access denied or unavailable.');
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        clearInterval(recordingTimerRef.current);
        setRecording(false);
        setRecordingSeconds(0);
    };

    /** Discard the current recording without uploading — no message is added. */
    const cancelRecording = () => {
        cancelledRef.current = true;
        mediaRecorderRef.current?.stop();
        clearInterval(recordingTimerRef.current);
        setRecording(false);
        setRecordingSeconds(0);
    };

    /* ── Attachment handlers ────────────────────────────────────────────── */

    const handleAttachClick = () => {
        if (readOnly || recording) return;
        fileInputRef.current?.click();
    };

    const MAX_ATTACH_BYTES = 10 * 1024 * 1024; // 10 MB — must match backend

    const handleFileSelected = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = ''; // Reset so same file can be re-selected after cancel

        if (file.size > MAX_ATTACH_BYTES) {
            showError(`File is too large (${(file.size / 1048576).toFixed(1)} MB). Maximum allowed size is 10 MB.`);
            return;
        }

        const localUrl = URL.createObjectURL(file);
        setAttachPreview({ file, localUrl, isImage: file.type.startsWith('image/') });
    };

    const cancelAttachment = () => {
        if (attachPreview?.localUrl) URL.revokeObjectURL(attachPreview.localUrl);
        setAttachPreview(null);
    };

    const sendAttachment = useCallback(async () => {
        if (!attachPreview || readOnly) return;
        const { file, localUrl } = attachPreview;
        setAttachPreview(null);

        const optId  = `opt-attach-${Date.now()}`;
        const optMsg = {
            id: optId, type: 'ATTACHMENT',
            attachmentUrl: localUrl,
            attachmentOriginalName: file.name,
            attachmentMimeType: file.type,
            attachmentSize: file.size,
            senderId: currentUser.id, senderName: currentUser.name,
            createdAt: new Date().toISOString(), _uploading: true,
        };
        setMessages(prev => [...prev, optMsg]);

        try {
            const saved = await ticketChatService.sendAttachment(ticket.id, file);
            setMessages(prev => prev.map(m => m.id === optId ? saved : m));
            setTimeout(() => URL.revokeObjectURL(localUrl), 2000);
        } catch (err) {
            console.error('[Chat] sendAttachment failed:', err);
            // Remove the optimistic message
            setMessages(prev => prev.filter(m => m.id !== optId));
            URL.revokeObjectURL(localUrl);

            // Show a user-friendly error
            const status = err?.response?.status;
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
            if (status === 413 || serverMsg?.toLowerCase().includes('too large') || serverMsg?.toLowerCase().includes('maximum upload')) {
                showError('File is too large. Maximum allowed size is 10 MB.');
            } else if (serverMsg) {
                showError(serverMsg);
            } else {
                showError('Failed to send attachment. Please try again.');
            }
        }
    }, [attachPreview, readOnly, ticket?.id, currentUser]);

    if (!ticket) return null;

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            bgcolor: 'background.default',
            overflow: 'hidden',
        }}>

            {/* ── Header — hidden in popup mode (ChatPopupWindow has its own) ── */}
            {!hideHeader && <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5,
                bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', flexShrink: 0,
            }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                        #{ticket.ticketNumber} — {ticket.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Chip label={ticket.status} size="small"
                            color={STATUS_COLORS[ticket.status] ?? 'default'}
                            sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }} />
                        <Chip label={ticket.priority} size="small"
                            color={PRIORITY_COLORS[ticket.priority] ?? 'default'}
                            sx={{ height: 18, fontSize: '0.62rem' }} />
                        {ticket.customer?.name && (
                            <Chip label={ticket.customer.name} size="small" variant="outlined"
                                sx={{ height: 18, fontSize: '0.62rem' }} />
                        )}
                        <Tooltip title={mqttConnected ? 'Live – real-time active' : 'Offline – REST only'}>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                                {mqttConnected
                                    ? <WifiIcon    sx={{ fontSize: 13, color: 'success.main' }} />
                                    : <WifiOffIcon sx={{ fontSize: 13, color: 'warning.main' }} />
                                }
                            </Box>
                        </Tooltip>
                    </Box>
                </Box>
                <Tooltip title="Refresh messages">
                    <span>
                        <IconButton size="small" onClick={loadHistory} disabled={loading}>
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Close chat">
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>}

            {/* ── Super Admin read-only banner ── */}
            {readOnly && (
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 2, py: 0.8, bgcolor: 'warning.50',
                    borderBottom: 1, borderColor: 'warning.200', flexShrink: 0,
                }}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 16, color: 'warning.dark' }} />
                    <Typography variant="caption" color="warning.dark" fontWeight={600}>
                        Viewing as Super Admin — read-only access to all chats
                    </Typography>
                </Box>
            )}

            {/* ── Messages ── */}
            <Box sx={{
                flex: 1, overflowY: 'auto', px: 2, py: 2,
                display: 'flex', flexDirection: 'column',
                '&::-webkit-scrollbar': { width: 5 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 4 },
            }}>
                {loading ? (
                    <SkeletonBubbles />
                ) : error ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Typography variant="body2" color="error.main">{error}</Typography>
                        <Typography variant="caption" color="primary.main"
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={loadHistory}>
                            Retry
                        </Typography>
                    </Box>
                ) : messages.length === 0 ? (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No messages yet.
                        </Typography>
                    </Box>
                ) : (
                    messages.map(msg => (
                        <ChatBubble
                            key={msg.id}
                            msg={msg}
                            isMine={!readOnly && String(msg.senderId) === String(currentUser.id)}
                            onAudioPlay={handleAudioPlay}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </Box>

            <Divider />

            {/* ── Input — hidden for Super Admin ── */}
            {!readOnly && (
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', flexShrink: 0, position: 'relative' }}>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.mp4,.mov"
                        onChange={handleFileSelected}
                    />

                    <MentionDropdown
                        open={mentionOpen}
                        anchorEl={inputRef.current}
                        employees={employees}
                        query={mentionQuery}
                        onSelect={handleMentionSelect}
                        onClose={() => setMentionOpen(false)}
                    />

                    {recording && (
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 1, mb: 1,
                            px: 1.5, py: 0.8, bgcolor: 'error.50',
                            borderRadius: 2, border: 1, borderColor: 'error.200',
                        }}>
                            {/* Blinking red dot */}
                            <Box sx={{
                                width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main',
                                flexShrink: 0,
                                animation: 'blink 1s infinite',
                                '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.15 } },
                            }} />
                            <Typography variant="caption" color="error.main" fontWeight={700}>
                                Recording… {fmtAudio(recordingSeconds)}
                            </Typography>

                            {/* Cancel — discards the recording silently */}
                            <Tooltip title="Cancel recording">
                                <IconButton
                                    size="small"
                                    onClick={cancelRecording}
                                    sx={{ ml: 'auto', color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>

                            {/* Stop & send */}
                            <Tooltip title="Send voice note">
                                <IconButton
                                    size="small"
                                    onClick={stopRecording}
                                    sx={{ color: 'error.main', bgcolor: 'error.100', '&:hover': { bgcolor: 'error.200' } }}
                                >
                                    <SendIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                    {/* ── Attachment preview ── */}
                    {attachPreview && (
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 1, mb: 1,
                            px: 1.5, py: 0.8, bgcolor: 'info.50',
                            borderRadius: 2, border: 1, borderColor: 'info.200',
                        }}>
                            {attachPreview.isImage ? (
                                <img
                                    src={attachPreview.localUrl}
                                    alt="preview"
                                    style={{ height: 48, width: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                                />
                            ) : (
                                <InsertDriveFileIcon sx={{ fontSize: 28, color: 'info.main', flexShrink: 0 }} />
                            )}
                            <Typography variant="caption" fontWeight={600} noWrap sx={{ flex: 1 }}>
                                {attachPreview.file.name}
                                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                    ({fmtSize(attachPreview.file.size)})
                                </Typography>
                            </Typography>

                            {/* Cancel */}
                            <Tooltip title="Cancel attachment">
                                <IconButton size="small" onClick={cancelAttachment} sx={{ color: 'text.secondary' }}>
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>

                            {/* Send */}
                            <Tooltip title="Send attachment">
                                <IconButton
                                    size="small"
                                    onClick={sendAttachment}
                                    sx={{ color: 'info.main', bgcolor: 'info.100', '&:hover': { bgcolor: 'info.200' } }}
                                >
                                    <SendIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <TextField
                            inputRef={inputRef}
                            multiline maxRows={4} fullWidth size="small"
                            placeholder="Type a message… @ to mention someone"
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={recording}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        {/* Attach file button */}
                        {!recording && (
                            <Tooltip title="Attach file">
                                <IconButton size="small" onClick={handleAttachClick} color={attachPreview ? 'info' : 'default'}>
                                    <AttachFileIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Mic button — only visible when NOT recording */}
                        {!recording && (
                            <Tooltip title="Record voice note">
                                <IconButton size="small" onClick={startRecording}>
                                    <MicIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="Send (Enter)">
                            <span>
                                <IconButton
                                    size="small" onClick={handleSend}
                                    disabled={!inputText.trim() || sending || recording}
                                    sx={{
                                        bgcolor: 'primary.main', color: 'primary.contrastText',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                                    }}
                                >
                                    {sending
                                        ? <CircularProgress size={18} color="inherit" />
                                        : <SendIcon fontSize="small" />
                                    }
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>

                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block', pl: 0.5 }}>
                        <strong>Enter</strong> send · <strong>Shift+Enter</strong> new line · <strong>@name</strong> mention
                    </Typography>
                </Box>
            )}

            {/* ── Error / Info Snackbar ── */}
            <Snackbar
                open={snack.open}
                autoHideDuration={5000}
                onClose={closeSnack}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TicketChatPanel;
