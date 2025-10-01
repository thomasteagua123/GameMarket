// src/components/Home/Categoria.jsx
import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import "./home.css"; // 👈 mismo estilo que Home

export function Categoria() {
  const { nombre } = useParams();
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.filter((game) =>
          game.category.toLowerCase().includes(nombre.toLowerCase())
        );
        setGames(filtrados);
      })
      .catch((err) => console.error(err));
  }, [nombre]);

  return (
    <div className="catalogo">
      <main>
        <h2 className="title">Juegos de {nombre}</h2>
        <button onClick={() => navigate("/homeClientes")}>
          Volver al Home
        </button>

        <ul className="games-grid">
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.game_id}>
                {game.name} - {game.category} (${game.price})
              </li>
            ))
          ) : (
            <p>No hay juegos en esta categoría</p>
          )}
        </ul>
      </main>
    </div>
  );
}
