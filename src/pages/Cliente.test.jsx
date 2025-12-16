import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 🔹 Mock VIRTUAL de react-router-dom
jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

// 🔹 Mock de AuthContext (CLAVE)
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

import Cliente from './Cliente.jsx';

describe('Cliente Component', () => {

  test('el componente se monta correctamente', () => {
    render(<Cliente />);

    expect(
      screen.getByRole('heading', { name: /iniciar sesión/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  test('muestra errores cuando el formulario se envía vacío', async () => {
    render(<Cliente />);

    await userEvent.click(
      screen.getByRole('button', { name: /iniciar sesión/i })
    );

    expect(
      await screen.findByText(/correo es obligatorio/i)
    ).toBeInTheDocument();
  });

});
