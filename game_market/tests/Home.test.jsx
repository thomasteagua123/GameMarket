import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomeClientes } from "../src/components/Home/HomeClientes.jsx";
import { useAuth } from "../src/context/AuthContext";
import { useGames } from "../src/hooks/useGames";

jest.mock("../src/context/AuthContext");
jest.mock("../src/hooks/useGames");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("HomeClientes Component", () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();
  const mockUser = { email: "test@example.com" };
  const mockGames = [
    { id: 1, nombre: "Juego 1", categoria: "Acción", precio: 10 },
    { id: 2, nombre: "Juego 2", categoria: "Aventura", precio: 20 },
  ];

  const renderHome = () =>
    render(
      <MemoryRouter>
        <HomeClientes />
      </MemoryRouter>
    );

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    useGames.mockReturnValue(mockGames);
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente el título y elementos principales", () => {
    renderHome();
    expect(screen.getByText(/Lista de Juegos/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Bienvenido, test@example.com/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar juegos/i)).toBeInTheDocument();
  });

  it("muestra las opciones del menú de categorías", () => {
    renderHome();
    expect(screen.getByText(/Acción/i)).toBeInTheDocument();
    expect(screen.getByText(/Aventura/i)).toBeInTheDocument();
    expect(screen.getByText(/RPG/i)).toBeInTheDocument();
    expect(screen.getByText(/Deportes/i)).toBeInTheDocument();
  });

  it("filtra juegos al buscar", () => {
    renderHome();
    const searchInput = screen.getByPlaceholderText(/Buscar juegos/i);
    fireEvent.change(searchInput, { target: { value: "Acción" } });

    expect(screen.getByText(/Juego 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Juego 2/i)).not.toBeInTheDocument();
  });

  it("agrega un juego al carrito y actualiza el contador", () => {
    renderHome();
    const addButton = screen.getAllByRole("button", { name: /agregar/i })[0];
    fireEvent.click(addButton);
    expect(screen.getByText(/Carrito: 1/i)).toBeInTheDocument();
  });

  it("maneja logout al hacer clic en Cerrar Sesión", () => {
    renderHome();
    const logoutButton = screen.getByRole("button", { name: /cerrar sesión/i });
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
