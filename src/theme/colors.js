/**
 * Dynamic Color Configuration
 * This file centralizes all color definitions and provides theme-aware colors
 */

export const colorPalette = {
    // Primary Colors
    primary: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
        contrast: '#ffffff',
    },
    
    // Secondary Colors
    secondary: {
        main: '#64748b',
        light: '#94a3b8',
        dark: '#475569',
        contrast: '#ffffff',
    },
    
    // Success Colors
    success: {
        main: '#25b865',
        light: '#4ade80',
        dark: '#16a34a',
        contrast: '#ffffff',
    },
    
    // Info Colors
    info: {
        main: '#3dc7be',
        light: '#67e8f9',
        dark: '#0891b2',
        contrast: '#ffffff',
    },
    
    // Warning Colors
    warning: {
        main: '#ffa21d',
        light: '#fbbf24',
        dark: '#f59e0b',
        contrast: '#000000',
    },
    
    // Danger Colors
    danger: {
        main: '#d13b4c',
        light: '#ef4444',
        dark: '#b91c1c',
        contrast: '#ffffff',
    },
    
    // Neutral Colors
    neutral: {
        white: '#ffffff',
        black: '#000000',
        gray100: '#eff0f6',
        gray200: '#e9ecef',
        gray300: '#e5e7eb',
        gray400: '#ced4da',
        gray500: '#91a1b6',
        gray600: '#64748b',
        gray700: '#495057',
        gray800: '#343a40',
        gray900: '#212529',
    },
    
    // Additional Units Colors
    brand: {
        teal: '#41b2c4',
        cyan: '#3dc7be',
        indigo: '#6610f2',
        purple: '#6f42c1',
        pink: '#e83e8c',
        darken: '#001327',
    },
};

/**
 * Theme-specific color configurations
 */
export const themeColors = {
    light: {
        // Background
        background: {
            default: '#f0f2f8',
            paper: '#ffffff',
            contrast: '#0f172a',
        },
        
        // Text
        text: {
            primary: '#4b5563',
            secondary: '#64748b',
            disabled: '#9ca3af',
            hint: '#6b7280',
        },
        
        // Units specific
        brand: {
            body: '#6b7885',
            dark: '#283c50',
            muted: '#7587a7',
            light: '#eaebef',
        },
        
        // Border
        border: {
            main: '#e5e7eb',
            light: '#f3f4f6',
            medium: '#d1d5db',
            dark: '#9ca3af',
        },
        
        // Navigation
        navigation: {
            background: '#0f172a',
            color: '#b1b4c0',
            iconColor: '#b1b4c0',
            activeColor: '#ffffff',
            hoverColor: '#1c2438',
            borderColor: '#1b2436',
        },
        
        // Header
        header: {
            background: '#0f172a',
            color: '#2c3344',
            linkColor: '#6b7280',
            borderColor: '#1b2436',
        },
        
        // Shadows
        shadow: {
            sm: 'rgba(0, 0, 0, 0.05)',
            md: 'rgba(0, 0, 0, 0.1)',
            lg: 'rgba(0, 0, 0, 0.15)',
        },
    },
    
    dark: {
        // Background
        background: {
            default: '#0f172a',
            paper: '#1e293b',
            contrast: '#ffffff',
        },
        
        // Text
        text: {
            primary: '#ffffff',
            secondary: '#b1b4c0',
            disabled: '#6b7280',
            hint: '#9ca3af',
        },
        
        // Units specific
        brand: {
            body: '#b1b4c0',
            dark: '#ffffff',
            muted: '#94a3b8',
            light: '#1e293b',
        },
        
        // Border
        border: {
            main: '#1b2436',
            light: '#1e293b',
            medium: '#334155',
            dark: '#475569',
        },
        
        // Navigation
        navigation: {
            background: '#0f172a',
            color: '#b1b4c0',
            iconColor: '#b1b4c0',
            activeColor: '#ffffff',
            hoverColor: '#1c2438',
            borderColor: '#1b2436',
        },
        
        // Header
        header: {
            background: '#0f172a',
            color: '#ffffff',
            linkColor: '#b1b4c0',
            borderColor: '#1b2436',
        },
        
        // Shadows
        shadow: {
            sm: 'rgba(0, 0, 0, 0.3)',
            md: 'rgba(0, 0, 0, 0.4)',
            lg: 'rgba(0, 0, 0, 0.5)',
        },
    },
};

/**
 * Get theme-aware colors based on current theme mode
 * @param {string} mode - 'light' or 'dark'
 * @returns {object} Combined color palette for the current theme
 */
export const getThemeColors = (mode = 'light') => {
    return {
        ...colorPalette,
        ...themeColors[mode],
    };
};

/**
 * Generate soft/transparent background colors
 * @param {string} color - Base color in hex format
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color string
 */
export const getSoftColor = (color, opacity = 0.075) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Soft background colors for badges, alerts, etc.
 */
export const softColors = {
    primary: getSoftColor(colorPalette.primary.main),
    success: getSoftColor(colorPalette.success.main),
    danger: getSoftColor(colorPalette.danger.main),
    info: getSoftColor(colorPalette.info.main),
    warning: getSoftColor(colorPalette.warning.main),
    teal: getSoftColor(colorPalette.brand.teal),
    cyan: getSoftColor(colorPalette.brand.cyan),
    indigo: getSoftColor(colorPalette.brand.indigo),
    darken: getSoftColor(colorPalette.brand.darken),
};

export default {
    colorPalette,
    themeColors,
    getThemeColors,
    getSoftColor,
    softColors,
};
