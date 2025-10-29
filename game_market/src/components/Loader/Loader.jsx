import React, { useEffect, useState } from "react";
import animacionInicio from "../assets/animaciondeinicio.mp4";

export default function Loader({ duration = 3500, onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <video
        src={animacionInicio}
        autoPlay
        muted
        playsInline
        style={{ width: "320px", borderRadius: "20px" }}
      />
    </div>
  );
}
