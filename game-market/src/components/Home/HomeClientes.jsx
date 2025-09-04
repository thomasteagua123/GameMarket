import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./home.css";

export function HomeClientes() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]); // Nuevo estado para los juegos filtrados
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setFilteredGames(data); // Muestra todos los juegos al inicio
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Función para manejar la búsqueda y filtrar los juegos
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = games.filter(game =>
      game.name.toLowerCase().includes(searchTerm) ||
      game.category.toLowerCase().includes(searchTerm)
    );
    setFilteredGames(filtered);
  };

  return (
    <div>
      <header className="header">
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>
              Bienvenido, {user.email}!
            </span>
            <input
              type="text"
              placeholder="Buscar juegos..."
              onChange={handleSearch}
              className="buscar-input"
            />
            <button className="register-btn" onClick={handleLogout}>
              Cerrar Sesión
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
        <aside className="sidebar">
          <h3>Categorías</h3>
          <ul>
            <li>Acción</li>
            <li>Aventura</li>
            <li>RPG</li>
            <li>Deportes</li>
            <li>Simulación</li>
            <li>Shooter</li>
            <li>Lucha</li>
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
                <li key={index}>
                  {game.name} - {game.category} (${game.price})
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