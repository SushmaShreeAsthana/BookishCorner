import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/my-books', label: 'My Books', icon: BookOpen },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pl-64">
      {/* Sidebar navigation for desktop, bottom navigation for mobile */}
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="fixed inset-y-0 left-0 hidden md:flex flex-col w-64 bg-nettle text-cream border-r border-deathworldForest/20 p-6 shadow-md z-30">
        <div className="mb-10 mt-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-cream">
            Bookish Corner
          </h1>
          <p className="font-handwriting text-rejuvenate text-lg mt-1">Cozy Reading Nest</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? 'bg-cream text-nettle shadow-cozy font-bold scale-[1.02]'
                      : 'text-rejuvenate hover:bg-deathworldForest/30 hover:text-cream'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-deathworldForest/30 pt-4 flex flex-col gap-3">
          <div className="px-2">
            <p className="text-xs text-rejuvenate/70 uppercase tracking-wider font-semibold">Logged in as</p>
            <p className="text-sm font-semibold truncate text-cream">
              {user?.display_name || user?.username || 'Bibliophile'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rejuvenate hover:bg-red-950/20 hover:text-red-300 transition-all font-medium w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 flex items-center justify-between px-6 py-4 bg-nettle text-cream shadow-md z-30">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-cream">
            Bookish Corner
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-rejuvenate hover:bg-deathworldForest/30 hover:text-cream transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 md:px-12 py-6 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-nettle border-t border-deathworldForest/20 px-6 flex items-center justify-around shadow-lg z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${
                  isActive
                    ? 'text-cream font-bold scale-110'
                    : 'text-rejuvenate/70 hover:text-cream'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-wider uppercase">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
