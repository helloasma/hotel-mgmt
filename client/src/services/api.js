import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach the token to every request if the user is logged in
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    // Ignore malformed localStorage data
  }
  return config;
});

// On 401 responses, clear the stored user and reload to force logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
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