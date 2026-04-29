import React from "react";
import { TextField, InputAdornment } from "@mui/material"; // <-- Import InputAdornment here

// eslint-disable-next-line react/prop-types
const AppFormField = ({required=false,name,title,error,readOnly,endIcon,startIcon,onEndIconClick,type,inputComponent, helperText,onChange, value, submitLabel = "Save"}) => {

    // 1. Create the endAdornment element using InputAdornment
    const adornment = endIcon ? (
        <InputAdornment position="end" onClick={onEndIconClick}>
            {endIcon}
        </InputAdornment>
    ) : null;
    const adornment2 = startIcon ? (
        <InputAdornment position="end" onClick={onEndIconClick}>
            {startIcon}
        </InputAdornment>
    ) : null;

    return (
        <TextField
            label={title}
            variant="outlined"
            fullWidth
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            helperText={helperText}
            size="small"
            error={error}
            type={type}
            InputLabelProps={{
                shrink: true,
                style: { fontSize: 12 },
            }}
            InputProps={{
                endAdornment: adornment,
                readOnly: readOnly,
            }}
            sx={{
                m: 0.5,

                // Default border
                "& .MuiOutlinedInput-root": {
                    fontSize: 12,
                    height: 36,

                    "& fieldset": {
                        borderColor: "primaryColor", // default border
                    },

                    // Hover
                    "&:hover fieldset": {
                        borderColor: "#primaryColor",
                    },

                    // Focused
                    "&.Mui-focused fieldset": {
                        borderColor: "#primaryColor",
                    },

                    // Error
                    "&.Mui-error fieldset": {
                        borderColor: "#d32f2f",
                    },
                },
            }}
        />


    );
};

export default AppFormField;
