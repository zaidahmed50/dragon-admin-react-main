import React, {Fragment, useEffect, useState} from "react";
import {FiChevronRight} from "react-icons/fi";
import {Link, useLocation} from "react-router-dom";
import getIcon from "@/utils/getIcon";
import { useFilteredMenu } from "@/hooks/useFilteredMenu";

const Menus = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");
    const pathName = useLocation().pathname;
    
    // Get filtered menu based on user permissions
    const { filteredMenu, isLoading } = useFilteredMenu();
    const menuList = filteredMenu;

    const handleMainMenu = (e, name) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const handleDropdownMenu = (e, name) => {
        e.stopPropagation();
        if (openSubDropdown === name) {
            setOpenSubDropdown(null);
        } else {
            setOpenSubDropdown(name);
        }
    };

    useEffect(() => {
        let foundParent = "";
        let foundChild = "";

        if (menuList) {
            menuList.forEach(menu => {
                if (menu.dropdownMenu) {
                    menu.dropdownMenu.forEach(subMenu => {
                        if (subMenu.path === pathName) {
                            foundParent = menu.name;
                        } else if (subMenu.dropdownMenu && Array.isArray(subMenu.dropdownMenu)) {
                            subMenu.dropdownMenu.forEach(nestedSub => {
                                if (nestedSub.path === pathName) {
                                    foundParent = menu.name;
                                    foundChild = subMenu.name;
                                }
                            });
                        }
                    });
                }
            });
        }

        if (foundParent) {
            setActiveParent(foundParent);
            setOpenDropdown(foundParent);
        }
        if (foundChild) {
            setActiveChild(foundChild);
            setOpenSubDropdown(foundChild);
        }
    }, [pathName, menuList]);

    // Show loading state while menu is being filtered
    if (isLoading) {
        return (
            <li className="nxl-item">
                <div className="nxl-link">
                    <span className="nxl-mtext">Loading menu...</span>
                </div>
            </li>
        );
    }

    // Show message if no menu items are visible
    if (!menuList || menuList.length === 0) {
        return (
            <li className="nxl-item">
                <div className="nxl-link">
                    <span className="nxl-mtext">No menu items available</span>
                </div>
            </li>
        );
    }

    return (
        <>
            {menuList.map(({ dropdownMenu, id, name, path, icon }) => {
                // ── Direct link item (no dropdown, e.g. Backup) ──────────────
                if (!dropdownMenu) {
                    return (
                        <li
                            key={id}
                            className={`nxl-item ${pathName === path ? 'active' : ''}`}
                        >
                            <Link to={path} className="nxl-link text-capitalize">
                                <span className="nxl-micon">{getIcon(icon)}</span>
                                <span className="nxl-mtext" style={{ paddingLeft: '2.5px' }}>{name}</span>
                            </Link>
                        </li>
                    );
                }

                return (
                    <li
                        key={id}
                        onClick={(e) => handleMainMenu(e, name)}
                        className={`nxl-item nxl-hasmenu ${activeParent === name ? "active nxl-trigger" : ""}`}
                    >
                        <Link to={path} className="nxl-link text-capitalize">
                            <span className="nxl-micon"> {getIcon(icon)} </span>
                            <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>
                        {name}
                    </span>
                            <span className="nxl-arrow fs-16">
                        <FiChevronRight />
                    </span>
                        </Link>
                        <ul
                            className={`nxl-submenu ${openDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {dropdownMenu.map((subMenuItem) => {
                                const { id, name, path, subdropdownMenu, dropdownMenu: nestedDropdown, icon: subIcon } = subMenuItem;
                                const hasSubMenu = subdropdownMenu && nestedDropdown && nestedDropdown.length > 0;
                                
                                return (
                                    <Fragment key={id}>
                                        {hasSubMenu ? (
                                            <li
                                                className={`nxl-item nxl-hasmenu ${activeChild === name ? "active" : ""}`}
                                                onClick={(e) => handleDropdownMenu(e, name)}
                                            >
                                                <Link to={path} className={`nxl-link text-capitalize`}>
                                                    {/* Submenu Icon Trigger */}
                                                    <span className="nxl-micon">{getIcon(subIcon)}</span>
                                                    <span className="nxl-mtext">{name}</span>
                                                    <span className="nxl-arrow">
                                                        <i>
                                                            <FiChevronRight />
                                                        </i>
                                                    </span>
                                                </Link>
                                                
                                                <ul
                                                    className={`nxl-submenu ${openSubDropdown === name
                                                        ? "nxl-menu-visible"
                                                        : "nxl-menu-hidden "
                                                    }`}
                                                >
                                                    {nestedDropdown.map((subItem) => {
                                                        return (
                                                            <li key={subItem.id} className={`nxl-item ${pathName === subItem.path ? "active" : ""}`}>
                                                                <Link 
                                                                    className="nxl-link text-capitalize" 
                                                                    to={subItem.path}
                                                                    style={pathName === subItem.path ? { color: 'primaryColor' } : {}}
                                                                >
                                                                    <span className="nxl-micon" style={{marginRight: "10px"}}>
                                                                        {getIcon(subItem.icon)}
                                                                    </span>
                                                                    <span className="nxl-mtext">{subItem.name}</span>
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </li>
                                        ) : (
                                            <li className={`nxl-item ${pathName === path ? "active" : ""}`}>
                                                <Link 
                                                    className="nxl-link text-capitalize" 
                                                    to={path}
                                                    style={pathName === path ? { color: 'primaryColor' } : {}}
                                                >
                                                    <span className="nxl-micon" style={{marginRight: "10px"}}>
                                                        {getIcon(subIcon)}
                                                    </span>
                                                    <span className="nxl-mtext">{name}</span>
                                                </Link>
                                            </li>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </ul>
                    </li>
                );
            })}
        </>
    );
};

export default Menus;
