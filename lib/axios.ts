import { getSession } from "next-auth/react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token from NextAuth session
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only attempt to get session in the browser
    if (typeof window !== "undefined") {
      const session = await getSession() as any;
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
