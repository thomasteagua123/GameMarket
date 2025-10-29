// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isAdmin = user?.rol === "admin";

  // Verificar sesión activa
  useEffect(() => {
    // Primero intenta restaurar desde localStorage (fallback rápido)
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }

    // Luego verifica en el backend (cookie de sesión)
    axios
      .get(`${API_URL}/perfil`, { withCredentials: true })
      .then((res) => {
        // El backend devuelve { email, rol } si hay sesión
        if (res.data.email) {
          const u = { email: res.data.email, rol: res.data.rol };
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        // Si falla, no sobreescribimos la info local almacenada
      });
  }, []);

  // LOGIN usando username
  const login = async (username, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { username, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        const u = { email: username, rol: res.data.rol };
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
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
    localStorage.removeItem("user");
  };

  // REGISTER (si querés agregar email, se puede ajustar después)
  const register = async (username, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/usuarios`,
        { username, password },
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
