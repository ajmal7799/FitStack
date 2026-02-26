import axios from 'axios';
import { store } from '../redux/store';
import { setAccessToken, clearData } from '../redux/slice/userSlice/authDataSlice';


const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Request interceptor — attach access token
AxiosInstance.interceptors.request.use((config) => {
    const accessToken = store.getState().authData.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// ✅ Track if we're already refreshing to prevent infinite loops
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
};

// ✅ Response interceptor — auto refresh on 401
AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isTokenExpired =
            error.response?.status === 401 &&
            error.response?.data?.message === 'TOKEN_EXPIRED' &&
            !originalRequest._retry; // ← prevent infinite retry

        if (isTokenExpired) {
            if (isRefreshing) {
                // ✅ Queue requests while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(AxiosInstance(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // ✅ Call refresh endpoint
                const response = await axios.post(
                    'http://localhost:3000/refresh-token',
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken;

                // ✅ Save new access token to Redux
                store.dispatch(setAccessToken(newAccessToken));

                // ✅ Retry all queued requests with new token
                processQueue(null, newAccessToken);

                // ✅ Retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return AxiosInstance(originalRequest);

            } catch (refreshError) {
                // ✅ Refresh failed → force logout
                processQueue(refreshError, null);
                store.dispatch(clearData());
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default AxiosInstance;