import axios from "axios";

const AxiosInstance = axios.create({
  baseURL:  "http://localhost:3000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use((config) => {
  return config;
});

AxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);


export default AxiosInstance;