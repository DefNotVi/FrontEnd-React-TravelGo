import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function AppProvider({ children }){
    // 💡 cartItems ahora es un array para guardar los items
    const [cartItems, setCartItems] = useState([]); 
    
    // El contador se calcula a partir de la longitud del array
    const cartCount = cartItems.length; 

    // Función para añadir un ítem
    const addToCart = (product) => { 
        // Almacena el objeto producto 
        setCartItems(currentItems => [...currentItems, product]);
    };
    
    // Función para resetear el carrito a un array vacío
    const resetCart = () => {
        setCartItems([]);
    };

    // Exportar los items y la nueva función resetCart (no como funciona pero lo hace klsdjñfsñd)
    const value = { cartCount, cartItems, addToCart, resetCart };
    
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(){
    const ctx = useContext(CartContext);
    if(!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
    return ctx;
}