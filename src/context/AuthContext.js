// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Función auxiliar para decodificar JWT
const decodeJwt = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Usar atob nativo si está disponible, si no, usa un polyfill/fallback
        const decoded = typeof window !== 'undefined' && window.atob ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary');

        const jsonPayload = decodeURIComponent(decoded.split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
        
    } catch (e) {
        // console.error("Error decodificando JWT:", e); // Descomentar para debug
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    //    Estados iniciales. user: null, isLoggedIn: false, isLoadingInitial: TRUE
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true); // Carga inicial

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('currentUser');
    };

    const login = (authResponse) => {
        const { token } = authResponse; 
        const claims = decodeJwt(token);

        if (claims) {
            const userData = { ...claims, token: token };
            setUser(userData);
            setIsLoggedIn(true);
            localStorage.setItem('currentUser', JSON.stringify(userData)); 
        } else {
            logout();
        }
    };
    
    //      useEffect para cargar la sesión, estableciendo isLoadingInitial al final
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('currentUser');
            if (storedData) {
                const data = JSON.parse(storedData);
                const { token } = data;
                const claims = decodeJwt(token); 
                
                if (claims) {
                    // Si el token es válido y no expirado, establece el usuario
                    const userData = { ...claims, token: token };
                    setUser(userData);
                    setIsLoggedIn(true);
                } else {
                    // Token inválido o expirado, lo limpiamos.
                    localStorage.removeItem('currentUser');
                }
            }
        } catch (e) {
            console.error("Error al cargar la sesión inicial:", e);
            localStorage.removeItem('currentUser');
        } finally {
            //    Una vez que la verificación de localStorage ha terminado, 
            //    establecemos isLoadingInitial a false.
            setIsLoadingInitial(false);
        }
    }, []); // Se ejecuta solo al montar

    //    Si la carga inicial aún no ha terminado, mostramos algo o simplemente esperamos
    //    Si devolvemos null, la aplicación principal no se renderizará hasta que termine.
    if (isLoadingInitial) {
        return null; // Oculta todo hasta que el estado sea definido.
    }


    const value = { user, isLoggedIn, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Asegura la exportación de useAuth
export const useAuth = () => {
    return useContext(AuthContext);
};