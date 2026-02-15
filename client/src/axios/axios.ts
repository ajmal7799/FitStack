import axios from 'axios';
import { store } from '../redux/store';

const AxiosInstance = axios.create({
  baseURL:  'http://localhost:3000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.interceptors.request.use((config) => {
  const accessToken = store.getState().authData.accessToken;

  config.headers = {
    ...config.headers,               // Preserve existing headers
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`,
    }),
  };

  return config;
});


AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);


export default AxiosInstance;