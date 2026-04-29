import {
    Box,
    Typography,
    LinearProgress,
    IconButton
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ApiUrls } from "../../../services/index.js";
import { useState } from "react";
import ImageViewerModal from "@/components/shared/ImageViewerModal.jsx";

export default function UploadRow({
                                      label,
                                      file,
                                      progress,
                                      error,
                                      accept,
                                      onUpload,
                                      onRemove
                                  }) {
    const isExistingFile = typeof file === "string";
    const isNewFile = file instanceof File;

    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);

    const handleView = () => {
        let url = null;

        // Existing backend file
        if (isExistingFile) {
            url = `${ApiUrls.imageUrl}${file}`;
        }

        // New local file
        if (isNewFile) {
            url = URL.createObjectURL(file);
        }

        if (!url) return;

        setCurrentImageUrl(url);
        setViewerOpen(true);


    };

    const handleCloseViewer = () => {
        // Clean up object URL
        if (currentImageUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(currentImageUrl);
        }
        setViewerOpen(false);
        setCurrentImageUrl(null);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderTop="1px solid #eee"
            p={1}
        >
            <Box width="25%">
                <Typography fontWeight={400}>{label}</Typography>
            </Box>

            <Box width="50%">
                {file && (
                    <Typography variant="body2">
                        {isNewFile ? file.name : "Uploaded Document"}
                    </Typography>
                )}

                {error ? (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                ) : (
                    <LinearProgress
                        value={progress || 0}
                        variant="determinate"
                        sx={{ height: 5, borderRadius: 5, mt: 0 }}
                    />
                )}
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
                <Typography>{progress || 0}%</Typography>

                {error && <ErrorOutlineIcon color="error" />}

                {file && !error && (
                    <IconButton onClick={handleView}>
                        <VisibilityIcon color="success" />
                    </IconButton>
                )}

                <IconButton component="label">
                    <UploadIcon color="primary" />
                    <input
                        hidden
                        type="file"
                        accept={accept}
                        onChange={(e) => onUpload(e.target.files?.[0])}
                    />
                </IconButton>

                {file && (
                    <IconButton onClick={onRemove}>
                        <DeleteIcon color="error" />
                    </IconButton>
                )}
            </Box>

            {/* Image Viewer */}
            <ImageViewerModal
                open={viewerOpen}
                onClose={handleCloseViewer}
                imageUrl={currentImageUrl}
            />
        </Box>
    );
}
