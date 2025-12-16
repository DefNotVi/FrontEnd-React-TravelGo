import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Checkout from './Pago';

// Mock Cart
const mockResetCart = jest.fn();

jest.mock('../context/AppContext', () => ({
  useCart: () => ({
    cartItems: [{ id: 1, nombre: 'Paquete A', precio: 1000 }],
    cartCount: 1,
    resetCart: mockResetCart,
  }),
}));

// Mock fetch (flujo exitoso)
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true })
);

// Mock alert
global.alert = jest.fn();

describe('Reservas / Pago', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza items del carrito', () => {
    render(<Checkout />);

    expect(screen.getByText(/Paquete A/i)).toBeInTheDocument();
    expect(screen.getByText(/Total a Pagar/i)).toBeInTheDocument();
  });

  test('envío válido permite completar el formulario y resetea carrito', async () => {
    render(<Checkout />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: 'Sebastián' },
    });

    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: 'test@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/Tarjeta/i), {
      target: { value: '123456' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Pagar/i })
    );

    await waitFor(() => {
      expect(mockResetCart).toHaveBeenCalled();
    });
  });

});
