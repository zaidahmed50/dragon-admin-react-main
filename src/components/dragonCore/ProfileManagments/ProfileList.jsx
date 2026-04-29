import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    IconButton
} from '@mui/material';
import { FiMoreVertical } from 'react-icons/fi';

const ProfileList = ({
    loading,
    profiles,
    handleProfileMenuOpen
}) => {
    return (
        <TableContainer
            component={Paper}
            sx={{
                boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)',
                borderRadius: 3,
            }}
        >
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#F0F8FF' }}>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            Data (MB)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            D-Speed
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            U-Speed
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            Unit Price
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            Type
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && profiles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : profiles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No profiles found
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        profiles.map((profile, index) => (
                            <TableRow
                                key={profile.id || index}
                                sx={{
                                    '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.05)' },
                                    borderBottom: '0.98px solid #E4E4E4',
                                }}
                            >
                                <TableCell sx={{ fontSize: 14 }}>
                                    {profile.name || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {profile.dataInMb || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {profile.dSpeed || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {profile.uSpeed || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {profile.unitPrice || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {profile.types || 'N/A'}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleProfileMenuOpen(e, profile)}
                                    >
                                        <FiMoreVertical size={18} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProfileList;
