import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Box,
    Grid,
    Divider,
    Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
    Business,
    ContactMail,
    LocationOn,
    AccountBalance,
    Phone,
    Email,
    Language,
    Home,
    LocationCity,
    Public,
} from '@mui/icons-material';

const DetailItem = ({ icon, label, value }) => (
    <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        {icon}
        <Box ml={1.5}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body2" fontWeight={500}>{value || 'N/A'}</Typography>
        </Box>
    </Grid>
);

const SectionTitle = ({ icon, title }) => (
    <Box display="flex" alignItems="center" my={2}>
        {icon}
        <Typography variant="h6" fontWeight={600} ml={1}>{title}</Typography>
    </Box>
);

const VendorDetail = ({ open, onClose, vendor }) => {
    if (!vendor) return null;

    const {
        name,
        vendorCode,
        taxNumber,
        paymentTerms,
        bankName,
        bankAccountNumber,
        iban,
        contactInformation,
        location,
    } = vendor;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={600}>{name}</Typography>
                <Chip label={`Code: ${vendorCode}`} color="primary" size="small" />
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                {/* Vendor Information */}
                <SectionTitle icon={<Business color="primary" />} title="Vendor Information" />
                <Grid container>
                    <DetailItem label="Tax Number" value={taxNumber} />
                    <DetailItem label="Payment Terms" value={paymentTerms} />
                </Grid>

                {/* Financial Details */}
                <SectionTitle icon={<AccountBalance color="primary" />} title="Financial Details" />
                <Grid container>
                    <DetailItem label="Bank Name" value={bankName} />
                    <DetailItem label="Account Number" value={bankAccountNumber} />
                    <DetailItem label="IBAN" value={iban} />
                </Grid>

                {/* Contact Information */}
                <SectionTitle icon={<ContactMail color="primary" />} title="Contact" />
                <Grid container>
                    <DetailItem icon={<Phone fontSize="small" />} label="Phone" value={contactInformation?.phone} />
                    <DetailItem icon={<Email fontSize="small" />} label="Email" value={contactInformation?.email} />
                    <DetailItem icon={<Language fontSize="small" />} label="Website" value={contactInformation?.website} />
                </Grid>

                {/* Location */}
                <SectionTitle icon={<LocationOn color="primary" />} title="Location" />
                <Grid container>
                    <DetailItem icon={<Home fontSize="small" />} label="Address" value={location?.addressLine} />
                    <DetailItem icon={<LocationCity fontSize="small" />} label="City" value={location?.city} />
                    <DetailItem icon={<Public fontSize="small" />} label="Country" value={location?.country} />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                    Created At: {new Date(vendor.createdAt).toLocaleString()}
                </Typography>
            </DialogActions>
        </Dialog>
    );
};

export default VendorDetail;
