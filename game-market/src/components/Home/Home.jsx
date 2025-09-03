import { useEffect, useState } from "react";
import './home.css'

export function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/games")  // ruta de Flask
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 class="title">Lista de Juegos</h1>
      <ol class="games-grid">
        {games.map((game, i) => (
          <li key={i}>
            {game.name} - {game.category} (${game.price})
          </li>
        ))}
      </ol>
      <div class = "categoria">
        <h2>categorias</h2>
      </div>
    </div>
  );
}


