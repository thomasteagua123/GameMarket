import React, { useState } from "react";
import "./Buscar.css";
import { useNavigate } from "react-router-dom";

function Buscar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      // Aquí puedes navegar a una página de resultados de búsqueda
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="buscar-container">
      <form className="buscar-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="buscar-input"
        />
        <button type="submit" className="buscar-button">
          Buscar
        </button>
      </form>
      <div className="buscar-buttons">
        <button
          className="registrarse-button"
          onClick={() => navigate("/register")}
        >
          Registrarse
        </button>
        <button className="logout-button" onClick={() => navigate("/logout")}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Buscar;
