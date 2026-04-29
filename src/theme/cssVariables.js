/**
 * Dynamic CSS Variables Generator
 * This file generates CSS custom properties (CSS variables) based on the current theme
 */

import { colorPalette, getThemeColors } from './colors';

/**
 * Apply CSS variables to document root
 * @param {string} mode - 'light' or 'dark'
 */
export const applyCSSVariables = (mode = 'light') => {
    const themeColors = getThemeColors(mode);
    const root = document.documentElement;
    
    // Primary colors
    root.style.setProperty('--color-primary', colorPalette.primary.main);
    root.style.setProperty('--color-primary-light', colorPalette.primary.light);
    root.style.setProperty('--color-primary-dark', colorPalette.primary.dark);
    root.style.setProperty('--color-primary-contrast', colorPalette.primary.contrast);
    
    // Secondary colors
    root.style.setProperty('--color-secondary', colorPalette.secondary.main);
    root.style.setProperty('--color-secondary-light', colorPalette.secondary.light);
    root.style.setProperty('--color-secondary-dark', colorPalette.secondary.dark);
    
    // Success colors
    root.style.setProperty('--color-success', colorPalette.success.main);
    root.style.setProperty('--color-success-light', colorPalette.success.light);
    root.style.setProperty('--color-success-dark', colorPalette.success.dark);
    
    // Info colors
    root.style.setProperty('--color-info', colorPalette.info.main);
    root.style.setProperty('--color-info-light', colorPalette.info.light);
    root.style.setProperty('--color-info-dark', colorPalette.info.dark);
    
    // Warning colors
    root.style.setProperty('--color-warning', colorPalette.warning.main);
    root.style.setProperty('--color-warning-light', colorPalette.warning.light);
    root.style.setProperty('--color-warning-dark', colorPalette.warning.dark);
    
    // Danger colors
    root.style.setProperty('--color-danger', colorPalette.danger.main);
    root.style.setProperty('--color-danger-light', colorPalette.danger.light);
    root.style.setProperty('--color-danger-dark', colorPalette.danger.dark);
    
    // Units colors
    root.style.setProperty('--color-teal', colorPalette.brand.teal);
    root.style.setProperty('--color-cyan', colorPalette.brand.cyan);
    root.style.setProperty('--color-indigo', colorPalette.brand.indigo);
    root.style.setProperty('--color-purple', colorPalette.brand.purple);
    root.style.setProperty('--color-pink', colorPalette.brand.pink);
    root.style.setProperty('--color-darken', colorPalette.brand.darken);
    
    // Neutral colors
    root.style.setProperty('--color-white', colorPalette.neutral.white);
    root.style.setProperty('--color-black', colorPalette.neutral.black);
    root.style.setProperty('--color-gray-100', colorPalette.neutral.gray100);
    root.style.setProperty('--color-gray-200', colorPalette.neutral.gray200);
    root.style.setProperty('--color-gray-300', colorPalette.neutral.gray300);
    root.style.setProperty('--color-gray-400', colorPalette.neutral.gray400);
    root.style.setProperty('--color-gray-500', colorPalette.neutral.gray500);
    root.style.setProperty('--color-gray-600', colorPalette.neutral.gray600);
    root.style.setProperty('--color-gray-700', colorPalette.neutral.gray700);
    root.style.setProperty('--color-gray-800', colorPalette.neutral.gray800);
    root.style.setProperty('--color-gray-900', colorPalette.neutral.gray900);
    
    // Theme-specific background colors
    root.style.setProperty('--bg-default', themeColors.background.default);
    root.style.setProperty('--bg-paper', themeColors.background.paper);
    root.style.setProperty('--bg-contrast', themeColors.background.contrast);
    
    // Theme-specific text colors
    root.style.setProperty('--text-primary', themeColors.text.primary);
    root.style.setProperty('--text-secondary', themeColors.text.secondary);
    root.style.setProperty('--text-disabled', themeColors.text.disabled);
    root.style.setProperty('--text-hint', themeColors.text.hint);
    
    // Theme-specific brand colors
    root.style.setProperty('--brand-body', themeColors.brand.body);
    root.style.setProperty('--brand-dark', themeColors.brand.dark);
    root.style.setProperty('--brand-muted', themeColors.brand.muted);
    root.style.setProperty('--brand-light', themeColors.brand.light);
    
    // Border colors
    root.style.setProperty('--border-main', themeColors.border.main);
    root.style.setProperty('--border-light', themeColors.border.light);
    root.style.setProperty('--border-medium', themeColors.border.medium);
    root.style.setProperty('--border-dark', themeColors.border.dark);
    
    // Navigation colors
    root.style.setProperty('--nav-bg', themeColors.navigation.background);
    root.style.setProperty('--nav-color', themeColors.navigation.color);
    root.style.setProperty('--nav-icon-color', themeColors.navigation.iconColor);
    root.style.setProperty('--nav-active-color', themeColors.navigation.activeColor);
    root.style.setProperty('--nav-hover-color', themeColors.navigation.hoverColor);
    root.style.setProperty('--nav-border-color', themeColors.navigation.borderColor);
    
    // Header colors
    root.style.setProperty('--header-bg', themeColors.header.background);
    root.style.setProperty('--header-color', themeColors.header.color);
    root.style.setProperty('--header-link-color', themeColors.header.linkColor);
    root.style.setProperty('--header-border-color', themeColors.header.borderColor);
    
    // Shadow colors
    root.style.setProperty('--shadow-sm', themeColors.shadow.sm);
    root.style.setProperty('--shadow-md', themeColors.shadow.md);
    root.style.setProperty('--shadow-lg', themeColors.shadow.lg);
    
    // Soft/transparent colors
    root.style.setProperty('--bg-soft-primary', `rgba(255, 152, 0, 0.075)`);
    root.style.setProperty('--bg-soft-success', `rgba(37, 184, 101, 0.075)`);
    root.style.setProperty('--bg-soft-danger', `rgba(209, 59, 76, 0.075)`);
    root.style.setProperty('--bg-soft-info', `rgba(61, 199, 190, 0.075)`);
    root.style.setProperty('--bg-soft-warning', `rgba(255, 162, 29, 0.075)`);
    root.style.setProperty('--bg-soft-teal', `rgba(65, 178, 196, 0.075)`);
    root.style.setProperty('--bg-soft-cyan', `rgba(61, 199, 190, 0.075)`);
    root.style.setProperty('--bg-soft-indigo', `rgba(102, 16, 242, 0.075)`);
    root.style.setProperty('--bg-soft-darken', `rgba(0, 19, 39, 0.075)`);
};

/**
 * Initialize CSS variables on page load
 */
export const initializeCSSVariables = () => {
    // Check current theme from localStorage or DOM
    const hasDarkClass = document.documentElement.classList.contains('app-skin-dark');
    const storedTheme = localStorage.getItem('skinTheme');
    const initialMode = hasDarkClass ? 'dark' : (storedTheme || 'light');
    
    applyCSSVariables(initialMode);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isDark = document.documentElement.classList.contains('app-skin-dark');
                applyCSSVariables(isDark ? 'dark' : 'light');
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Also listen to custom theme change events
    window.addEventListener('app-theme-change', (event) => {
        const mode = event.detail?.skinTheme || 'light';
        applyCSSVariables(mode);
    });
};

export default {
    applyCSSVariables,
    initializeCSSVariables,
};
