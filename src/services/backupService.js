import axiosInstance from './axiosConfig.js';

// ─── Backup Service ───────────────────────────────────────────────────────────

const triggerManualBackup = async () => {
    const response = await axiosInstance.post('/backup/trigger');
    return response.data;
};

const getBackupHistory = async () => {
    const response = await axiosInstance.get('/backup/history');
    return response.data;
};

const listDriveFiles = async () => {
    const response = await axiosInstance.get('/backup/drive-files');
    return response.data;
};

const restoreFromDrive = async (fileId) => {
    const response = await axiosInstance.post(`/backup/restore/${fileId}`);
    return response.data;
};

// ─── OAuth Service ────────────────────────────────────────────────────────────

const getOAuthConnectUrl = async () => {
    const response = await axiosInstance.get('/backup/oauth/connect');
    return response.data;
};

const getOAuthStatus = async () => {
    const response = await axiosInstance.get('/backup/oauth/status');
    return response.data;
};

const disconnectOAuth = async () => {
    const response = await axiosInstance.delete('/backup/oauth/disconnect');
    return response.data;
};

export const backupService = {
    triggerManualBackup,
    getBackupHistory,
    listDriveFiles,
    restoreFromDrive,
    getOAuthConnectUrl,
    getOAuthStatus,
    disconnectOAuth,
};

export default backupService;
