import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from './Pago';

// Mock del contexto
const mockResetCart = jest.fn();
jest.mock('../context/AppContext', () => ({
  useCart: () => ({
    cartItems: [{ id: 1, name: 'Producto 1' }],
    cartCount: 1,
    resetCart: mockResetCart,
  }),
}));

// Mock de alert
global.alert = jest.fn();

describe('Checkout Component', () => {

    test('el componente Checkout se monta correctamente', () => {
        render(<Checkout />);

        // Comprueba que el título muestre el número de ítems
        const titulo = screen.getByRole('heading', { name: /Realizar Pago \(1 ítem\)/i });
        expect(titulo).toBeInTheDocument();

        // Comprueba que se muestren los productos del carrito
        expect(screen.getByText(/Producto 1/i)).toBeInTheDocument();

        // Y que el botón de pago esté presente
        expect(screen.getByRole('button', { name: /Pagar y Finalizar Compra/i })).toBeInTheDocument();
    });

    test('muestra errores cuando el formulario se envía vacío', async () => {
        render(<Checkout />);

        // Click en "Pagar y Finalizar Compra" sin rellenar el formulario
        const pagarBtn = screen.getByRole('button', { name: /Pagar y Finalizar Compra/i });
        await userEvent.click(pagarBtn);

        expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/El correo es obligatorio y debe ser válido/i)).toBeInTheDocument();
    });

    test('envío válido resetea el carrito y muestra alerta', async () => {
        render(<Checkout />);

        // Completar formulario
        await userEvent.type(screen.getByLabelText(/Nombre/i), 'Sebastián');
        await userEvent.type(screen.getByLabelText(/Correo/i), 'test@email.com');

        // Click en el botón
        await userEvent.click(screen.getByRole('button', { name: /Pagar y Finalizar Compra/i }));

        expect(global.alert).toHaveBeenCalledWith('Pago exitoso!');
        expect(mockResetCart).toHaveBeenCalled();
    });

});
