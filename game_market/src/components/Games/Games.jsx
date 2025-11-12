import React, { useState } from "react";
import "./games.css";

export function Games({ filteredGames, handleAddToCart, games }) {
  const lista = filteredGames?.length > 0 ? filteredGames : games;

  // 🔹 Si no hay juegos disponibles, mostrar un mensaje
  if (!lista || lista.length === 0) {
    return <p>No hay juegos disponibles</p>;
  }

  // 🔹 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // juegos por página
  const totalPages = Math.ceil(lista?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = lista.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="games-container">
      <ul className="games-grid">
        {currentGames.map((game) => (
          <li key={game.id} className="game-item">
            {/* Imagen del juego */}
            <img
              src={
                game.img ||
                "https://via.placeholder.com/200x250?text=Sin+imagen"
              }
              alt={game.nombre}
            />

            {/* Contenedor de información */}
            <div className="game-info">
              <h3 className="game-title">{game.nombre}</h3>
              <p className="game-details">
                {game.categoria} - ${game.precio.toLocaleString()}
              </p>
              <button
                className="agregar-btn"
                onClick={() => handleAddToCart(game)}
              >
                Agregar al carrito
              </button>
            </div>
            <div className="popover">{game.information}</div>
          </li>
        ))}
      </ul>

      {/* 🔹 Controles de paginación */}
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ◀ Anterior
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
}
