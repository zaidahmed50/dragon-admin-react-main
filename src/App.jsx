import  { useEffect, useMemo, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './route/router';
import 'react-quill/dist/quill.snow.css';
import 'react-circular-progressbar/dist/styles.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime/css/react-datetime.css';
import NavigationProvider from './contentApi/navigationProvider';
import SideBarToggleProvider from './contentApi/sideBarToggleProvider';
import ThemeCustomizer from './components/shared/ThemeCustomizer';
import { AuthProvider }             from './contexts/AuthContext';
import { ChatNotificationProvider } from './contexts/ChatNotificationContext';
import { ChatPopupProvider }        from './contexts/ChatPopupContext';
import ChatPopupManager             from './components/tickets/ChatPopupManager';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme } from './theme/muiTheme';

const App = () => {
    const [skinTheme, setSkinTheme] = useState(() => {
        const hasDarkClass = document?.documentElement?.classList?.contains('app-skin-dark');
        if (hasDarkClass) return 'dark';
        return localStorage.getItem('skinTheme') || 'light';
    });

    const [fontFamily, setFontFamily] = useState(() => {
        return localStorage.getItem('fontFamily') || 'app-font-family-inter';
    });

    const [colors, setColors] = useState(() => {
        const storedColors = {};
        const colorKeys = [
            'primary', 'secondary', 'success', 'warning', 'info', 'danger', 'dark', 'darken',
            'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'cyan',
            'gray-100', 'gray-200', 'gray-300', 'gray-400', 'gray-500'
        ];
        colorKeys.forEach(key => {
            const storedColor = localStorage.getItem(`${key}Color`);
            if (storedColor) {
                storedColors[key] = storedColor;
            }
        });
        return storedColors;
    });

    useEffect(() => {
        const handler = (event) => {
            const { detail } = event;
            if (detail?.skinTheme) {
                setSkinTheme(detail.skinTheme);
            }
            if (detail?.fontFamily) {
                setFontFamily(detail.fontFamily);
            }
            // A single event for any color change
            if (detail?.colors) {
                setColors(prevColors => ({ ...prevColors, ...detail.colors }));
            }
        };

        window.addEventListener('app-theme-change', handler);

        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('app-skin-dark');
            setSkinTheme(isDark ? 'dark' : 'light');

            const classList = document.documentElement.classList;
            let currentFont = 'app-font-family-inter';
            classList.forEach(cls => {
                if (cls.startsWith('app-font-family-')) {
                    currentFont = cls;
                }
            });
            setFontFamily(currentFont);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            window.removeEventListener('app-theme-change', handler);
            observer.disconnect();
        };
    }, []);

    const theme = useMemo(() => {
        const fontMap = {
            "app-font-family-lato": "'Lato', sans-serif",
            "app-font-family-rubik": "'Rubik', sans-serif",
            "app-font-family-inter": "'Inter', sans-serif",
            "app-font-family-cinzel": "'Cinzel', sans-serif",
            "app-font-family-nunito": "'Nunito', sans-serif",
            "app-font-family-roboto": "'Roboto', sans-serif",
            "app-font-family-ubuntu": "'Ubuntu', sans-serif",
            "app-font-family-poppins": "'Poppins', sans-serif",
            "app-font-family-raleway": "'Raleway', sans-serif",
            "app-font-family-system-ui": "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            "app-font-family-noto-sans": "'Noto Sans', sans-serif",
            "app-font-family-fira-sans": "'Fira Sans', sans-serif",
            "app-font-family-work-sans": "'Work Sans', sans-serif",
            "app-font-family-open-sans": "'Open Sans', sans-serif",
            "app-font-family-maven-pro": "'Maven Pro', sans-serif",
            "app-font-family-quicksand": "'Quicksand', sans-serif",
            "app-font-family-montserrat": "'Montserrat', sans-serif",
            "app-font-family-josefin-sans": "'Josefin Sans', sans-serif",
            "app-font-family-ibm-plex-sans": "'IBM Plex Sans', sans-serif",
            "app-font-family-source-sans-pro": "'Source Sans Pro', sans-serif",
            "app-font-family-montserrat-alt": "'Montserrat Alternates', sans-serif",
            "app-font-family-roboto-slab": "'Roboto Slab', serif",
        };
        const selectedFont = fontMap[fontFamily] || "'Inter', sans-serif";
        return createAppTheme(skinTheme, selectedFont, colors);
    }, [skinTheme, fontFamily, colors]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                {/* ChatNotificationProvider lives inside AuthProvider so it can
                    read the current user, but outside the router so notifications
                    appear regardless of which route is active. */}
                <ChatNotificationProvider>
                    <ChatPopupProvider>
                        <NavigationProvider>
                            <SideBarToggleProvider>
                                <RouterProvider router={router} />
                            </SideBarToggleProvider>
                        </NavigationProvider>
                        <ThemeCustomizer />
                        {/* Floating chat popups — rendered over everything, Facebook-style */}
                        <ChatPopupManager />
                    </ChatPopupProvider>
                </ChatNotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
