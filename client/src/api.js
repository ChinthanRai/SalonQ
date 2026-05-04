import axios from "axios";

// Log the environment variable for debugging
console.log("VITE_API_URL from env:", import.meta.env.VITE_API_URL);
console.log("Using baseURL:", import.meta.env.VITE_API_URL || "http://localhost:5000/api");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// Add a request interceptor to automatically include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("salonToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;