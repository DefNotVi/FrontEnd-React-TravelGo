import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Home from '../pages/Home';
import Paquetes from '../pages/Paquetes';
import Cliente from '../pages/Cliente';
import Pago from '../pages/Pago'
import Reservas from '../pages/Reservas'
import Itinerario from '../pages/Itinerario'

function AppRoutes(){
    return (
        <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Cliente />} />
            <Route path="/paquetes" element={<Paquetes />} />
            <Route path="/cliente" element={<Cliente />} />
            <Route path="/pago" element={<Pago />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/itinerario/:id" element={<Itinerario />} />
        </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
