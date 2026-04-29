import { Box, Typography } from "@mui/material";
import UploadRow from "@/components/employees/EmployeeUploadSection/UploadRow.jsx";

const DOCUMENTS = [
    { key: "profilePicture", label: "Profile Picture"},
    { key: "cnicFront", label: "CNIC Front"},
    { key: "cnicBack", label: "CNIC Back"},
    { key: "educationProof", label: "Educational Documents"},
    { key: "experienceLetter", label: "Experience Letter"}
];

export default function EmployeeUploadSection({ files, progress, errors, uploadFile, removeFile }) {
    return (
        <Box border="1px solid #ddd" borderRadius={2}>
            <Box p={2}>
                <Typography variant="h6">Upload Documents</Typography>
                <Typography variant="caption">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                </Typography>
            </Box>

            {DOCUMENTS.map(doc => (
                <UploadRow
                    key={doc.key}
                    label={doc.label}
                    file={files[doc.key]}
                    progress={progress[doc.key]}
                    error={errors[doc.key]}
                    accept={doc.accept}
                    onUpload={(file) => uploadFile(doc.key, file)}
                    onRemove={() => removeFile(doc.key)}
                />
            ))}
        </Box>
    );
}