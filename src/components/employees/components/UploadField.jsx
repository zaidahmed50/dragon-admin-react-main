import React from 'react';
import { Box, Typography } from '@mui/material';
import UploadButton from './UploadButton';
import FilePreview from './FilePreview';

const UploadField = ({
  title,
  file,
  existingFile,
  onFileChange,
  onRemove,
  accept,
  id,
  show,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography component="span" sx={{ color: 'red', fontSize: 14 }}>
          *
        </Typography>
      </Box>
      {!(file || existingFile) ? (
        <UploadButton
          id={id}
          accept={accept}
          onChange={onFileChange}
          label={`Choose ${title}`}
        />
      ) : (
        <FilePreview
          file={file}
          existingFile={existingFile}
          onRemove={onRemove}
        />
      )}
    </Box>
  );
};

export default UploadField;