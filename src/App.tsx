import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/common/AdminRoute';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import GameDetailsPage from './pages/GameDetailsPage';
import SearchPage from './pages/SearchPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Games from './pages/admin/Games';
import Categories from './pages/admin/Categories';
import Trailers from './pages/admin/Trailers';
import Notifications from './pages/admin/Notifications';
import Users from './pages/admin/Users';
import Reviews from './pages/admin/Reviews';

// Layout
import Layout from './components/public/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes (protected) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/games" element={<Games />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/trailers" element={<Trailers />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/reviews" element={<Reviews />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
