import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { getThemeColors } from './colors';

/**
 * Custom hook to access theme colors
 * Provides easy access to both MUI theme and custom color configurations
 * 
 * @returns {object} Theme utilities and colors
 */
export const useAppTheme = () => {
    const muiTheme = useTheme();
    const mode = muiTheme.palette.mode;
    
    const colors = useMemo(() => getThemeColors(mode), [mode]);
    
    return {
        theme: muiTheme,
        mode,
        colors,
        isDark: mode === 'dark',
        isLight: mode === 'light',
    };
};

export default useAppTheme;
