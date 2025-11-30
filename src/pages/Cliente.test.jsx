import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './Cliente.jsx'; // asegúrate de que el archivo sea Cliente.jsx

describe('Cliente Component', () => {
    
    test('el componente se monta correctamente', () => {
        render(<Contact />);

        // Verifica el título correcto
        const titulo = screen.getByRole('heading', { name: /registrar cliente/i });
        expect(titulo).toBeInTheDocument();

        // Verifica los campos del formulario existentes
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();

        // Y que el botón de enviar esté presente
        expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
    });

    test('muestra errores cuando el formulario se envía vacío', async () => {
        render(<Contact />);

        // Clic en "Enviar" sin llenar nada
        const enviarBtn = screen.getByRole('button', { name: /enviar/i });
        await userEvent.click(enviarBtn);

        // Espera los mensajes de error que sí existen
        expect(await screen.findByText(/El nombre es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/El correo es obligatorio y debe ser válido/i)).toBeInTheDocument();

        // No debe mostrar el mensaje de éxito
        expect(screen.queryByText(/registrado/i)).not.toBeInTheDocument();
    });
    
    test('envío válido ejecuta registro correctamente', async () => {
        render(<Contact />);

        // Simula llenar los campos válidos
        await userEvent.type(screen.getByLabelText(/nombre/i), 'Ada Lovelace');
        await userEvent.type(screen.getByLabelText(/correo/i), 'ada@example.com');

        // Simula click en Enviar
        const enviarBtn = screen.getByRole('button', { name: /enviar/i });

        // Mock del alert para evitar que se detenga el test
        window.alert = jest.fn();

        await userEvent.click(enviarBtn);

        // Verifica que se haya llamado alert con el mensaje correcto
        expect(window.alert).toHaveBeenCalledWith('Registrado!');
    });
});
