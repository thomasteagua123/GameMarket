import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./home.css";

export function HomeClientes() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para menu movil
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setFilteredGames(data);
      })
      .catch((err) => console.error(err));

    const storedCart = JSON.parse(sessionStorage.getItem("carrito")) || [];
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((sum, item) => sum + item.cantidad, 0));
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = games.filter(
      (game) =>
        game.name.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
    );
    setFilteredGames(filtered);
  };

  const handleAddToCart = (game) => {
    let updatedCart;

    const existingItem = cartItems.find(
      (item) => item.game_id === game.game_id
    );

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.game_id === game.game_id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          game_id: game.game_id,
          nombre: game.name,
          precio: game.price,
          cantidad: 1,
        },
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
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </button>

        <nav className={`menu ${menuOpen ? "open" : ""}`}>
          <ul className="categories">
            <li>
              <Link to="/categoria/Acción" onClick={() => setMenuOpen(false)}>
                Acción
              </Link>
            </li>
            <li>
              <Link to="/categoria/Aventura" onClick={() => setMenuOpen(false)}>
                Aventura
              </Link>
            </li>
            <li>
              <Link to="/categoria/RPG" onClick={() => setMenuOpen(false)}>
                RPG
              </Link>
            </li>
            <li>
              <Link to="/categoria/Deportes" onClick={() => setMenuOpen(false)}>
                Deportes
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/Simulación"
                onClick={() => setMenuOpen(false)}
              >
                Simulación
              </Link>
            </li>
            <li>
              <Link to="/categoria/Shooter" onClick={() => setMenuOpen(false)}>
                Shooter
              </Link>
            </li>
            <li>
              <Link to="/categoria/Lucha" onClick={() => setMenuOpen(false)}>
                Lucha
              </Link>
            </li>
          </ul>
          <hr />
          <ul className="account">
            {user ? (
              <>
                <li>
                  <span>Bienvenido, {user.email}</span>
                </li>
                <li>
                  <button onClick={handleLogout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {!menuOpen && (
          <>
            {user && (
              <>
                <span>🛒 {cartCount} items</span>
                <input
                  type="text"
                  placeholder="Buscar juegos..."
                  onChange={handleSearch}
                  className="buscar-input"
                />
                <button className="register-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
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
              </>
            )}
            {!user && (
              <>
                <input
                  type="text"
                  placeholder="Buscar juegos..."
                  onChange={handleSearch}
                  className="buscar-input"
                />
                <button
                  className="register-btn"
                  onClick={() => navigate("/login")}
                >
                  Registrarse
                </button>
              </>
            )}
          </>
        )}
      </header>

      <div className="catalogo">
        <aside className="sidebar">
          <h3>Categorías</h3>
          <ul>
            <li>
              <Link to="/categoria/Acción">Acción</Link>
            </li>
            <li>
              <Link to="/categoria/Aventura">Aventura</Link>
            </li>
            <li>
              <Link to="/categoria/RPG">RPG</Link>
            </li>
            <li>
              <Link to="/categoria/Deportes">Deportes</Link>
            </li>
            <li>
              <Link to="/categoria/Simulación">Simulación</Link>
            </li>
            <li>
              <Link to="/categoria/Shooter">Shooter</Link>
            </li>
            <li>
              <Link to="/categoria/Lucha">Lucha</Link>
            </li>
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
              filteredGames.map((game, index) => (
                <li key={`${game.game_id}-${index}`} className="game-item">
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
        </main>
      </div>
    </div>
  );
}
