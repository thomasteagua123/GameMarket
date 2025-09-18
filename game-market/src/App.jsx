// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import { Home } from "./components/Home/Home";
import { HomeClientes } from "./components/Home/HomeClientes.jsx";
import { Plataformas } from "./components/Platform";
import { Categoria } from "./components/Home/Categoria.jsx";
import Clientes from "./components/Clientes/Clientes.jsx";
import SimularCompra from "./components/Clientes/SimularCompra.jsx";
import Carrito from "./components/Clientes/Carrito.jsx";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<Home />} />

      {/* Autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Vista para clientes */}
      <Route path="/homeClientes" element={<HomeClientes />} />

      {/* Navegación por plataformas y categorías */}
      <Route path="/plataformas" element={<Plataformas />} />
      <Route path="/categoria/:nombre" element={<Categoria />} />

      {/* Panel de administración */}
      {isAdmin && <Route path="/clientes" element={<Clientes />} />}

      {/* Página del carrito */}
      <Route path="/carrito" element={<Carrito />} />

      {/* Formulario de pago (Simular compra) */}
      <Route path="/simular-compra" element={<SimularCompra />} />
    </Routes>
  );
}

export default App;
