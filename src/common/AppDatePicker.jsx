import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

// Check if dark theme is active
const isDarkTheme = () => {
    return document.documentElement.classList.contains('app-skin-dark');
};

// Get theme-aware styles
const getThemeStyles = () => {
    const isDark = isDarkTheme();
    
    return {
        input: {
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#dcdee4",
            hoverBorderColor: isDark ? "#475569" : "#b0b3ba",
            focusBorderColor: isDark ? "#3b82f6" : "#1976d2",
        },
        text: {
            primary: isDark ? "#e2e8f0" : "#2c3344",
            secondary: isDark ? "#94a3b8" : "#6b7885",
        },
    };
};

// eslint-disable-next-line react/prop-types
const AppDatePicker = ({ 
    title, 
    value, 
    onChange, 
    error, 
    helperText,
    minDate,
    maxDate,
    disabled = false,
    format = "DD/MM/YYYY",
    required=false
}) => {
    const [themeKey, setThemeKey] = React.useState(0);

    // Listen for theme changes
    React.useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setThemeKey(prev => prev + 1);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const styles = getThemeStyles();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={title}
                value={value}
                onChange={onChange}
                format={format}
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                required={required}
                slotProps={{
                    textField: {
                        size: "small",
                        fullWidth: true,
                        required: true,
                        error: error,
                        helperText: helperText,
                        InputLabelProps: {
                            style: { fontSize: 12 },
                        },
                        InputProps: {
                            style: {
                                height: 36,
                                fontSize: 12,
                            },
                        },
                        sx: {
                            m: 0.5,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: styles.input.backgroundColor,
                                color: styles.text.primary,
                                '& fieldset': {
                                    borderColor: styles.input.borderColor,
                                },
                                '&:hover fieldset': {
                                    borderColor: styles.input.hoverBorderColor,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: styles.input.focusBorderColor,
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: styles.text.secondary,
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: styles.input.focusBorderColor,
                            },
                        }
                    },
                    popper: {
                        sx: {
                            '& .MuiPaper-root': {
                                backgroundColor: isDarkTheme() ? "#1e293b" : "#ffffff",
                                color: isDarkTheme() ? "#e2e8f0" : "#2c3344",
                                border: `1px solid ${isDarkTheme() ? "#334155" : "#e0e0e0"}`,
                            },
                            '& .MuiPickersDay-root': {
                                color: isDarkTheme() ? "#cbd5e1" : "#333",
                                '&:hover': {
                                    backgroundColor: isDarkTheme() ? "#1c2438" : "#f5f5f5",
                                },
                                '&.Mui-selected': {
                                    backgroundColor: isDarkTheme() ? "#3b82f6" : "#1976d2",
                                    '&:hover': {
                                        backgroundColor: isDarkTheme() ? "#2563eb" : "#1565c0",
                                    },
                                },
                            },
                            '& .MuiPickersCalendarHeader-root': {
                                color: isDarkTheme() ? "#e2e8f0" : "#2c3344",
                            },
                            '& .MuiPickersCalendarHeader-switchViewButton': {
                                color: isDarkTheme() ? "#94a3b8" : "#6b7885",
                            },
                            '& .MuiPickersArrowSwitcher-button': {
                                color: isDarkTheme() ? "#94a3b8" : "#6b7885",
                            },
                            '& .MuiDayCalendar-weekDayLabel': {
                                color: isDarkTheme() ? "#94a3b8" : "#6b7885",
                            },
                        }
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default AppDatePicker;
