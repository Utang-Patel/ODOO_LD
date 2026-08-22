import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("globetrotter_token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state on App mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("globetrotter_token");
      if (storedToken) {
        try {
          const data = await authService.getCurrentUser();
          if (data && data.success && data.user) {
            setUser(data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.warn("[Auth Context] Failed to verify existing session token:", error?.response?.data?.message || error.message);
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data && data.success) {
        const authToken = data.token;
        const authUser = data.user;

        localStorage.setItem("globetrotter_token", authToken);
        if (authUser) {
          localStorage.setItem("globetrotter_user", JSON.stringify(authUser));
        }

        setToken(authToken);
        setUser(authUser);
        setIsAuthenticated(true);
        return { success: true, message: data.message || "Login successful!" };
      } else {
        return { success: false, message: data.message || "Invalid credentials" };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unable to connect to the server. Please try again.";
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await authService.signup({ name, email, password });
      if (data && data.success) {
        return { success: true, message: data.message || "Account created successfully!" };
      } else {
        return { success: false, message: data.message || "Signup failed." };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unable to connect to the server. Please try again.";
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("globetrotter_token");
    localStorage.removeItem("globetrotter_user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("globetrotter_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
