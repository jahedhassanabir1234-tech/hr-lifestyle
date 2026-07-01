import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("hr-user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      localStorage.removeItem("hr-user");
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - backend may be offline");
      return Promise.reject(error);
    }

    if (!error.response) {
      console.error("Network error - backend may be offline");
      return Promise.reject(error);
    }

    if (error.response.status === 401 || error.response.status === 403) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin")) {
        localStorage.removeItem("hr-user");
        localStorage.removeItem("adminAuth");
        window.location.href = "/admin/login";
      } else if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.removeItem("hr-user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
