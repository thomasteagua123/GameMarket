import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Games } from "../../src/components/Games/Games.jsx";

describe("Componente Games", () => {
  // 🧩 TEST 2: Muestra juegos si existen
  it("muestra una lista de juegos si existen", () => {
    const mockGames = [
      { id: 1, nombre: "Among Us", categoria: "Party", precio: 2200 },
      { id: 2, nombre: "Max Payne 3", categoria: "Acción", precio: 3500 },
    ];

    render(<Games games={mockGames} />);

    expect(screen.getByText(/among us/i)).toBeInTheDocument();
    expect(screen.getByText(/max payne 3/i)).toBeInTheDocument();
  });

  // 🧩 TEST 3: Muestra mensaje si no hay juegos
  it("muestra un mensaje si no hay juegos disponibles", () => {
    render(<Games games={[]} />);
    const mensaje = screen.getByText(/no hay juegos disponibles/i);
    expect(mensaje).toBeInTheDocument();
  });

  // 🧩 TEST 4: No renderiza juegos si la lista está vacía
  it("no renderiza juegos si la lista está vacía", () => {
  render(<Games games={[]} />);

  // Verificar que la lista no se renderiza
  const lista = screen.queryByRole("list");
  expect(lista).toBeNull(); // Asegura que no existe la lista

  // Verificar que el mensaje "No hay juegos disponibles" esté presente
  const mensaje = screen.getByText(/no hay juegos disponibles/i);
  expect(mensaje).toBeInTheDocument();
});


  // 🧩 TEST 5: Llama a handleAddToCart al hacer clic en 'Agregar al carrito'
  it("llama a handleAddToCart al hacer clic en 'Agregar al carrito'", async () => {
    const user = userEvent.setup();
    const mockGames = [
      { id: 1, nombre: "Among Us", categoria: "Party", precio: 2200 },
    ];
    const mockHandleAdd = vi.fn(); // spy function

    render(<Games games={mockGames} handleAddToCart={mockHandleAdd} />);

    const boton = screen.getByRole("button", { name: /agregar al carrito/i });
    await user.click(boton);

    expect(mockHandleAdd).toHaveBeenCalledTimes(1);
    expect(mockHandleAdd).toHaveBeenCalledWith(mockGames[0]);
  });

  // 🧩 TEST 6: Cambia de página al hacer clic en 'Siguiente ▶'
  it("cambia de página al hacer clic en 'Siguiente ▶'", async () => {
    const user = userEvent.setup();

    const games = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      nombre: `Juego ${i + 1}`,
      categoria: "Acción",
      precio: 1000,
    }));

    render(<Games games={games} />);

    // Verificamos que aparece el primer juego en la página 1
    expect(
      screen.getByRole("heading", { name: /^juego 1$/i })

    ).toBeInTheDocument();

    const botonSiguiente = screen.getByRole("button", { name: /siguiente/i });
    await user.click(botonSiguiente);

    // Verificamos que al cambiar de página aparece "Juego 11"
    expect(
      screen.getByRole("heading", { name: /juego 11/i })
    ).toBeInTheDocument();
  });
});
