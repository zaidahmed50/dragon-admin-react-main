import { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Chip, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Tooltip, IconButton, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Divider, Card, CardContent,
} from '@mui/material';
import {
    CloudUpload, Restore, History, Storage, CheckCircle,
    Error as ErrorIcon, HourglassEmpty, Google, LinkOff,
    Refresh, Warning
} from '@mui/icons-material';
import { useBackup } from '../../hooks/useBackup.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

// ─── Status chip ──────────────────────────────────────────────────────────────
const StatusChip = ({ status }) => {
    const map = {
        SUCCESS:     { color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
        FAILED:      { color: 'error',   icon: <ErrorIcon   sx={{ fontSize: 14 }} /> },
        IN_PROGRESS: { color: 'warning', icon: <HourglassEmpty sx={{ fontSize: 14 }} /> },
    };
    const cfg = map[status] || { color: 'default', icon: null };
    return (
        <Chip
            size="small"
            color={cfg.color}
            icon={cfg.icon}
            label={status?.replace('_', ' ')}
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
        />
    );
};

// ─── Format bytes ─────────────────────────────────────────────────────────────
const fmtBytes = (b) => {
    if (!b) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / (1024 * 1024)).toFixed(2) + ' MB';
};

// ─── Format date ──────────────────────────────────────────────────────────────
const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-PK', {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
};

