import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // flag para indicar si el usuario es admin
  const isAdmin = user?.rol === "admin";

  // sesión activa y obtener email y rol
  useEffect(() => {
    axios
      .get(`${API_URL}/perfil`, { withCredentials: true })
      .then((res) => {
        if (res.data.email) {
          setUser({ email: res.data.email, rol: res.data.rol });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // login guarda email + rol
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { username: email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        setUser({ email, rol: res.data.rol });
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const logout = async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  const register = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/usuarios`,
        { username: email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return res.status === 201;
    } catch (err) {
      alert("Error en register:", err.response?.data || err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
