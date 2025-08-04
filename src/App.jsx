import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trilhas from './pages/Trilhas';
import CriarTrilha from './pages/CriarTrilha';
import TrilhaDetalhes from './pages/TrilhaDetalhes';
import AulaPlayer from './pages/AulaPlayer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trilhas" 
              element={
                <ProtectedRoute>
                  <Trilhas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trilhas/criar" 
              element={
                <ProtectedRoute>
                  <CriarTrilha />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trilhas/:id" 
              element={
                <ProtectedRoute>
                  <TrilhaDetalhes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/aulas/:id" 
              element={
                <ProtectedRoute>
                  <AulaPlayer />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
