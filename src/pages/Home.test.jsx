import { render, screen } from '@testing-library/react';
import Home from './Home';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isLoggedIn: false,
  }),
}));

describe('Home', () => {

  test('muestra mensaje por defecto cuando no está logueado', () => {
    render(<Home />);

    expect(screen.getByText(/Bienvenido a Travelgo/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver Paquetes Ahora/i)).toBeInTheDocument();
  });
});
