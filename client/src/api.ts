import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3007/api", // Adjust this URL to match your backend server
  withCredentials: true, // This ensures cookies (including session cookies) are sent with every request
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      // For example:
      // window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export default api;
