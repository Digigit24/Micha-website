// File: src/api/axiosClient.js

import axios from "axios";
import { API_BASE_URL, getAuthHeader, handleUnauthorized } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor: attach token if available
axiosClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    config.headers = {
      ...(config.headers || {}),
      ...authHeader,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Minimal logging, then logout + redirect
      console.warn("[API] 401 Unauthorized. Logging out...");
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
