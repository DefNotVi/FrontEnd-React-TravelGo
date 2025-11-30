// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// 🚨 CORRECCIÓN 1: Asegura la exportación de useAuth
export const useAuth = () => {
  return useContext(AuthContext);
};

// Función auxiliar para decodificar JWT (no necesitas una librería para esto)
const decodeJwt = (token) => {
    if (!token) return null;
    try {
        // La parte central (payload) es la segunda parte (índice 1) separada por puntos.
        // BTOA (Base64 to ASCII) decodifica Base64.
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Función polyfill para atob y btoa en entornos React más estrictos
        const atobPolyfill = (str) => Buffer.from(str, 'base64').toString('binary');

        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
        
    } catch (e) {
        // Ignoramos el error si el token es nulo o inválido, devolviendo null
        return null;
    }
};


// 🚨 CORRECCIÓN 2: Asegura la exportación de AuthProvider
export const AuthProvider = ({ children }) => {
  
    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };
    
  // Estado inicial: Intentar leer el usuario de localStorage y decodificar el token
  const [user, setUser] = useState(() => {
    try {
      const storedData = localStorage.getItem('currentUser');
      if (storedData) {
        const data = JSON.parse(storedData);
                const { token } = data; // Asumimos que data es { token: "..." }
        const claims = decodeJwt(token); 
        if (claims) {
                    // Retornamos los claims (email, rol, etc.) y el token para el estado
          return { ...claims, token: token }; 
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const isLoggedIn = !!user;

  const login = (authResponse) => {
        // authResponse es el objeto del backend: { token: "..." }
    const { token } = authResponse; 
    const claims = decodeJwt(token);

    if (claims) {
            const userData = { ...claims, token: token };
      setUser(userData);
            // Guardamos el objeto completo del usuario (claims + token) en localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData)); 
    } else {
            logout();
        }
  };

  const value = { user, isLoggedIn, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};