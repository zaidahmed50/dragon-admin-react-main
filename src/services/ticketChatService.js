/**
 * ticketChatService.js
 *
 * REST client for the Ticket Chat API.
 *
 * axiosInstance.baseURL = "http://localhost:9090/api/v1"
 * All paths are RELATIVE — no host, no /api/v1 prefix.
 *
 * API contract (matches TicketChatController @ /api/v1/chat):
 *
 *  POST  /chat/message              — { ticketId, text, mentionedUserIds[] }
 *  POST  /chat/audio/{ticketId}     — multipart: field "audio"
 *  POST  /chat/history              — { ticketId, page, size }   ← body, NOT query params
 *  GET   /chat/{ticketId}/participants
 *  GET   /chat/audio/{ticketId}/{file}   — streams audio (no auth needed)
 */

import axiosInstance from './axiosConfig.js';

const ticketChatService = {

    /**
     * Send a plain-text message.
     * POST /chat/message
     * Body: { ticketId, text, mentionedUserIds[] }
     */
    sendMessage: async (ticketId, text, mentionedUserIds = []) => {
        const res = await axiosInstance.post('/chat/message', {
            ticketId,
            text,
            mentionedUserIds,
        });
        return res.data;
    },

    /**
     * Upload and send a voice note.
     * POST /chat/audio/{ticketId}   multipart, field "audio"
     */
    sendAudio: async (ticketId, audioBlob, filename = 'voice-note.webm') => {
        const formData = new FormData();
        formData.append('audio', audioBlob, filename);
        const res = await axiosInstance.post(
            `/chat/${ticketId}/audio`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return res.data;
    },

    /**
     * Fetch paginated chat history.
     * POST /chat/history
     * Body: { ticketId, page, size }   ← JSON body, NOT query params
     * Returns: Spring Page { content: ChatMessageResponse[], totalElements, ... }
     * content is newest-first — reverse before rendering.
     */
    getHistory: async (ticketId, page = 0, size = 50) => {
        const res = await axiosInstance.post('/chat/history', {
            ticketId,
            page,
            size,
        });
        return res.data;
    },

    /**
     * Fetch all participants for a ticket chat.
     * GET /chat/{ticketId}/participants
     */
    getParticipants: async (ticketId) => {
        const res = await axiosInstance.get(`/chat/${ticketId}/participants`);
        return res.data;
    },

    /**
     * Upload and send a file attachment.
     * POST /chat/{ticketId}/attachment   multipart, field "file"
     */
    sendAttachment: async (ticketId, file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        const res = await axiosInstance.post(
            `/chat/${ticketId}/attachment`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return res.data;
    },

    /**
     * Resolve a server-returned audioUrl to a full absolute URL
     * so <audio src="..."> can stream it directly.
     */
    resolveAudioUrl: (audioUrl) => {
        if (!audioUrl) return '';
        if (audioUrl.startsWith('blob:') || audioUrl.startsWith('http')) return audioUrl;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'}${audioUrl}`;
    },

    /**
     * Resolve a server-returned attachmentUrl to a full absolute URL.
     */
    resolveAttachmentUrl: (attachmentUrl) => {
        if (!attachmentUrl) return '';
        if (attachmentUrl.startsWith('blob:') || attachmentUrl.startsWith('http')) return attachmentUrl;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'}${attachmentUrl}`;
    },
};

export default ticketChatService;
