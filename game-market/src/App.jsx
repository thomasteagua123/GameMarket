import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import { Plataformas } from "./components/Platform";
import { Home } from "./components/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/login" element={<Login />} /> {/* Página de Login */}
        <Route path="/plataformas" element={<Plataformas />} />{" "}
        {/* Ejemplo otra ruta */}
      </Routes>
    </Router>
  );
}

export default App;
