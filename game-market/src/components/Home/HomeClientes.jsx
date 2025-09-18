import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./home.css";

export function HomeClientes() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  // Cargar juegos y carrito desde API y sessionStorage
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setFilteredGames(data);
      })
      .catch((err) => console.error(err));

    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((sum, item) => sum + item.cantidad, 0));
  }, []);

  // Manejar búsqueda
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = games.filter(
      (game) =>
        game.name.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
    );
    setFilteredGames(filtered);
  };

  // Agregar juego al carrito
  const handleAddToCart = (game) => {
    const storedCart = [...cartItems];
    const existingItem = storedCart.find(
      (item) => item.game_id === game.game_id
    );

    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      storedCart.push({ game_id: game.game_id, name: game.name, cantidad: 1 });
    }

    sessionStorage.setItem("cart", JSON.stringify(storedCart));
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((sum, item) => sum + item.cantidad, 0));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header className="header">
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>
              Bienvenido, {user.email}!
            </span>
            <span style={{ marginRight: "20px" }}>🛒 {cartCount} items</span>
            <input
              type="text"
              placeholder="Buscar juegos..."
              onChange={handleSearch}
              className="buscar-input"
            />
            <button className="register-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
            <button onClick={() => setShowCart(!showCart)}>
              {showCart ? "Cerrar Carrito" : "Ver Carrito"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Buscar juegos..."
              onChange={handleSearch}
              className="buscar-input"
            />
            <button className="register-btn" onClick={() => navigate("/login")}>
              Registrarse
            </button>
          </>
        )}
      </header>

      <div className="catalogo">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Categorías</h3>
          <ul>
            <li><Link to="/categoria/Acción">Acción</Link></li>
            <li><Link to="/categoria/Aventura">Aventura</Link></li>
            <li><Link to="/categoria/RPG">RPG</Link></li>
            <li><Link to="/categoria/Deportes">Deportes</Link></li>
            <li><Link to="/categoria/Simulación">Simulación</Link></li>
            <li><Link to="/categoria/Shooter">Shooter</Link></li>
            <li><Link to="/categoria/Lucha">Lucha</Link></li>
          </ul>
        </aside>

        <main>
          <h2 className="title">Lista de Juegos</h2>
          {isAdmin && (
            <div style={{ marginBottom: "20px" }}>
              <Link to="/clientes">
                <button>Ir a Panel de Clientes</button>
              </Link>
            </div>
          )}

          <ol className="games-grid">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <li key={game.game_id} className="game-item">
                  <div>
                    {game.name} - {game.category} (${game.price})
                  </div>
                  <button
                    className="agregar-btn"
                    onClick={() => handleAddToCart(game)}
                  >
                    Agregar al carrito
                  </button>
                </li>
              ))
            ) : (
              <p>No se encontraron juegos que coincidan con la búsqueda.</p>
            )}
          </ol>

          {/* Mostrar carrito dentro de la misma página */}
          {showCart && (
            <div className="cart-container">
              <h2>Tu Carrito</h2>
              {cartItems.length > 0 ? (
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.game_id}>
                      {item.name} x {item.cantidad}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Tu carrito está vacío.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
