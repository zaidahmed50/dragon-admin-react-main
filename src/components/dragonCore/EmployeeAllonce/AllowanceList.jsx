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

const AllowanceList = ({
    loading,
    allowances,
    handleAllowanceMenuOpen
}) => {
    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

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
                            Amount
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            Details
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171' }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && allowances.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : allowances.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No allowances found
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        allowances.map((allowance, index) => (
                            <TableRow
                                key={allowance.id || index}
                                sx={{
                                    '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.05)' },
                                    borderBottom: '0.98px solid #E4E4E4',
                                }}
                            >
                                <TableCell sx={{ fontSize: 14 }}>
                                    {allowance.name || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {allowance.allowanceAmount || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {truncateText(allowance.details)}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleAllowanceMenuOpen(e, allowance)}
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

export default AllowanceList;
