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

// On 401 responses, clear auth data and redirect only when appropriate
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const currentPath = window.location.pathname;

    const isLoginRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/management-login");

    const isAuthPage =
      currentPath.toLowerCase() === "/login" ||
      currentPath.toLowerCase() === "/signup" ||
      currentPath.toLowerCase() === "/admin/login";

    if (status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");

      // Important: failed login should stay on the same login page
      if (isLoginRequest || isAuthPage) {
        return Promise.reject(error);
      }

      // Expired/invalid token elsewhere should redirect
      window.location.href = "/Login";
    }

    return Promise.reject(error);
  }
);

export default api;