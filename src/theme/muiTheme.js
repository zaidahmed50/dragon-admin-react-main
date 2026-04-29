import { createTheme } from '@mui/material/styles';
import { getThemeColors } from './colors';
import tinycolor from 'tinycolor2';

/**
 * Creates a Material-UI theme based on dynamic color settings
 * @param {string} skinTheme - 'light' or 'dark'
 * @param {string} fontFamily - Font family string
 * @param {object} colors - Object containing dynamic color values
 * @returns {object} Material-UI theme object
 */
export const createAppTheme = (skinTheme = 'light', fontFamily = "'Inter', sans-serif", colors = {}) => {
    const mode = skinTheme === 'dark' ? 'dark' : 'light';
    const themeColors = getThemeColors(mode);

    // Default colors from your customizer
    const defaultColors = {
        primary: '#ff9800',
        secondary: '#727981',
        success: '#25b865',
        warning: '#e49e3d',
        info: '#02a0e4',
        danger: '#d13b4c',
        dark: '#283c50',
        darken: '#001327',
        indigo: '#6610f2',
        purple: '#6f42c1',
        pink: '#e83e8c',
        red: '#ea4d4d',
        orange: '#fd7e14',
        yellow: '#ffa21d',
        green: '#17c666',
        teal: '#41b2c4',
        cyan: '#3dc7be',
        'gray-100': '#eff0f6',
        'gray-200': '#e9ecef',
        'gray-300': '#e5e7eb',
        'gray-400': '#ced4da',
        'gray-500': '#91a1b6',
    };

    const finalColors = { ...defaultColors, ...colors };

    const adjustColor = (color, amount) => {
        return tinycolor(color).lighten(amount).toString();
    };

    return createTheme({
        palette: {
            mode,
            primary: {
                main: finalColors.primary,
                light: adjustColor(finalColors.primary, 20),
                dark: adjustColor(finalColors.primary, -20),
                contrastText: '#ffffff',
            },
            secondary: {
                main: finalColors.secondary,
                light: adjustColor(finalColors.secondary, 20),
                dark: adjustColor(finalColors.secondary, -20),
                contrastText: '#ffffff',
            },
            success: {
                main: finalColors.success,
                light: adjustColor(finalColors.success, 20),
                dark: adjustColor(finalColors.success, -20),
                contrastText: '#ffffff',
            },
            info: {
                main: finalColors.info,
                light: adjustColor(finalColors.info, 20),
                dark: adjustColor(finalColors.info, -20),
                contrastText: '#ffffff',
            },
            warning: {
                main: finalColors.warning,
                light: adjustColor(finalColors.warning, 20),
                dark: adjustColor(finalColors.warning, -20),
                contrastText: '#ffffff',
            },
            error: {
                main: finalColors.danger,
                light: adjustColor(finalColors.danger, 20),
                dark: adjustColor(finalColors.danger, -20),
                contrastText: '#ffffff',
            },
            background: {
                default: themeColors.background.default,
                paper: themeColors.background.paper,
            },
            text: {
                primary: themeColors.text.primary,
                secondary: themeColors.text.secondary,
                disabled: themeColors.text.disabled,
            },
            divider: themeColors.border.main,
            brand: {
                teal: finalColors.teal,
                cyan: finalColors.cyan,
                indigo: finalColors.indigo,
                purple: finalColors.purple,
                pink: finalColors.pink,
                darken: finalColors.darken,
            },
        },
        typography: {
            fontFamily,
            h1: { fontSize: '36px', fontWeight: 700 },
            h2: { fontSize: '28px', fontWeight: 600 },
            h3: { fontSize: '24px', fontWeight: 600 },
            h4: { fontSize: '20px', fontWeight: 500 },
            h5: { fontSize: '16px', fontWeight: 500 },
            h6: { fontSize: '15px', fontWeight: 500 },
            body1: { fontSize: '0.84rem' },
            body2: { fontSize: '0.84rem' },
        },
        shape: {
            borderRadius: 4,
        },
        shadows: [
            'none',
            `0 1px 5px ${themeColors.shadow.sm}`,
            `0 5px 15px ${themeColors.shadow.md}`,
            `0 10px 25px ${themeColors.shadow.lg}`,
            `0 15px 35px ${themeColors.shadow.lg}`,
            `0 20px 45px ${themeColors.shadow.lg}`,
            ...Array(19).fill('none'),
        ],
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        fontFamily,
                        backgroundColor: themeColors.background.default,
                        color: themeColors.text.primary,
                        fontSize: '0.84rem',
                    },
                    '*': { boxSizing: 'border-box' },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeColors.background.paper,
                        color: themeColors.text.primary,
                        backgroundImage: 'none',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeColors.background.paper,
                        color: themeColors.text.primary,
                        borderRadius: '4px',
                        boxShadow: mode === 'dark'
                            ? `0 0 20px rgba(0, 0, 0, 0.5)`
                            : `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`,
                    },
                },
            },
            MuiCardHeader: { styleOverrides: { root: { padding: '25px' } } },
            MuiCardContent: { styleOverrides: { root: { padding: '25px' } } },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: '4px',
                        fontWeight: 500,
                        padding: '0.5rem 1rem',
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputBase-root': { fontSize: '0.845rem' },
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        color: themeColors.text.primary,
                        fontSize: '0.845rem',
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: themeColors.border.main,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: themeColors.border.medium,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: finalColors.primary,
                        },
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: themeColors.background.paper,
                        backgroundImage: 'none',
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        padding: '25px',
                        fontSize: '20px',
                        fontWeight: 500,
                    },
                },
            },
            MuiDialogContent: { styleOverrides: { root: { padding: '25px' } } },
            MuiDialogActions: { styleOverrides: { root: { padding: '25px' } } },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        backgroundColor: themeColors.background.paper,
                        border: `1px solid ${themeColors.border.main}`,
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        color: themeColors.text.primary,
                        '&:hover': {
                            backgroundColor: mode === 'dark'
                                ? themeColors.navigation.hoverColor
                                : themeColors.background.default,
                        },
                        '&.Mui-selected': {
                            backgroundColor: mode === 'dark'
                                ? themeColors.navigation.hoverColor
                                : themeColors.background.default,
                            '&:hover': {
                                backgroundColor: mode === 'dark'
                                    ? themeColors.navigation.hoverColor
                                    : themeColors.border.light,
                            },
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: `1px solid ${themeColors.border.main}`,
                        color: themeColors.text.primary,
                    },
                    head: {
                        fontWeight: 600,
                        backgroundColor: mode === 'dark'
                            ? themeColors.background.paper
                            : themeColors.background.default,
                    },
                },
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: mode === 'dark'
                                ? themeColors.navigation.hoverColor
                                : themeColors.background.default,
                        },
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        minHeight: 48,
                        fontWeight: 500,
                        color: themeColors.text.secondary,
                        '&.Mui-selected': { color: finalColors.primary },
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    indicator: { backgroundColor: finalColors.primary },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontWeight: 500 },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: mode === 'dark' ? themeColors.background.paper : finalColors['gray-700'],
                        fontSize: '0.75rem',
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    track: { backgroundColor: themeColors.border.medium },
                },
            },
            MuiBreadcrumbs: {
                styleOverrides: {
                    separator: { color: themeColors.text.secondary },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: { borderRadius: '4px' },
                },
            },
        },
    });
};

export default createAppTheme;
