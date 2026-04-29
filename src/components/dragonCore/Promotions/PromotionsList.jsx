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

const PromotionsList = ({
    loading,
    promotions,
    handlePromotionMenuOpen
}) => {
    const truncateText = (text, maxLength = 60) => {
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
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171', width: '20%' }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171', width: '40%' }}>
                            Details
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171', width: '15%' }}>
                            Total Months
                        </TableCell>
                        <TableCell sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171', width: '15%' }}>
                            Free Months
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 400, fontSize: 13.75, color: '#717171', width: '10%' }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && promotions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : promotions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No promotions found
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        promotions.map((promotion, index) => (
                            <TableRow
                                key={promotion.id || index}
                                sx={{
                                    '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.05)' },
                                    borderBottom: '0.98px solid #E4E4E4',
                                }}
                            >
                                <TableCell sx={{ fontSize: 14 }}>
                                    {promotion.promotionName || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {truncateText(promotion.promotionDescription)}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {promotion.totalMonths ? `${promotion.totalMonths} Months` : 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 14 }}>
                                    {promotion.monthToWave ? `${promotion.monthToWave} Months` : 'N/A'}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handlePromotionMenuOpen(e, promotion)}
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

export default PromotionsList;
