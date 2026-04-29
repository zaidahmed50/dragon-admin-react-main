import { useState, useCallback } from 'react';
import { backupService } from '../services/backupService.js';

export const useBackup = () => {
    const [history, setHistory]           = useState([]);
    const [driveFiles, setDriveFiles]     = useState([]);
    const [oauthStatus, setOauthStatus]   = useState(null);
    const [loading, setLoading]           = useState(false);
    const [actionLoading, setActionLoading] = useState('');
    const [error, setError]               = useState(null);
    const [successMsg, setSuccessMsg]     = useState('');

    const clearMessages = () => { setError(null); setSuccessMsg(''); };

    // ── Load backup history ──────────────────────────────────────────────────
    const fetchHistory = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await backupService.getBackupHistory();
            setHistory(res.data || []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load backup history');
        } finally { setLoading(false); }
    }, []);

    // ── Load Drive files ─────────────────────────────────────────────────────
    const fetchDriveFiles = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await backupService.listDriveFiles();
            setDriveFiles(res.data || []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load Drive files');
        } finally { setLoading(false); }
    }, []);

    // ── Load OAuth status ────────────────────────────────────────────────────
    const fetchOAuthStatus = useCallback(async () => {
        try {
            const res = await backupService.getOAuthStatus();
            setOauthStatus(res.data || {});
        } catch (e) {
            setOauthStatus({ connected: false });
        }
    }, []);

    // ── Trigger manual backup ────────────────────────────────────────────────
    const triggerBackup = useCallback(async () => {
        clearMessages();
        setActionLoading('backup');
        try {
            const res = await backupService.triggerManualBackup();
            setSuccessMsg(res.message || 'Backup completed successfully');
            await fetchHistory();
        } catch (e) {
            setError(e?.response?.data?.message || 'Backup failed');
        } finally { setActionLoading(''); }
    }, [fetchHistory]);

    // ── Restore from Drive ───────────────────────────────────────────────────
    const restoreDatabase = useCallback(async (fileId) => {
        clearMessages();
        setActionLoading('restore_' + fileId);
        try {
            const res = await backupService.restoreFromDrive(fileId);
            setSuccessMsg(res.message || 'Database restored successfully');
        } catch (e) {
            setError(e?.response?.data?.message || 'Restore failed');
        } finally { setActionLoading(''); }
    }, []);

    // ── Connect Google Drive ─────────────────────────────────────────────────
    const connectGoogleDrive = useCallback(async () => {
        clearMessages();
        setActionLoading('connect');
        try {
            const res = await backupService.getOAuthConnectUrl();
            const url = res.data?.authorizationUrl;
            if (url) {
                window.open(url, '_blank', 'width=600,height=700,scrollbars=yes');
                setSuccessMsg('A Google authorization window has opened. Complete the sign-in and return here.');
            }
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to get authorization URL');
        } finally { setActionLoading(''); }
    }, []);

    // ── Disconnect Google Drive ──────────────────────────────────────────────
    const disconnectGoogleDrive = useCallback(async () => {
        clearMessages();
        setActionLoading('disconnect');
        try {
            await backupService.disconnectOAuth();
            setOauthStatus({ connected: false });
            setSuccessMsg('Google Drive disconnected successfully');
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to disconnect');
        } finally { setActionLoading(''); }
    }, []);

    return {
        history, driveFiles, oauthStatus,
        loading, actionLoading, error, successMsg,
        fetchHistory, fetchDriveFiles, fetchOAuthStatus,
        triggerBackup, restoreDatabase,
        connectGoogleDrive, disconnectGoogleDrive,
    };
};

export default useBackup;
