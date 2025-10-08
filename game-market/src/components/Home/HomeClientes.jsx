import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Games } from "../Games/Games";
import "./home.css";

export function HomeClientes() {
  const [filteredGames, setFilteredGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  // Cargar carrito desde sessionStorage
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("carrito")) || [];
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((sum, item) => sum + item.cantidad, 0));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    // const allGames = [
    //   { id: 1, nombre: "Among Us", categoria: "Party", precio: 2200 },
    //   { id: 2, nombre: "Call of Duty Modern Warfare II", categoria: "Shooter", precio: 2300 },
    //   { id: 3, nombre: "EA FC24", categoria: "Deportes", precio: 2300 },
    //   { id: 4, nombre: "Elden Ring", categoria: "RPG", precio: 2300 },
    //   { id: 5, nombre: "God of War III", categoria: "Acción", precio: 2100 },
    //   { id: 6, nombre: "Hollow Knight", categoria: "Aventura", precio: 2100 },
    //   { id: 7, nombre: "Hollow Knight Silksong first", categoria: "Aventura", precio: 2100 },
    //   { id: 8, nombre: "Logo of Stardew Valley", categoria: "Estrategia", precio: 2100 },
    //   { id: 9, nombre: "Minecraft", categoria: "Sandbox", precio: 1800 },
    //   { id: 10, nombre: "Mortal Kombat 1", categoria: "Lucha", precio: 1800 },
    //   { id: 11, nombre: "Party Hard", categoria: "Indie", precio: 1800 },
    //   { id: 12, nombre: "The Legend of Zelda Breath of the Wild", categoria: "Aventura", precio: 3500 },
    // ];

    const filtered = allGames.filter(
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
        item.game_id === game.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { game_id: game.id, nombre: game.nombre, precio: game.precio, cantidad: 1 }];
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
        <Games filteredGames={filteredGames} handleAddToCart={handleAddToCart} />
      </main>
    </div>
  );
}
