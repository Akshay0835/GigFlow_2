import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Moon, Sun, MonitorSmartphone, LogOut } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: 'Services', path: '/services', icon: <MonitorSmartphone className="w-5 h-5 mr-3" /> },
    { name: 'Team', path: '/team', icon: <Users className="w-5 h-5 mr-3" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-colors border-r border-gray-100 dark:border-gray-700">
        {/* Branding */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xl leading-none">G</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            GigFlow
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-8 z-10 transition-colors border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Workspace</h1>
          <div className="flex items-center space-x-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold shadow-md cursor-pointer hover:opacity-90 transition-opacity" title={user?.name}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
