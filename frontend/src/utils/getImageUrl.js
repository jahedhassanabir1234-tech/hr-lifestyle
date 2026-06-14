const API_BASE = import.meta.env.VITE_API_URL || "/api";
const BACKEND_URL = API_BASE.replace(/\/api$/, "");

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_URL}${path}`;
};
