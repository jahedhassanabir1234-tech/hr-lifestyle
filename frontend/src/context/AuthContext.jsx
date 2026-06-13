import { createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hr-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("hr-user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("hr-user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      phone,
    });
    return data;
  };

  const verifyOTP = async (userId, otp) => {
    const { data } = await api.post("/auth/verify-otp", { userId, otp });
    localStorage.setItem("hr-user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const resendOTP = async (userId) => {
    const { data } = await api.post("/auth/resend-otp", { userId });
    return data;
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const { data } = await api.post("/auth/google", {
        name: googleUser.displayName || "Google User",
        email: googleUser.email,
        avatar: googleUser.photoURL || "",
      });

      localStorage.setItem("hr-user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Login cancelled. Please try again.");
      }
      if (error.code === "auth/popup-blocked") {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("hr-user");
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const { data } = await api.put("/auth/profile", userData);
    localStorage.setItem("hr-user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, verifyOTP, resendOTP, logout, updateProfile, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
