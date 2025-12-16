import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from './Pago';

// Mock del contexto
const mockResetCart = jest.fn();

jest.mock('../context/AppContext', () => ({
  useCart: () => ({
    cartItems: [{ id: 1, precio: 1000 }],
    cartCount: 1,
    resetCart: mockResetCart,
  }),
}));

// Mock fetch exitoso
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true })
);

// Mock alert
global.alert = jest.fn();

describe('Checkout Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('el componente Checkout se monta correctamente', () => {
    render(<Checkout />);

    // Verifica el título con el número de ítem
    expect(screen.getByRole('heading', { name: /Realizar Pago \(1 ítem\)/i })).toBeInTheDocument();

    // Verifica que el total a pagar esté presente
    expect(screen.getByText(/Total a Pagar/i)).toBeInTheDocument();

    // Verifica que el botón de pago esté presente
    expect(screen.getByRole('button', { name: /Pagar y Finalizar Compra/i })).toBeInTheDocument();
  });

  test('muestra errores cuando el formulario se envía vacío', async () => {
    render(<Checkout />);

    // Simula el click en el botón de pagar sin rellenar los campos
    await userEvent.click(screen.getByRole('button', { name: /Pagar y Finalizar Compra/i }));

    // Verifica que se muestren los errores en los campos
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/El nombre es obligatorio/i);
    expect(alert).toHaveTextContent(/El correo es obligatorio/i);
    expect(alert).toHaveTextContent(/La tarjeta es obligatoria/i);
  });

  test('envío válido resetea el carrito y muestra alerta', async () => {
    render(<Checkout />);

    // Rellenar formulario con datos válidos
    await userEvent.type(screen.getByLabelText(/Nombre/i), 'Sebastián');
    await userEvent.type(screen.getByLabelText(/Correo/i), 'test@email.com');
    await userEvent.type(screen.getByLabelText(/Tarjeta/i), '123456');

    // Simula el click en el botón de pagar
    await userEvent.click(screen.getByRole('button', { name: /Pagar y Finalizar Compra/i }));

    // Verifica que la alerta haya sido mostrada
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Pago exitoso!');
    });

    // Verifica que el carrito haya sido reseteado
    expect(mockResetCart).toHaveBeenCalled();
  });

});
