import React, { useState, useEffect } from "react";
import {
    TextField,
    Avatar,
    Typography,
    Box,
    CircularProgress,
    FormControl,
    FormHelperText
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const SearchableDropdown = ({
                                label = "Select",
                                value,
                                onChange,
                                fetchOptions, // function to fetch options based on search text
                                optionLabel = (option) => option.name || "", // function to get label
                                renderOptionContent, // function to render custom option
                                required = true,
                                error = false,
                                helperText = "",
                                disabled = false,
                                minWidth = 150,
                            }) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch options whenever inputValue changes
    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchOptions(inputValue);
                if (active) {
                    let newOptions = data || [];
                    // Ensure the current value is in the options list if it's not already there
                    if (value && !newOptions.some(option => option.id === value.id)) {
                        newOptions = [value, ...newOptions];
                    }
                    setOptions(newOptions);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (active) setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchData, 500); // Debounce

        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [inputValue, fetchOptions, value]); // Added value to dependencies

    // Also ensure value is in options when it changes, in case options were already loaded
    useEffect(() => {
        if (value && !options.some(option => option.id === value.id)) {
            setOptions(prevOptions => [value, ...prevOptions]);
        }
    }, [value, options]);


    return (
        <FormControl
            fullWidth
            size="small"
            required={required}
            error={error}
            disabled={disabled}
            sx={{ m: 0.5, minWidth }}
        >
            <Autocomplete
                value={value || null}
                onChange={(event, newValue) => onChange(newValue)}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                options={options}
                getOptionLabel={optionLabel}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.userId === value.userId || option.id === value.id}
                loading={loading}
                noOptionsText={inputValue ? "No results found" : "Type to search"}
                sx={{
                    '& .MuiInputBase-root': {
                        height: 36,
                        fontSize: 12,
                        paddingRight: 0,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: 1,
                    },
                }}
                renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
                        {renderOptionContent ? (
                            renderOptionContent(option)
                        ) : (
                            <>
                                {option.profilePic && <Avatar src={option.profilePic} sx={{ width: 32, height: 32 }} />}
                                <Box>
                                    <Typography variant="body2">{optionLabel(option)}</Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        size="small"
                        error={!!error}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress color="inherit" size={20} />}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
            {helperText && <FormHelperText sx={{ fontSize: 11 }}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default SearchableDropdown;
