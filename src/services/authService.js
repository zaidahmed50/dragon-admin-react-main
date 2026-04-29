import ApiService from './apiService';
import API_ENDPOINTS from './apiEndpoints';

/**
 * Authentication API Service
 * All authentication-related API calls
 */
class AuthService {
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise}
     */
    static async login(email, password) {
        const response = await ApiService.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
        });

        // Store token if login successful
        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    /**
     * Logout user
     * @returns {Promise}
     */
    static async logout() {
        const response = await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
        this.removeToken();
        return response;
    }

    /**
     * Refresh authentication token
     * @returns {Promise}
     */
    static async refreshToken() {
        const response = await ApiService.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    /**
     * Forgot password - Send reset link
     * @param {string} email - User email
     * @returns {Promise}
     */
    static async forgotPassword(email) {
        return await ApiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
            email,
        });
    }

    /**
     * Reset password
     * @param {string} token - Reset token
     * @param {string} newPassword - New password
     * @returns {Promise}
     */
    static async resetPassword(token, newPassword) {
        return await ApiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            token,
            password: newPassword,
        });
    }

    /**
     * Change password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise}
     */
    static async changePassword(currentPassword, newPassword) {
        return await ApiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
            currentPassword,
            newPassword,
        });
    }

    /**
     * Verify email
     * @param {string} token - Verification token
     * @returns {Promise}
     */
    static async verifyEmail(token) {
        return await ApiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
            token,
        });
    }

    /**
     * Resend verification email
     * @param {string} email - User email
     * @returns {Promise}
     */
    static async resendVerification(email) {
        return await ApiService.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
            email,
        });
    }

    /**
     * Store authentication token
     * @param {string} token - Auth token
     */
    static setToken(token) {
        localStorage.setItem('authToken', token);
    }

    /**
     * Get stored authentication token
     * @returns {string|null}
     */
    static getToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Remove authentication token
     */
    static removeToken() {
        localStorage.removeItem('authToken');
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    static isAuthenticated() {
        return !!this.getToken();
    }
}

export default AuthService;
