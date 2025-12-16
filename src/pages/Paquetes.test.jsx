import React from 'react';

/* =====================
   🔑 MOCK REACT ROUTER (OBLIGATORIO)
===================== */
jest.mock(
  'react-router-dom',
  () => ({
    Link: ({ children }) => <span>{children}</span>,
  }),
  { virtual: true }
);

/* =====================
   FETCH GLOBAL
===================== */
global.fetch = jest.fn();

/* =====================
   MOCKS CONTEXT
===================== */

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: true,
    user: {
      id: 1,
      nombre: 'Usuario Test',
      token: 'fake-jwt-token',
    },
  }),
}));

const mockAddToCart = jest.fn();
jest.mock('../context/AppContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
}));

/* =====================
   IMPORTS
===================== */

import { render, screen, fireEvent } from '@testing-library/react';
import Paquetes from './Paquetes';

/* =====================
   FETCH MOCK
===================== */

beforeEach(() => {
  mockAddToCart.mockClear();

  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [
      {
        id: 1,
        nombre: 'Paquete A',
        categoria: '1 a 2 horas',
        precio: 1000,
      },
    ],
  });
});

/* =====================
   TESTS
===================== */

describe('Componente Paquetes', () => {

  test('muestra el título', async () => {
    render(<Paquetes />);
    expect(await screen.findByText(/travel go/i)).toBeInTheDocument();
  });

  test('renderiza el botón Agregar', async () => {
    render(<Paquetes />);
    const boton = await screen.findByRole('button', { name: /agregar/i });
    expect(boton).toBeInTheDocument();
  });

  test('click en Agregar llama a addToCart', async () => {
    render(<Paquetes />);
    const boton = await screen.findByRole('button', { name: /agregar/i });
    fireEvent.click(boton);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });

});
