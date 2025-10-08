import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Games } from "../Games/Games";
import { useGames } from "../../hooks/useGames";
import "./home.css";

export function HomeClientes() {
  const [filteredGames, setFilteredGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ obtenemos todos los juegos desde el hook
  const games = useGames();

  // Al cargar, mostrar todos los juegos por defecto
  useEffect(() => {
    setFilteredGames(games);
  }, [games]);

  // Cargar carrito desde sessionStorage
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("carrito")) || [];
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((sum, item) => sum + item.cantidad, 0));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = games.filter(
      (game) =>
        game.nombre.toLowerCase().includes(term) ||
        game.categoria.toLowerCase().includes(term)
    );
    setFilteredGames(filtered);
  };

  const handleAddToCart = (game) => {
    let updatedCart;
    const existing = cartItems.find((item) => item.game_id === game.id);

    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.game_id === game.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        { game_id: game.id, nombre: game.nombre, precio: game.precio, cantidad: 1 },
      ];
    }

    sessionStorage.setItem("carrito", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((sum, item) => sum + item.cantidad, 0));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const irAlCarrito = () => {
    navigate("/carrito");
  };

  return (
    <div>
      <header className="header">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>

        <nav className={`menu ${menuOpen ? "open" : ""}`}>
          <ul className="categories">
            <li><Link to="/categoria/Acción" onClick={() => setMenuOpen(false)}>Acción</Link></li>
            <li><Link to="/categoria/Aventura" onClick={() => setMenuOpen(false)}>Aventura</Link></li>
            <li><Link to="/categoria/RPG" onClick={() => setMenuOpen(false)}>RPG</Link></li>
            <li><Link to="/categoria/Deportes" onClick={() => setMenuOpen(false)}>Deportes</Link></li>
            <li><Link to="/categoria/Simulación" onClick={() => setMenuOpen(false)}>Simulación</Link></li>
            <li><Link to="/categoria/Shooter" onClick={() => setMenuOpen(false)}>Shooter</Link></li>
            <li><Link to="/categoria/Lucha" onClick={() => setMenuOpen(false)}>Lucha</Link></li>
          </ul>
          <hr />
          <ul className="account">
            {user ? (
              <>
                <li><span>Bienvenido, {user.email}</span></li>
                <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link></li>
                <li><Link to="/register" onClick={() => setMenuOpen(false)}>Registrarse</Link></li>
              </>
            )}
          </ul>
        </nav>

        {!menuOpen && (
          <>
            <input
              type="text"
              placeholder="Buscar juegos..."
              onChange={handleSearch}
              className="buscar-input"
            />
            <p className="p">Carrito: {cartCount}</p>
            {user && (
              <button className="carrito-btn" onClick={irAlCarrito}>
                <video
                  src="/carro.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                />
              </button>
            )}
          </>
        )}
      </header>

      <main>
        <h2 className="title">Lista de Juegos</h2>
        {/* ✅ Pasamos filteredGames al componente Games */}
        <Games filteredGames={filteredGames} handleAddToCart={handleAddToCart} />
      </main>
    </div>
  );
}
