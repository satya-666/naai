import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SalonDetails from './pages/SalonDetails';
import UserDashboard from './pages/UserDashboard';
import BarberDashboard from './pages/BarberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components if they don't exist yet to prevent crash
const Placeholder = ({ title }) => <div className="p-10 text-xl text-center">{title} Page (Coming Soon)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans text-gray-900 bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/salon/:id" element={<SalonDetails />} />
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/barber-dashboard" element={<ProtectedRoute role="barber"><BarberDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
