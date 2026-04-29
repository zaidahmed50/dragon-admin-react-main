import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import ApiUrls from '/src/services/DragonApi.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {

console.log(123456789,ApiUrls.loginUser);

        try {

            const response = await axios.post(ApiUrls.loginUser, { email, password });

            if (response.status === 200 && response.data.success) {
                const userData = response.data.data;
                const authorities = userData.authorities?.map(auth => auth.authority);
                
                const userToStore = {
                    ...userData,
                    authorities
                };

                setUser(userToStore);
                localStorage.setItem('user', JSON.stringify(userToStore));
                localStorage.setItem('token', userData.token);

                return { success: true };
            }

            return { success: false, error: response.data.message || 'Invalid response from server' };
        } catch (error) {
            console.log(error)
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const hasPermission = (permission) => {
        if (!user || !user.authorities) {
            return false;
        }
        // Super Admin has all permissions
        if (user.authorities.includes('ROLE_SUPER_ADMIN')) {
            return true;
        }
        return user.authorities.includes(permission);
    };

    const hasAnyPermission = (permissions) => {
        if (!user || !user.authorities) {
            return false;
        }
        // Super Admin has all permissions
        if (user.authorities.includes('ROLE_SUPER_ADMIN')) {
            return true;
        }
        return permissions.some(permission => user.authorities.includes(permission));
    };

    const hasAllPermissions = (permissions) => {
        if (!user || !user.authorities) {
            return false;
        }
        // Super Admin has all permissions
        if (user.authorities.includes('ROLE_SUPER_ADMIN')) {
            return true;
        }
        return permissions.every(permission => user.authorities.includes(permission));
    };

    const isSuperAdmin = () => {
        if (!user || !user.authorities) {
            return false;
        }
        return user.authorities.includes('ROLE_SUPER_ADMIN');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                loading,
                hasPermission,
                hasAnyPermission,
                hasAllPermissions,
                isSuperAdmin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
