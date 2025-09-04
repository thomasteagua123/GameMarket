// src/App.jsx

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import { Plataformas } from "./components/Platform";
import { Home } from "./components/Home/Home";
import { HomeClientes } from "./components/Home/HomeClientes.jsx"; // 👈 New import
import Register from "./components/Login/Register";
import Clientes from "./components/Clientes.jsx";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/plataformas" element={<Plataformas />} />
      <Route path="/register" element={<Register />} />
      <Route path="/homeClientes" element={<HomeClientes />} />
      {isAdmin && <Route path="/clientes" element={<Clientes />} />}
    </Routes>
  );
}

export default App;
