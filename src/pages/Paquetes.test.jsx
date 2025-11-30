// src/pages/Paquetes.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Paquete from './Paquetes';
import { TRAVELING_DESTINATION } from '../data/Travel.mock';

// Mock del contexto
jest.mock('../context/AppContext', () => {
  const addToCartMock = jest.fn();
  return {
    useCart: () => ({
      addToCart: addToCartMock,
    }),
    __mocks: { addToCartMock }, // exportamos el mock para usarlo en los tests
  };
});

// Mocks de componentes
jest.mock('../components/paquetes/Filters', () => ({ options, onChange }) => (
  <div data-testid="filters">
    {options.map(opt => (
      <button key={opt} onClick={() => onChange(opt)}>
        {opt}
      </button>
    ))}
  </div>
));

jest.mock('../components/paquetes/ProductGrid', () => ({ items, onAdd }) => (
  <div data-testid="product-grid">
    {items.map(item => (
      <button key={item.id} onClick={() => onAdd(item)}>
        Agregar {item.name}
      </button>
    ))}
  </div>
));

describe('Componente Paquete', () => {
  let addToCartMock;

  beforeEach(() => {
    // Recuperamos el mock del módulo después de haberlo mockeado
    const context = require('../context/AppContext');
    addToCartMock = context.__mocks.addToCartMock;
    addToCartMock.mockClear(); // limpiamos antes de cada test
  });

  test('se monta correctamente y muestra el título', () => {
    render(<Paquete />);
    expect(screen.getByText(/Travel Go/i)).toBeInTheDocument();
    expect(screen.getByText(/Viajes por todo Chile/i)).toBeInTheDocument();
  });

  test('renderiza filtros y ProductGrid', () => {
    render(<Paquete />);
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
  });

  test('al hacer click en "Agregar" llama a addToCart', () => {
    render(<Paquete />);
    const firstButton = screen.getAllByRole('button', { name: /Agregar/i })[0];
    fireEvent.click(firstButton);

    expect(addToCartMock).toHaveBeenCalledTimes(1);
    expect(addToCartMock).toHaveBeenCalledWith(TRAVELING_DESTINATION[0]);
  });
});
