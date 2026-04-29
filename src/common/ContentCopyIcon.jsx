import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

const CopyToClipboardButton = ({ text, size = 16 }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy text", err);
        }
    };

    return (
        <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton size="small" onClick={handleCopy} color="primary">
                <ContentCopyIcon sx={{ fontSize: size }} />
            </IconButton>
        </Tooltip>
    );
};

export default CopyToClipboardButton;
