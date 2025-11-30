import AppRoutes from './app/routes';
import { AuthProvider } from './context/AuthContext';

function App(){ 
    // Envolvemos todo el contenido que necesita acceso al estado de autenticación
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;