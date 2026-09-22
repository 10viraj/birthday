import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PartyPopper, 
  PlusCircle, 
  Image as ImageIcon, 
  Compass, 
  MessageSquare, 
  Palette, 
  Settings, 
  LogOut,
  Cake
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/birthdays', label: 'Birthday Pages', icon: PartyPopper },
    { to: '/admin/birthdays/create', label: 'Create Birthday', icon: PlusCircle },
    { to: '/admin/gallery', label: 'Photo Gallery', icon: ImageIcon },
    { to: '/admin/memories', label: 'Memory Timeline', icon: Compass },
    { to: '/admin/wishes', label: 'Birthday Wishes', icon: MessageSquare },
    { to: '/admin/themes', label: 'Themes & Colors', icon: Palette },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#160B28] border-r border-pink-500/20 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo Header */}
        <div className="p-6 border-b border-pink-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-lg">
            <Cake size={22} />
          </div>
          <div>
            <h2 className="font-serif-display font-bold text-lg text-white leading-none">Birthday Bliss</h2>
            <span className="text-[10px] text-pink-400 font-semibold uppercase tracking-widest">Admin Suite</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white border border-pink-500/40 shadow-md'
                      : 'text-purple-200/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={18} className="text-pink-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-pink-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
