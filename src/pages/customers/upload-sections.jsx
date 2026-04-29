import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import UploadRow from "@/components/employees/EmployeeUploadSection/UploadRow.jsx";
import useCustomerUpload from "./useCustomerUploadSection.js";

const CustomerUploadSection = forwardRef((props, ref) => {
    const { progress, errors, uploadFile, removeFile } = useCustomerUpload();

    const {
        isEditMode = false,
        customerType = 'Individual',
        identityType = ''
    } = props;

    const [files, setFiles] = useState({
        profilePic: null,
        cnicFront: null,
        cnicBack: null,
        passportScan: null,
        ntnScan: null,
    });

    const [existingFiles, setExistingFiles] = useState({
        profilePic: null,
        cnicFront: null,
        cnicBack: null,
        passportScan: null,
        ntnScan: null,
    });

    useEffect(() => {
        if (customerType === 'Individual' && !isEditMode) {
            const currentIdentityType = identityType?.toLowerCase() || '';
            if (currentIdentityType.includes('cnic')) {
                setFiles(prev => ({ ...prev, passportScan: null }));
                setExistingFiles(prev => ({ ...prev, passportScan: null }));
            }
            if (currentIdentityType.includes('passport')) {
                setFiles(prev => ({ ...prev, cnicFront: null, cnicBack: null }));
                setExistingFiles(prev => ({ ...prev, cnicFront: null, cnicBack: null }));
            }
        }
    }, [identityType, customerType, isEditMode]);

    useImperativeHandle(ref, () => ({
        getFiles: () => files,
        resetFiles: () => {
            setFiles({
                profilePic: null,
                cnicFront: null,
                cnicBack: null,
                passportScan: null,
                ntnScan: null,
            });
            setExistingFiles({
                profilePic: null,
                cnicFront: null,
                cnicBack: null,
                passportScan: null,
                ntnScan: null,
            });
        },
        setExistingFiles: (newFiles) => {
            setExistingFiles({
                profilePic: newFiles.profilePic || null,
                cnicFront: newFiles.cnicFront || null,
                cnicBack: newFiles.cnicBack || null,
                passportScan: newFiles.passportScan || null,
                ntnScan: newFiles.ntnScan || null,
            });
        },
        hasRequiredFiles: () => {
            if (isEditMode) return true;

            if (customerType === 'Individual') {
                const currentIdentityType = identityType?.toLowerCase() || '';
                if (currentIdentityType.includes('cnic')) {
                    return !!(files.profilePic && files.cnicFront && files.cnicBack);
                }
                if (currentIdentityType.includes('passport')) {
                    return !!(files.profilePic && files.passportScan);
                }
            } else if (customerType === 'Business') {
                return !!(files.profilePic && files.ntnScan);
            }
            return true;
        }
    }));

    const handleUpload = (key, file) => {
        uploadFile(key, file);
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleRemove = (key) => {
        removeFile(key);
        setFiles(prev => ({ ...prev, [key]: null }));
        setExistingFiles(prev => ({ ...prev, [key]: null }));
    };

    const showCNIC = customerType === 'Individual' && identityType?.toLowerCase().includes('cnic');
    const showPassport = customerType === 'Individual' && identityType?.toLowerCase().includes('passport');
    const showNTN = customerType === 'Business';

    return (
        <Box border="1px solid #ddd" borderRadius={2}>
            <Box p={2}>
                <Typography variant="h6">Upload Documents</Typography>
                <Typography variant="caption">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                </Typography>
            </Box>

            <UploadRow
                label="Profile Picture"
                file={files.profilePic || existingFiles.profilePic}
                progress={progress.profilePic}
                error={errors.profilePic}
                accept="image/jpeg,image/png,image/jpg"
                onUpload={(file) => handleUpload('profilePic', file)}
                onRemove={() => handleRemove('profilePic')}
            />

            {showCNIC && (
                <>
                    <UploadRow
                        label="CNIC Front"
                        file={files.cnicFront || existingFiles.cnicFront}
                        progress={progress.cnicFront}
                        error={errors.cnicFront}
                        accept="image/jpeg,image/png,image/jpg"
                        onUpload={(file) => handleUpload('cnicFront', file)}
                        onRemove={() => handleRemove('cnicFront')}
                    />
                    <UploadRow
                        label="CNIC Back"
                        file={files.cnicBack || existingFiles.cnicBack}
                        progress={progress.cnicBack}
                        error={errors.cnicBack}
                        accept="image/jpeg,image/png,image/jpg"
                        onUpload={(file) => handleUpload('cnicBack', file)}
                        onRemove={() => handleRemove('cnicBack')}
                    />
                </>
            )}

            {showPassport && (
                <UploadRow
                    label="Passport Scan"
                    file={files.passportScan || existingFiles.passportScan}
                    progress={progress.passportScan}
                    error={errors.passportScan}
                    accept="image/jpeg,image/png,image/jpg,.pdf"
                    onUpload={(file) => handleUpload('passportScan', file)}
                    onRemove={() => handleRemove('passportScan')}
                />
            )}

            {showNTN && (
                <UploadRow
                    label="NTN Scan"
                    file={files.ntnScan || existingFiles.ntnScan}
                    progress={progress.ntnScan}
                    error={errors.ntnScan}
                    accept="image/jpeg,image/png,image/jpg,.pdf"
                    onUpload={(file) => handleUpload('ntnScan', file)}
                    onRemove={() => handleRemove('ntnScan')}
                />
            )}
        </Box>
    );
});

CustomerUploadSection.displayName = "CustomerUploadSection";

export default CustomerUploadSection;
