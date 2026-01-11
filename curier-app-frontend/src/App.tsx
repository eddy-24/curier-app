import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientLayout from './components/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import ExpediereNoua from './pages/client/ExpediereNoua';
import Tracking from './pages/client/Tracking';
import Facturi from './pages/client/Facturi';
import Adrese from './pages/client/Adrese';
import OperatorLayout from './components/OperatorLayout';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import Comenzi from './pages/operator/Comenzi';
import Colete from './pages/operator/Colete';
import Curieri from './pages/operator/Curieri';
import ShipmentsQueuePage from './pages/operator/ShipmentsQueuePage';
import CurierLayout from './components/curier/CurierLayout';
import CurierDashboard from './pages/curier/CurierDashboard';
import PickupuriAzi from './pages/curier/PickupuriAzi';
import LivrariAzi from './pages/curier/LivrariAzi';
import ScanAWB from './pages/curier/ScanAWB';
import RambursPage from './pages/curier/RambursPage';
import ColetUpdate from './pages/curier/ColetUpdate';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Utilizatori from './pages/admin/Utilizatori';
import ServiciiTarife from './pages/admin/ServiciiTarife';
import RapoarteKPI from './pages/admin/RapoarteKPI';
import Configurari from './pages/admin/Configurari';
import ServicesCRUDPage from './pages/admin/ServicesCRUDPage';
import UsersCRUDPage from './pages/admin/UsersCRUDPage';
import './App.css';

function App() {
  const [, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Client Routes */}
        <Route path="/client/dashboard" element={<ClientLayout><ClientDashboard /></ClientLayout>} />
        <Route path="/client/expediere-noua" element={<ClientLayout><ExpediereNoua /></ClientLayout>} />
        <Route path="/client/tracking" element={<ClientLayout><Tracking /></ClientLayout>} />
        <Route path="/client/tracking/:codAwb" element={<ClientLayout><Tracking /></ClientLayout>} />
        <Route path="/client/facturi" element={<ClientLayout><Facturi /></ClientLayout>} />
        <Route path="/client/adrese" element={<ClientLayout><Adrese /></ClientLayout>} />

        {/* Operator Routes */}
        <Route path="/operator/dashboard" element={<OperatorLayout><OperatorDashboard /></OperatorLayout>} />
        <Route path="/operator/comenzi" element={<OperatorLayout><Comenzi /></OperatorLayout>} />
        <Route path="/operator/colete" element={<OperatorLayout><Colete /></OperatorLayout>} />
        <Route path="/operator/curieri" element={<OperatorLayout><Curieri /></OperatorLayout>} />
        <Route path="/operator/shipments" element={<OperatorLayout><ShipmentsQueuePage /></OperatorLayout>} />

        {/* Curier Routes (Desktop Layout) */}
        <Route path="/curier" element={<CurierLayout />}>
          <Route path="dashboard" element={<CurierDashboard />} />
          <Route path="pickups" element={<PickupuriAzi />} />
          <Route path="livrari" element={<LivrariAzi />} />
          <Route path="scan" element={<ScanAWB />} />
          <Route path="ramburs" element={<RambursPage />} />
          <Route path="colet/:coletId" element={<ColetUpdate />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="utilizatori" element={<Utilizatori />} />
          <Route path="servicii" element={<ServiciiTarife />} />
          <Route path="rapoarte" element={<RapoarteKPI />} />
          <Route path="configurari" element={<Configurari />} />
          <Route path="services-crud" element={<ServicesCRUDPage />} />
          <Route path="users-crud" element={<UsersCRUDPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
