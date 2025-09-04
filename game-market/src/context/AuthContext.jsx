import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // El correo electrónico de administrador predeterminado
  const ADMIN_EMAIL = "admin123@gmail.com";

  const login = (email) => {
    setUser({ email });
    setIsAdmin(email === ADMIN_EMAIL);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
