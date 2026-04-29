import axiosInstance, {buildQueryString} from './axiosConfig';

class ApiService {
    static async get(url, params = {}, config = {}) {
        try {
            const queryString = buildQueryString(params);


            const response = await axiosInstance.get(`${url}${queryString}`, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async post(url, data = {}, config = {}) {
        try {
            const response = await axiosInstance.post(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async put(url, data = {}, config = {}) {
        try {
            const response = await axiosInstance.put(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async delete(url, data = {}, config = {}) {
        try {
            let finalConfig = {...config};
            let urlWithParams = url;

            if (data && data.data) {
                // The caller passed { data: payload } as the second argument (like in teamService.js)
                finalConfig = {...finalConfig, ...data};
            } else {
                // The caller passed query params as the second argument
                const queryString = buildQueryString(data);
                urlWithParams = `${url}${queryString}`;
            }

            const response = await axiosInstance.delete(urlWithParams, finalConfig);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async upload(url, formData, onUploadProgress = null) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: onUploadProgress,
            };

            const response = await axiosInstance.post(url, formData, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }


    static async download(url, filename, params = {}) {
        try {
            const queryString = buildQueryString(params);
            const response = await axiosInstance.get(`${url}${queryString}`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static handleError(error) {
        if (error.response) {
            // Server responded with error
            return {
                success: false,
                message: error.response.data?.message || 'An error occurred',
                errors: error.response.data?.errors || {},
                status: error.response.status,
            };
        } else if (error.request) {
            // Request was made but no response
            return {
                success: false,
                message: 'Network error. Please check your connection.',
                errors: {},
                status: null,
            };
        } else {
            // Something else happened
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
                errors: {},
                status: null,
            };
        }
    }

    static async batch(requests) {
        try {
            const responses = await Promise.all(requests);
            return responses;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async retry(requestFn, maxRetries = 3, delay = 1000) {
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                lastError = error;
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                }
            }
        }

        throw this.handleError(lastError);
    }
}

export default ApiService;
