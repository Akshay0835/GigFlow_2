import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Moon, Sun, MonitorSmartphone, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Services', path: '/services', icon: <MonitorSmartphone className="w-5 h-5" /> },
    { name: 'Team', path: '/team', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative z-50 lg:z-20 h-full ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${
          isSidebarMinimized ? 'lg:w-20' : 'lg:w-72'
        } bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200/50 dark:border-gray-800/50`}
      >
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
          className="hidden lg:flex absolute -right-4 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-md text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all hover:scale-110 z-30 items-center justify-center w-8 h-8"
        >
          {isSidebarMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-6 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Branding */}
        <div className="h-24 flex items-center px-6 border-b border-gray-100 dark:border-gray-800/50 transition-all">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <span className="text-white font-bold text-xl leading-none">G</span>
          </div>
          {(!isSidebarMinimized || isMobileOpen) && (
            <span className="ml-3.5 text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-100 dark:to-gray-300 animate-in fade-in duration-300">
              GigFlow
            </span>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={
                  `group relative flex items-center ${isSidebarMinimized && !isMobileOpen ? 'justify-center w-12 h-12 mx-auto px-0' : 'px-4 py-3.5'} rounded-2xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 shadow-md shadow-blue-500/20 text-white dark:bg-blue-500 dark:shadow-blue-500/10'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50/80 dark:hover:bg-gray-800/60 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-blue-400'} transition-colors`}>
                  {item.icon}
                </div>
                {(!isSidebarMinimized || isMobileOpen) && (
                  <span className="ml-3.5 animate-in fade-in slide-in-from-left-2 duration-300">{item.name}</span>
                )}
                
                {/* Sleek Tooltip for minimized state (desktop only) */}
                {(isSidebarMinimized && !isMobileOpen) && (
                  <div className="hidden lg:block absolute left-full ml-4 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                    {item.name}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45 rounded-sm"></div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 transition-colors border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="mr-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white capitalize tracking-tight truncate max-w-[150px] sm:max-w-xs">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-5">
            <button
              onClick={handleThemeToggle}
              className="p-2 sm:p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <div className="flex items-center space-x-2 sm:space-x-3 border-l border-gray-200 dark:border-gray-700 pl-2 sm:pl-5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:shadow-lg hover:opacity-90 transition-all border-2 border-white dark:border-gray-800 text-sm sm:text-base" title={user?.name}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-0 sm:mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
