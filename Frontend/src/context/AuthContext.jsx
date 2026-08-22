import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const DEFAULT_USER = {
  id: "usr_101",
  name: "Alex Morgan",
  email: "alex.morgan@globetrotter.io",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  role: "traveler",
  languagePreference: "English",
  currency: "INR (₹)"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("globetrotter_user");
    return savedUser ? JSON.parse(savedUser) : DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("globetrotter_auth") === "true";
  });

  useEffect(() => {
    // Sync initial state if needed
    if (!localStorage.getItem("globetrotter_user")) {
      localStorage.setItem("globetrotter_user", JSON.stringify(DEFAULT_USER));
      localStorage.setItem("globetrotter_auth", "true");
    }
  }, []);

  const login = (email, password) => {
    const userData = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("globetrotter_user", JSON.stringify(userData));
    localStorage.setItem("globetrotter_auth", "true");
    localStorage.setItem("globetrotter_token", "mock_jwt_token_globetrotter_12345");
    return { success: true };
  };

  const signup = (name, email, password) => {
    const userData = {
      ...DEFAULT_USER,
      name: name || "New Traveler",
      email: email || "traveler@globetrotter.io",
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("globetrotter_user", JSON.stringify(userData));
    localStorage.setItem("globetrotter_auth", "true");
    localStorage.setItem("globetrotter_token", "mock_jwt_token_globetrotter_12345");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("globetrotter_user");
    localStorage.setItem("globetrotter_auth", "false");
    localStorage.removeItem("globetrotter_token");
  };

  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem("globetrotter_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
