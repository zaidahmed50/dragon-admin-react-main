import PerfectScrollbar from 'react-perfect-scrollbar'
import React, { useEffect, useState } from 'react'
import { FiSettings, FiX } from 'react-icons/fi'
import tinycolor from "tinycolor2"

const fontFalmily = [
    { isChecked: false, value: "app-font-family-lato", label: "Lato" },
    { isChecked: false, value: "app-font-family-rubik", label: "Rubik" },
    { isChecked: true, value: "app-font-family-inter", label: "Inter" },
    { isChecked: false, value: "app-font-family-cinzel", label: "Cinzel" },
    { isChecked: false, value: "app-font-family-nunito", label: "Nunito" },
    { isChecked: false, value: "app-font-family-roboto", label: "Roboto" },
    { isChecked: false, value: "app-font-family-ubuntu", label: "Ubuntu" },
    { isChecked: false, value: "app-font-family-poppins", label: "Poppins" },
    { isChecked: false, value: "app-font-family-raleway", label: "Raleway" },
    { isChecked: false, value: "app-font-family-system-ui", label: "System UI" },
    { isChecked: false, value: "app-font-family-noto-sans", label: "Noto Sans" },
    { isChecked: false, value: "app-font-family-fira-sans", label: "Fira Sans" },
    { isChecked: false, value: "app-font-family-work-sans", label: "Work Sans" },
    { isChecked: false, value: "app-font-family-open-sans", label: "Open Sans" },
    { isChecked: false, value: "app-font-family-maven-pro", label: "Maven Pro" },
    { isChecked: false, value: "app-font-family-quicksand", label: "Quicksand" },
    { isChecked: false, value: "app-font-family-montserrat", label: "Montserrat" },
    { isChecked: false, value: "app-font-family-josefin-sans", label: "Josefin Sans" },
    { isChecked: false, value: "app-font-family-ibm-plex-sans", label: "Ibm Plex Sans" },
    { isChecked: false, value: "app-font-family-source-sans-pro", label: "Source Sans Pro" },
    { isChecked: false, value: "app-font-family-montserrat-alt", label: "Montserrat Alt" },
    { isChecked: false, value: "app-font-family-roboto-slab", label: "Roboto Slab" },
]
const ThemeCustomizer = () => {
    const [open, setOpen] = useState(false)
    const [primaryColor, setPrimaryColor] = useState("#ff9800");
    const [secondaryColor, setSecondaryColor] = useState("#727981");
    const [successColor, setSuccessColor] = useState("#25b865");
    const [warningColor, setWarningColor] = useState("#e49e3d");
    const [infoColor, setInfoColor] = useState("#02a0e4");
    const [dangerColor, setDangerColor] = useState("#d13b4c");
    const [darkColor, setDarkColor] = useState("#283c50");
    const [darkenColor, setDarkenColor] = useState("#001327");
    const [indigoColor, setIndigoColor] = useState("#6610f2");
    const [purpleColor, setPurpleColor] = useState("#6f42c1");
    const [pinkColor, setPinkColor] = useState("#e83e8c");
    const [redColor, setRedColor] = useState("#ea4d4d");
    const [orangeColor, setOrangeColor] = useState("#fd7e14");
    const [yellowColor, setYellowColor] = useState("#ffa21d");
    const [greenColor, setGreenColor] = useState("#17c666");
    const [tealColor, setTealColor] = useState("#41b2c4");
    const [cyanColor, setCyanColor] = useState("#3dc7be");
    const [gray100Color, setGray100Color] = useState("#eff0f6");
    const [gray200Color, setGray200Color] = useState("#e9ecef");
    const [gray300Color, setGray300Color] = useState("#e5e7eb");
    const [gray400Color, setGray400Color] = useState("#ced4da");
    const [gray500Color, setGray500Color] = useState("#91a1b6");


    const handleNavigationTheme = (type) => {
        if (type === "dark") {
            document.documentElement.classList.add("app-navigation-dark");
            localStorage.setItem("navigationTheme", "dark");
            document.getElementById("app-navigation-dark").checked = true;
            document.getElementById("app-navigation-light").checked = false;
        } else {
            document.documentElement.classList.remove("app-navigation-dark");
            localStorage.setItem("navigationTheme", "light");
            document.getElementById("app-navigation-dark").checked = false;
            document.getElementById("app-navigation-light").checked = true;
        }
    };

    const handleHeaderTheme = (type) => {
        if (type === "dark") {
            document.documentElement.classList.add("app-header-dark");
            localStorage.setItem("headerTheme", "dark");
            document.getElementById("app-header-dark").checked = true;
            document.getElementById("app-header-light").checked = false;
        } else {
            document.documentElement.classList.remove("app-header-dark");
            localStorage.setItem("headerTheme", "light");
            document.getElementById("app-header-dark").checked = false;
            document.getElementById("app-header-light").checked = true;
        }
    };

    const handleSkinTheme = (type) => {
        if (type === "dark") {
            document.documentElement.classList.add("app-skin-dark");
            localStorage.setItem("skinTheme", "dark");
            document.getElementById("app-skin-dark").checked = true;
            document.getElementById("app-skin-light").checked = false;
        } else {
            document.documentElement.classList.remove("app-skin-dark");
            localStorage.setItem("skinTheme", "light");
            document.getElementById("app-skin-dark").checked = false;
            document.getElementById("app-skin-light").checked = true;
        }

        // Notify MUI ThemeProvider (and any other listeners)
        window.dispatchEvent(
            new CustomEvent("app-theme-change", {
                detail: {
                    skinTheme: type,
                },
            })
        );
    };

    const handleFontFamily = (font, id) => {
        const existingFontClass = document.documentElement.classList.value.match(/app-font-family-\w+/);
        if (existingFontClass) {
            document.documentElement.classList.remove(existingFontClass[0]);
        }
        document.getElementById(font).checked = true
        document.documentElement.classList.add(font);
        localStorage.setItem("fontFamily", font);

        // Notify MUI ThemeProvider (and any other listeners)
        window.dispatchEvent(
            new CustomEvent("app-theme-change", {
                detail: {
                    fontFamily: font,
                },
            })
        );
    };
    const handleColorChange = (color, type) => {
        const colorFunctions = {
            primary: setPrimaryColor,
            secondary: setSecondaryColor,
            success: setSuccessColor,
            warning: setWarningColor,
            info: setInfoColor,
            danger: setDangerColor,
            dark: setDarkColor,
            darken: setDarkenColor,
            indigo: setIndigoColor,
            purple: setPurpleColor,
            pink: setPinkColor,
            red: setRedColor,
            orange: setOrangeColor,
            yellow: setYellowColor,
            green: setGreenColor,
            teal: setTealColor,
            cyan: setCyanColor,
            "gray-100": setGray100Color,
            "gray-200": setGray200Color,
            "gray-300": setGray300Color,
            "gray-400": setGray400Color,
            "gray-500": setGray500Color,
        };

        colorFunctions[type](color);
        document.documentElement.style.setProperty(`--app-${type}-color`, color);
        document.documentElement.style.setProperty(`--app-${type}-light-35`, tinycolor(color).lighten(35).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-44`, tinycolor(color).lighten(44).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-40`, tinycolor(color).lighten(40).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-50`, tinycolor(color).lighten(50).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-32`, tinycolor(color).lighten(32).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-34`, tinycolor(color).lighten(34).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-28`, tinycolor(color).lighten(28).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-45`, tinycolor(color).lighten(45).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-70`, tinycolor(color).lighten(70).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-80`, tinycolor(color).lighten(80).toString());
        document.documentElement.style.setProperty(`--app-border-soft-color`, tinycolor(color).darken(1).toString());
        document.documentElement.style.setProperty(`--app-border-normal-color`, tinycolor(color).darken(2).toString());
        document.documentElement.style.setProperty(`--app-border-medium-color`, tinycolor(color).darken(5).toString());
        document.documentElement.style.setProperty(`--app-border-hard-color`, tinycolor(color).darken(8).toString());
        document.documentElement.style.setProperty(`--app-border-contrast-color`, tinycolor(color).darken(12).toString());
        document.documentElement.style.setProperty(`--app-${type}-rgb-075`, tinycolor(color).setAlpha(0.075).toRgbString());
        document.documentElement.style.setProperty(`--app-${type}-rgb-15`, tinycolor(color).setAlpha(0.15).toRgbString());
        document.documentElement.style.setProperty(`--app-${type}-light-1`, tinycolor(color).lighten(1).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-2`, tinycolor(color).lighten(2).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-3`, tinycolor(color).lighten(3).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-4`, tinycolor(color).lighten(4).toString());
        document.documentElement.style.setProperty(`--app-${type}-light-5`, tinycolor(color).lighten(5).toString());
        localStorage.setItem(`${type}Color`, color);

        window.dispatchEvent(
            new CustomEvent("app-theme-change", {
                detail: {
                    colors: { [type]: color },
                },
            })
        );
    };

    const handleResetAll = () => {
        const x = document.documentElement.classList;
        document.documentElement.classList.remove(...x);
        document.getElementById("app-navigation-light").checked = true;
        document.getElementById("app-header-light").checked = true;
        document.getElementById("app-skin-light").checked = true;
        document.getElementById("app-font-family-inter").checked = true
        
        // Only clear theme-related items, not user credentials
        const themeKeys = [
            "navigationTheme", "headerTheme", "skinTheme", "fontFamily",
            "primaryColor", "secondaryColor", "successColor", "warningColor",
            "infoColor", "dangerColor", "darkColor", "darkenColor",
            "indigoColor", "purpleColor", "pinkColor", "redColor",
            "orangeColor", "yellowColor", "greenColor", "tealColor",
            "cyanColor", "gray-100Color", "gray-200Color", "gray-300Color",
            "gray-400Color", "gray-500Color"
        ];
        
        themeKeys.forEach(key => localStorage.removeItem(key));

        setOpen(false);
        setPrimaryColor("#ff9800");
        setSecondaryColor("#727981");
        setSuccessColor("#25b865");
        setWarningColor("#e49e3d");
        setInfoColor("#02a0e4");
        setDangerColor("#d13b4c");
        setDarkColor("#283c50");
        setDarkenColor("#001327");
        setIndigoColor("#6610f2");
        setPurpleColor("#6f42c1");
        setPinkColor("#e83e8c");
        setRedColor("#ea4d4d");
        setOrangeColor("#fd7e14");
        setYellowColor("#ffa21d");
        setGreenColor("#17c666");
        setTealColor("#41b2c4");
        setCyanColor("#3dc7be");
        setGray100Color("#eff0f6");
        setGray200Color("#e9ecef");
        setGray300Color("#e5e7eb");
        setGray400Color("#ced4da");
        setGray500Color("#91a1b6");

        const colorTypes = ["primary", "secondary", "success", "warning", "info", "danger", "dark", "darken", "indigo", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray-100", "gray-200", "gray-300", "gray-400", "gray-500"];
        colorTypes.forEach(type => {
            document.documentElement.style.removeProperty(`--app-${type}-color`);
            document.documentElement.style.removeProperty(`--app-${type}-light-35`);
            document.documentElement.style.removeProperty(`--app-${type}-light-44`);
            document.documentElement.style.removeProperty(`--app-${type}-light-40`);
            document.documentElement.style.removeProperty(`--app-${type}-light-50`);
            document.documentElement.style.removeProperty(`--app-${type}-light-32`);
            document.documentElement.style.removeProperty(`--app-${type}-light-34`);
            document.documentElement.style.removeProperty(`--app-${type}-light-28`);
            document.documentElement.style.removeProperty(`--app-${type}-light-45`);
            document.documentElement.style.removeProperty(`--app-${type}-light-70`);
            document.documentElement.style.removeProperty(`--app-${type}-light-80`);
            document.documentElement.style.removeProperty(`--app-border-soft-color`);
            document.documentElement.style.removeProperty(`--app-border-normal-color`);
            document.documentElement.style.removeProperty(`--app-border-medium-color`);
            document.documentElement.style.removeProperty(`--app-border-hard-color`);
            document.documentElement.style.removeProperty(`--app-border-contrast-color`);
            document.documentElement.style.removeProperty(`--app-${type}-rgb-075`);
            document.documentElement.style.removeProperty(`--app-${type}-rgb-15`);
            document.documentElement.style.removeProperty(`--app-${type}-light-1`);
            document.documentElement.style.removeProperty(`--app-${type}-light-2`);
            document.documentElement.style.removeProperty(`--app-${type}-light-3`);
            document.documentElement.style.removeProperty(`--app-${type}-light-4`);
            document.documentElement.style.removeProperty(`--app-${type}-light-5`);
        });
    };

    // Load saved themes from localStorage on page load
    const loadSavedThemes = () => {
        const savedNavigationTheme = localStorage.getItem("navigationTheme");
        const savedHeaderTheme = localStorage.getItem("headerTheme");
        const savedSkinTheme = localStorage.getItem("skinTheme");
        const savedFontFamily = localStorage.getItem("fontFamily");

        if (savedNavigationTheme) {
            handleNavigationTheme(savedNavigationTheme);
        }
        if (savedHeaderTheme) {
            handleHeaderTheme(savedHeaderTheme);
        }
        if (savedSkinTheme) {
            handleSkinTheme(savedSkinTheme);
        }
        if (savedFontFamily) {
            handleFontFamily(savedFontFamily);
        }

        const colorTypes = ["primary", "secondary", "success", "warning", "info", "danger", "dark", "darken", "indigo", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray-100", "gray-200", "gray-300", "gray-400", "gray-500"];
        colorTypes.forEach(type => {
            const savedColor = localStorage.getItem(`${type}Color`);
            if (savedColor) {
                handleColorChange(savedColor, type);
            }
        });
    };

    useEffect(() => {
        loadSavedThemes()
    }, [])

    return (
        <div className={`theme-customizer ${open ? "theme-customizer-open" : ""}`}>
            <div className="customizer-handle">
                <a href="#" className="cutomizer-open-trigger bg-primary" onClick={(e) => { e.preventDefault(), setOpen(true) }}>
                    <i className='lh-1'><FiSettings size={16} /></i>
                </a>
            </div>
            <div className="customizer-sidebar-wrapper">
                <div className="customizer-sidebar-header px-4 ht-80 border-bottom d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">Theme Settings</h5>
                    <a href="#" className="cutomizer-close-trigger d-flex" onClick={(e) => { e.preventDefault(), setOpen(false) }}>
                        <FiX size={16} />
                    </a>
                </div>
                <div className="customizer-sidebar-body position-relative p-4">
                    <PerfectScrollbar>
                        {/*! BEGIN: [App Colors] !*/}
                        <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set">
                            <label className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label" style={{ top: '-12px' }}>App Colors</label>
                            <div className="row g-2 theme-options-items app-colors" id="appColorList">
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-primary-color-input" className="d-block mb-1">Primary</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-primary-color-input"
                                        value={primaryColor}
                                        onChange={(e) => handleColorChange(e.target.value, "primary")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-secondary-color-input" className="d-block mb-1">Secondary</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-secondary-color-input"
                                        value={secondaryColor}
                                        onChange={(e) => handleColorChange(e.target.value, "secondary")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-success-color-input" className="d-block mb-1">Success</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-success-color-input"
                                        value={successColor}
                                        onChange={(e) => handleColorChange(e.target.value, "success")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-warning-color-input" className="d-block mb-1">Warning</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-warning-color-input"
                                        value={warningColor}
                                        onChange={(e) => handleColorChange(e.target.value, "warning")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-info-color-input" className="d-block mb-1">Info</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-info-color-input"
                                        value={infoColor}
                                        onChange={(e) => handleColorChange(e.target.value, "info")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-danger-color-input" className="d-block mb-1">Danger</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-danger-color-input"
                                        value={dangerColor}
                                        onChange={(e) => handleColorChange(e.target.value, "danger")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-dark-color-input" className="d-block mb-1">Dark</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-dark-color-input"
                                        value={darkColor}
                                        onChange={(e) => handleColorChange(e.target.value, "dark")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-darken-color-input" className="d-block mb-1">Darken</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-darken-color-input"
                                        value={darkenColor}
                                        onChange={(e) => handleColorChange(e.target.value, "darken")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-indigo-color-input" className="d-block mb-1">Indigo</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-indigo-color-input"
                                        value={indigoColor}
                                        onChange={(e) => handleColorChange(e.target.value, "indigo")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-purple-color-input" className="d-block mb-1">Purple</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-purple-color-input"
                                        value={purpleColor}
                                        onChange={(e) => handleColorChange(e.target.value, "purple")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-pink-color-input" className="d-block mb-1">Pink</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-pink-color-input"
                                        value={pinkColor}
                                        onChange={(e) => handleColorChange(e.target.value, "pink")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-red-color-input" className="d-block mb-1">Red</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-red-color-input"
                                        value={redColor}
                                        onChange={(e) => handleColorChange(e.target.value, "red")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-orange-color-input" className="d-block mb-1">Orange</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-orange-color-input"
                                        value={orangeColor}
                                        onChange={(e) => handleColorChange(e.target.value, "orange")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-yellow-color-input" className="d-block mb-1">Yellow</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-yellow-color-input"
                                        value={yellowColor}
                                        onChange={(e) => handleColorChange(e.target.value, "yellow")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-green-color-input" className="d-block mb-1">Green</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-green-color-input"
                                        value={greenColor}
                                        onChange={(e) => handleColorChange(e.target.value, "green")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-teal-color-input" className="d-block mb-1">Teal</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-teal-color-input"
                                        value={tealColor}
                                        onChange={(e) => handleColorChange(e.target.value, "teal")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-cyan-color-input" className="d-block mb-1">Cyan</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-cyan-color-input"
                                        value={cyanColor}
                                        onChange={(e) => handleColorChange(e.target.value, "cyan")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-gray-100-color-input" className="d-block mb-1">Gray 100</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-gray-100-color-input"
                                        value={gray100Color}
                                        onChange={(e) => handleColorChange(e.target.value, "gray-100")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-gray-200-color-input" className="d-block mb-1">Gray 200</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-gray-200-color-input"
                                        value={gray200Color}
                                        onChange={(e) => handleColorChange(e.target.value, "gray-200")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-gray-300-color-input" className="d-block mb-1">Gray 300</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-gray-300-color-input"
                                        value={gray300Color}
                                        onChange={(e) => handleColorChange(e.target.value, "gray-300")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-gray-400-color-input" className="d-block mb-1">Gray 400</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-gray-400-color-input"
                                        value={gray400Color}
                                        onChange={(e) => handleColorChange(e.target.value, "gray-400")}
                                    />
                                </div>
                                <div className="col-6 text-center single-option">
                                    <label htmlFor="app-gray-500-color-input" className="d-block mb-1">Gray 500</label>
                                    <input
                                        type="color"
                                        className="form-control-color"
                                        id="app-gray-500-color-input"
                                        value={gray500Color}
                                        onChange={(e) => handleColorChange(e.target.value, "gray-500")}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*! END: [App Colors] !*/}
                        {/*! BEGIN: [Navigation] !*/}
                        <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set">
                            <label className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label" style={{ top: '-12px' }}>Navigation</label>
                            <div className="row g-2 theme-options-items app-navigation" id="appNavigationList">
                                <div className="col-6 text-center single-option" onClick={() => handleNavigationTheme("light")}>
                                    <input type="radio" className="btn-check" name="app-navigation" id="app-navigation-light" defaultValue={1} data-app-navigation="app-navigation-light" defaultChecked />
                                    <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor="app-navigation-light">Light</label>
                                </div>
                                <div className="col-6 text-center single-option" onClick={() => handleNavigationTheme("dark")}>
                                    <input type="radio" className="btn-check" name="app-navigation" id="app-navigation-dark" defaultValue={2} data-app-navigation="app-navigation-dark" />
                                    <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor="app-navigation-dark">Dark</label>
                                </div>
                            </div>
                        </div>
                        {/*! END: [Navigation] !*/}
                        {/*! BEGIN: [Header] !*/}
                        <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set mt-5">
                            <label className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label" style={{ top: '-12px' }}>Header</label>
                            <div className="row g-2 theme-options-items app-header" id="appHeaderList">
                                <div className="col-6 text-center single-option" onClick={() => handleHeaderTheme("light")}>
                                    <input type="radio" className="btn-check" name="app-header" id="app-header-light" defaultValue={1} data-app-header="app-header-light" defaultChecked />
                                    <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor="app-header-light">Light</label>
                                </div>
                                <div className="col-6 text-center single-option" onClick={() => handleHeaderTheme("dark")}>
                                    <input type="radio" className="btn-check" name="app-header" id="app-header-dark" defaultValue={2} data-app-header="app-header-dark" />
                                    <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor="app-header-dark">Dark</label>
                                </div>
                            </div>
                        </div>
                        {/*! END: [Header] !*/}
                        {/*! BEGIN: [Skins] !*/}
                        <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set">
                            <label className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label" style={{ top: '-12px' }}>Skins</label>
                            <div className="row g-2 theme-options-items app-skin" id="appSkinList">
                                <div className="col-6 text-center position-relative single-option light-button" onClick={() => handleSkinTheme("light")}>
                                    <input type="radio" className="btn-check" id="app-skin-light" name="app-skin" defaultValue={1} data-app-skin="app-skin-light" defaultChecked />
                                    <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor="app-skin-light">Light</label>
                                </div>
                                <div className="col-6 text-center position-relative single-option dark-button" onClick={() => handleSkinTheme("dark")}>
                                    <input type="radio" className="btn-check" id="app-skin-dark" name="app-skin" defaultValue={2} data-app-skin="app-skin-dark" />
                                    <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor="app-skin-dark">Dark</label>
                                </div>
                            </div>
                        </div>
                        {/*! END: [Skins] !*/}
                        {/*! BEGIN: [Typography] !*/}
                        <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-0 border border-gray-2 theme-options-set">
                            <label className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label" style={{ top: '-12px' }}>Typography</label>
                            <div className="row g-2 theme-options-items font-family" id="fontFamilyList">
                                {
                                    fontFalmily.map(({ label, value, isChecked }, index) => {
                                        return (
                                            <div key={index} className="col-6 text-center single-option" onClick={() => handleFontFamily(value)}>
                                                <input type="radio" className="btn-check" id={value} name="font-family" defaultValue={index + 1} data-font-family={value} defaultChecked={isChecked} />
                                                <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor={value} >{label}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </PerfectScrollbar>
                </div>
                <div className="customizer-sidebar-footer px-4 ht-60 border-top d-flex align-items-center gap-2">
                    <div className="flex-fill w-50">
                        <a href="#" className="btn btn-danger" data-style="reset-all-common-style" onClick={handleResetAll}>Reset</a>
                    </div>
                    <div className="flex-fill w-50">
                        <a href="#" className="btn btn-primary">Download</a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ThemeCustomizer