import {
    Dialog,
    DialogContent,
    DialogActions,
    Box,
} from "@mui/material";
import AppButton from "../../common/AppButton.jsx";

const ImageViewerModal = ({ open, onClose, imageUrl,fileType }) => {
    if (!imageUrl) return null;
    const isPDF = fileType===".pdf";
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',

                    }}
                >

                    {isPDF ? (
                            <iframe
                                src={imageUrl}
                                title="PDF Preview"
                                width="100%"
                                height="600px"
                                style={{ border: "none" }}
                            />
                        ) :

                    (<img
                        src={imageUrl}
                        alt="Document"
                        style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: 'contain' }}
                    />)}
                </Box>
            </DialogContent>
            <DialogActions>
                <AppButton onClick={onClose}
                           label="Close"
                >
                </AppButton>
            </DialogActions>
        </Dialog>
    );
};

export default ImageViewerModal;
