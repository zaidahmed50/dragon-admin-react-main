/**
 * Theme Module Export
 * Central export point for all theme-related utilities
 */

export { colorPalette, themeColors, getThemeColors, getSoftColor, softColors } from './colors';
export { createAppTheme } from './muiTheme';
export { useAppTheme } from './useAppTheme';
export { applyCSSVariables, initializeCSSVariables } from './cssVariables';

// Default export
export { default as colors } from './colors';
export { default as createTheme } from './muiTheme';
export { default as useTheme } from './useAppTheme';
