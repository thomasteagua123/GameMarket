import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";

import { AuthProvider, useAuth } from "../../src/context/AuthContext.jsx";
import axios from "axios";

// ✅ Mock de axios
vi.mock("axios");

// ✅ Componente auxiliar para probar el contexto
const MockComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <p>Usuario logueado: {user.email}</p>
          <button onClick={logout}>logout</button>
        </>
      ) : (
        <button onClick={() => login("testuser", "1234")}>login</button>
      )}
    </div>
  );
};


// 🔹 Componente auxiliar
const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="user">{user ? user.email : "no user"}</p>
      <button onClick={() => login("admin@test.com", "1234")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

describe("AuthContext con cookies simuladas", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // 👇 Evita el undefined.then del useEffect
    axios.get.mockResolvedValue({ data: {} });
  });

  it("restaura sesión si el backend devuelve usuario (cookie válida)", async () => {
    axios.get.mockResolvedValueOnce({
      data: { email: "admin@test.com", rol: "admin" },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem("user")).toContain("admin@test.com");
    });
  });

  it("no restaura sesión si cookie inválida", async () => {
    axios.get.mockRejectedValueOnce(new Error("Sin cookie"));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  it("realiza login correctamente", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, rol: "admin" },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("login").click();
    });

    expect(localStorage.getItem("user")).toContain("admin@test.com");
  });

  it("hace logout correctamente", async () => {
    axios.post.mockResolvedValueOnce({});
    localStorage.setItem("user", JSON.stringify({ email: "test", rol: "user" }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("logout").click();
    });

    expect(localStorage.getItem("user")).toBeNull();
  });
  
  it("mantiene la sesión después de recargar la página", async () => {
  axios.post.mockResolvedValueOnce({ data: { success: true, rol: "user" } });

  const { rerender } = render(
    <AuthProvider>
      <MockComponent />
    </AuthProvider>
  );

  // Simular login
  await act(async () => {
    screen.getByText("login").click();
  });

  // Esperar a que localStorage se actualice
  await waitFor(() => {
    expect(localStorage.getItem("user")).toBeTruthy();
  });

  // 🔄 Simular recarga (nuevo render)
  rerender(
    <AuthProvider>
      <MockComponent />
    </AuthProvider>
  );

  // Verificar persistencia
  expect(screen.getByText(/usuario logueado/i)).toBeInTheDocument();
});


});
