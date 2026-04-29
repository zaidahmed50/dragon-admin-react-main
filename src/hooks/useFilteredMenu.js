import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { menuListWithPermissions } from '../utils/fackData/menuListWithPermissions';
import { filterMenuByPermissions, getMenuStats } from '../utils/menuFilter';

/**
 * Custom hook to get filtered menu based on user permissions
 * @returns {Object} - Filtered menu and stats
 * 
 * @example
 * const { filteredMenu, menuStats, isLoading } = useFilteredMenu();
 * 
 * // Use filteredMenu in your navigation component
 * {filteredMenu.map(item => <MenuItem key={item.id} {...item} />)}
 */
export const useFilteredMenu = () => {
    const { user, loading, isSuperAdmin } = useAuth();

    const filteredMenu = useMemo(() => {
        if (!user) {
            return [];
        }

        const userPermissions = user.authorities || [];
        const superAdmin = isSuperAdmin();

        return filterMenuByPermissions(
            menuListWithPermissions,
            userPermissions,
            superAdmin
        );
    }, [user, isSuperAdmin]);

    const menuStats = useMemo(() => {
        return getMenuStats(filteredMenu);
    }, [filteredMenu]);

    return {
        filteredMenu,
        menuStats,
        isLoading: loading,
        hasMenu: filteredMenu.length > 0
    };
};

export default useFilteredMenu;
