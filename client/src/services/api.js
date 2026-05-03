import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Automatically attach the token to every request if the user is logged in
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const authToken = token || user?.token;
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }
  } catch {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }
  }
  return config;
});

// On 401 responses, clear the stored user and reload to force logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Only redirect if not already on an auth page
      const authPaths = ["/login", "/Login", "/signup", "/Signup"];
      if (!authPaths.includes(window.location.pathname)) {
        window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;