// ─── Google Drive connection card ─────────────────────────────────────────────
const DriveConnectionCard = ({ oauthStatus, actionLoading, onConnect, onDisconnect, onRefreshStatus }) => {
    const connected = oauthStatus?.connected;
    return (
        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2,
            borderColor: connected ? 'success.main' : 'warning.main',
            background: connected ? 'rgba(46,125,50,0.04)' : 'rgba(237,108,2,0.04)'
        }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Google sx={{ fontSize: 36, color: connected ? 'success.main' : 'text.secondary' }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            Google Drive {connected ? 'Connected' : 'Not Connected'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {connected
                                ? `Signed in as: ${oauthStatus.email || 'Google Account'}`
                                : 'Connect your Gmail to enable cloud backups'}
                        </Typography>
                        {connected && oauthStatus.isExpired && (
                            <Typography variant="caption" color="warning.main">
                                ⚠ Token expired — reconnect to refresh
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh connection status">
                        <IconButton size="small" onClick={onRefreshStatus}>
                            <Refresh fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {connected ? (
                        <Button
                            variant="outlined" color="error" size="small"
                            startIcon={actionLoading === 'disconnect' ? <CircularProgress size={14}/> : <LinkOff />}
                            disabled={actionLoading === 'disconnect'}
                            onClick={onDisconnect}
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <Button
                            variant="contained" size="small"
                            startIcon={actionLoading === 'connect' ? <CircularProgress size={14}/> : <Google />}
                            disabled={actionLoading === 'connect'}
                            onClick={onConnect}
                            sx={{ background: '#4285F4', '&:hover': { background: '#2b6fd4' } }}
                        >
                            Connect Google Account
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

// ─── Restore confirmation dialog ──────────────────────────────────────────────
const RestoreDialog = ({ open, fileId, onConfirm, onCancel, loading }) => (
    <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <Warning /> Confirm Database Restore
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                <strong>⚠ This will overwrite all current database data!</strong>
                <br/><br/>
                This operation cannot be undone. The entire database will be replaced with the selected backup.
                <br/><br/>
                <strong>File ID:</strong> <code style={{ fontSize: '0.78rem', wordBreak: 'break-all' }}>{fileId}</code>
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onCancel} disabled={loading}>Cancel</Button>
            <Button
                variant="contained" color="error" onClick={onConfirm}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16}/> : <Restore />}
            >
                {loading ? 'Restoring...' : 'Yes, Restore Database'}
            </Button>
        </DialogActions>
    </Dialog>
);

// ─── Main backup page ─────────────────────────────────────────────────────────
const BackupPage = () => {
    const { isSuperAdmin } = useAuth();
    const [activeTab, setActiveTab]           = useState('history');
    const [restoreTarget, setRestoreTarget]   = useState(null);
    const [confirmOpen, setConfirmOpen]       = useState(false);

    const {
        history, driveFiles, oauthStatus,
        loading, actionLoading, error, successMsg,
        fetchHistory, fetchDriveFiles, fetchOAuthStatus,
        triggerBackup, restoreDatabase,
        connectGoogleDrive, disconnectGoogleDrive,
    } = useBackup();

    useEffect(() => {
        fetchOAuthStatus();
        fetchHistory();
    }, []);

    useEffect(() => {
        if (activeTab === 'drive') fetchDriveFiles();
    }, [activeTab]);

    // Block non-super-admins entirely
    if (!isSuperAdmin()) {
        return (
            <Box className="main-content" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
                <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
                <Typography variant="h5" fontWeight={700} color="error.main">Access Denied</Typography>
                <Typography color="text.secondary">Only Super Admins can access the Database Backup module.</Typography>
            </Box>
        );
    }

    const handleRestoreClick = (fileId) => {
        setRestoreTarget(fileId);
        setConfirmOpen(true);
    };

    const handleRestoreConfirm = async () => {
        setConfirmOpen(false);
        await restoreDatabase(restoreTarget);
        setRestoreTarget(null);
    };

    const tabs = [
        { key: 'history', label: 'Backup History', icon: <History fontSize="small" /> },
        { key: 'drive',   label: 'Drive Files',    icon: <Storage fontSize="small" /> },
    ];

    return (
        <Box className="main-content">
            {/* ── Header ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Database Backup</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Automated daily backups at 2:00 AM · Stored on Google Drive
                    </Typography>
                </Box>
                <Button
                    variant="contained" color="primary" size="large"
                    startIcon={actionLoading === 'backup' ? <CircularProgress size={18} color="inherit"/> : <CloudUpload />}
                    disabled={actionLoading === 'backup' || !oauthStatus?.connected}
                    onClick={triggerBackup}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {actionLoading === 'backup' ? 'Running Backup...' : 'Backup Now'}
                </Button>
            </Box>

            {/* ── Alerts ── */}
            {error     && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => {}}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => {}}>{successMsg}</Alert>}
            {!oauthStatus?.connected && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Google Drive is not connected. Connect your account below to enable cloud backups.
                </Alert>
            )}

            {/* ── Google Drive connection ── */}
            <DriveConnectionCard
                oauthStatus={oauthStatus}
                actionLoading={actionLoading}
                onConnect={connectGoogleDrive}
                onDisconnect={disconnectGoogleDrive}
                onRefreshStatus={fetchOAuthStatus}
            />

            {/* ── Tab bar ── */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {tabs.map(t => (
                    <Button
                        key={t.key}
                        variant={activeTab === t.key ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={t.icon}
                        onClick={() => setActiveTab(t.key)}
                        sx={{ borderRadius: 2 }}
                    >
                        {t.label}
                    </Button>
                ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* ── Backup History tab ── */}
            {activeTab === 'history' && (
                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={600}>Backup Records</Typography>
                        <IconButton size="small" onClick={fetchHistory} title="Refresh">
                            <Refresh fontSize="small" />
                        </IconButton>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'grey.50' } }}>
                                    <TableCell>#</TableCell>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Drive Link</TableCell>
                                    <TableCell align="center">Restore</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            <CircularProgress size={28} />
                                        </TableCell>
                                    </TableRow>
                                ) : history.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No backup records found
                                        </TableCell>
                                    </TableRow>
                                ) : history.map((row, idx) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                                {row.fileName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell><StatusChip status={row.status} /></TableCell>
                                        <TableCell>{fmtBytes(row.backupSizeBytes)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={row.isScheduled ? 'Scheduled' : 'Manual'}
                                                color={row.isScheduled ? 'info' : 'default'}
                                                sx={{ fontSize: '0.68rem' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fmtDate(row.createdAt)}</TableCell>
                                        <TableCell>
                                            {row.googleDriveLink ? (
                                                <a href={row.googleDriveLink} target="_blank" rel="noreferrer"
                                                   style={{ fontSize: '0.78rem', color: '#1a73e8' }}>
                                                    Open in Drive
                                                </a>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.googleDriveFileId && row.status === 'SUCCESS' ? (
                                                <Tooltip title="Restore this backup">
                                                    <IconButton
                                                        size="small" color="warning"
                                                        disabled={!!actionLoading}
                                                        onClick={() => handleRestoreClick(row.googleDriveFileId)}
                                                    >
                                                        {actionLoading === 'restore_' + row.googleDriveFileId
                                                            ? <CircularProgress size={16}/>
                                                            : <Restore fontSize="small"/>
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                            ) : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* ── Drive Files tab ── */}
            {activeTab === 'drive' && (
                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={600}>Files on Google Drive</Typography>
                        <IconButton size="small" onClick={fetchDriveFiles} title="Refresh">
                            <Refresh fontSize="small" />
                        </IconButton>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'grey.50' } }}>
                                    <TableCell>#</TableCell>
                                    <TableCell>File Info</TableCell>
                                    <TableCell align="center">Restore</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                            <CircularProgress size={28} />
                                        </TableCell>
                                    </TableRow>
                                ) : driveFiles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No files found on Google Drive
                                        </TableCell>
                                    </TableRow>
                                ) : driveFiles.map((f, idx) => {
                                    // Support both string "ID: xxx | Name: yyy | Size: zzz bytes"
                                    // and object { id, name, size } returned by the API
                                    let fileId, fileName, fileSize;
                                    if (typeof f === 'string') {
                                        fileId   = f.match(/ID:\s*([^\s|]+)/)?.[1];
                                        fileName = f.match(/Name:\s*([^|]+)/)?.[1]?.trim();
                                        fileSize = f.match(/Size:\s*([\d]+)/)?.[1];
                                    } else {
                                        fileId   = f.id   ?? f.fileId   ?? f.googleDriveFileId;
                                        fileName = f.name ?? f.fileName ?? f.title;
                                        fileSize = f.size ?? f.backupSizeBytes ?? f.fileSize;
                                    }

                                    return (
                                        <TableRow key={idx} hover>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>{fileName}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {fileId} · {fmtBytes(Number(fileSize))}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Restore this backup">
                                                    <IconButton
                                                        size="small" color="warning"
                                                        disabled={!!actionLoading}
                                                        onClick={() => handleRestoreClick(fileId)}
                                                    >
                                                        {actionLoading === 'restore_' + fileId
                                                            ? <CircularProgress size={16}/>
                                                            : <Restore fontSize="small"/>
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* ── Restore confirmation dialog ── */}
            <RestoreDialog
                open={confirmOpen}
                fileId={restoreTarget}
                loading={actionLoading?.startsWith('restore_')}
                onConfirm={handleRestoreConfirm}
                onCancel={() => { setConfirmOpen(false); setRestoreTarget(null); }}
            />
        </Box>
    );
};

export default BackupPage;
