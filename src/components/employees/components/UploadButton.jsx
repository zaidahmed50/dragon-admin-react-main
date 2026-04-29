import React from 'react';
import { Button } from '@mui/material';

const UploadButton = ({ id, accept, onChange, label }) => {
  return (
    <Button variant="contained" component="label">
      {label}
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        hidden
      />
    </Button>
  );
};

export default UploadButton;