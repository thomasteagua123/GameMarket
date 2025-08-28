import { useEffect, useState } from "react";

export function Plataformas() {
  const [platform, setPlatform] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/platform")  // ruta de Flask
      .then((res) => res.json())
      .then((data) => setPlatform(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Plataformas</h1>
    </div>
  );
}


