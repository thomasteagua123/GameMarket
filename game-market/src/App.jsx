// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import { Home } from "./components/Home/Home";
import { HomeClientes } from "./components/Home/HomeClientes.jsx";
import { Plataformas } from "./components/Platform";
import { Categoria } from "./components/Home/Categoria.jsx";
import SimularCompra from "./components/Clientes/SimularCompra.jsx";
import { useAuth } from "./context/AuthContext";
import { Clientes } from "./components/Clientes/Clientes.jsx";
import { Carrito } from "./components/Clientes/Carrito.jsx";
import Comprobante from "./components/Clientes/Comprobante.jsx"; // ✅ nuevo
import { Games } from "./components/Games/Games";
import AdminPanel from "./components/Admin/admin.jsx";

function App() {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPanel />} />
      {/* Autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Vista para clientes */}
      <Route path="/homeClientes" element={<HomeClientes />} />

      {/* Navegación por plataformas y categorías */}
      <Route path="/plataformas" element={<Plataformas />} />
      <Route path="/categoria/:nombre" element={<Categoria />} />
      <Route path="/games" element={<Games />} />

      {/* Panel de administración */}
      {isAdmin && <Route path="/clientes" element={<Clientes />} />}

      {/* Página del carrito */}
      <Route path="/carrito" element={<Carrito />} />

      {/* Formulario de pago (Simular compra) */}
      <Route path="/simular-compra" element={<SimularCompra />} />

      {/* ✅ Nueva ruta: comprobante de compra */}
      <Route path="/comprobante" element={<Comprobante />} />
    </Routes>
  );
}

export default App;
