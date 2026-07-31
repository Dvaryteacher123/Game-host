import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../firebase/auth';
import toast from 'react-hot-toast';
import {
  FiHome,
  FiGrid,
  FiList,
  FiVideo,
  FiBell,
  FiUsers,
  FiStar,
  FiDownload,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/games', label: 'Games', icon: FiGrid },
    { path: '/admin/categories', label: 'Categories', icon: FiList },
    { path: '/admin/trailers', label: 'Trailers', icon: FiVideo },
    { path: '/admin/notifications', label: 'Notifications', icon: FiBell },
    { path: '/admin/users', label: 'Users', icon: FiUsers },
    { path: '/admin/reviews', label: 'Reviews', icon: FiStar },
    { path: '/admin/downloads', label: 'Downloads', icon: FiDownload },
    { path: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col">
      <div className="text-2xl font-bold text-purple-400 mb-8">DVARY ADMIN</div>
      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? 'bg-purple-600/30 text-purple-400' : 'hover:bg-white/5 text-white/70'
              }`
            }
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-4 py-2 text-white/70">
          <img src={user?.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full" />
          <span className="text-sm truncate">{user?.displayName || user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-white/5 text-red-400 transition"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
