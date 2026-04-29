import React, { useEffect, useMemo, useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    TextField,
    ListSubheader,
    Checkbox,
    ListItemText,
    Box,
    Chip
} from "@mui/material";

const AppDropDownField = ({
                              title,
                              label,
                              value,
                              onChange,
                              options = [],
                              required = true,
                              error = false,
                              helperText = "",
                              disabled = false,
                              searchable = false,
                              onSearch, // ✅ NEW (API search handler)
                              multiple = false,
                              optionLabel = 'label',
                              optionValue = 'value'
                          }) => {

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (!searchable || !onSearch) return;

        const trimmed = searchText.trim();

        const timer = setTimeout(() => {
            if (trimmed === "") {
                onSearch("");
                return;
            }
            if (trimmed.length < 2) return;

            // 🔍 Normal search
            onSearch(trimmed);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText]);

    const filteredOptions = useMemo(() => {
        if (onSearch) return options; // API handles filtering
        if (!searchable || !searchText) return options;

        return options.filter((opt) =>
            opt[optionLabel]?.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, options, searchable, onSearch, optionLabel]);

    return (
        <FormControl
            fullWidth
            size="small"
            required={required}
            error={error}
            disabled={disabled}
            sx={{ m: 0.5, minWidth: 150 }}
        >
            <InputLabel sx={{ fontSize: 12 }}>
                {label || title}
            </InputLabel>

            <Select
                multiple={multiple}
                value={value ?? (multiple ? [] : "")}
                label={label || title}
                onChange={onChange}
                sx={{ minHeight: 36, fontSize: 12 }}
                renderValue={multiple ? (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((val) => {
                            const option = options.find(o => o[optionValue] === val);
                            return (
                                <Chip key={val} label={option ? option[optionLabel] : val} size="small" sx={{ height: 24 }} />
                            );
                        })}
                    </Box>
                ) : undefined}
                MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                }}
            >

                {/* 🔍 Search Field */}
                {searchable && (
                    <ListSubheader>
                        <TextField
                            size="small"
                            autoFocus
                            placeholder="Search..."
                            fullWidth
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            sx={{ fontSize: 12 }}
                        />
                    </ListSubheader>
                )}

                {filteredOptions.length === 0 ? (
                    <MenuItem disabled>
                        No options found
                    </MenuItem>
                ) : (
                    filteredOptions.map((option, index) => (
                        <MenuItem key={index} value={option[optionValue]}>
                            {multiple && (
                                <Checkbox checked={(value || []).indexOf(option[optionValue]) > -1} size="small" />
                            )}
                            {multiple ? <ListItemText primary={option[optionLabel]} /> : option[optionLabel]}
                        </MenuItem>
                    ))
                )}
            </Select>

            {helperText && (
                <FormHelperText sx={{ fontSize: 11 }}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default AppDropDownField;
