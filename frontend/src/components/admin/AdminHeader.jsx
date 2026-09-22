import React from 'react';
import { Menu, ExternalLink, User } from 'lucide-react';
import { authService } from '../../services/authService';

export default function AdminHeader({ setMobileOpen }) {
  const user = authService.getUser();

  return (
    <header className="h-16 border-b border-pink-500/20 bg-[#160B28]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-purple-200 hover:text-white lg:hidden cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-sm font-semibold text-purple-200 hidden sm:block">
          Welcome back, <span className="text-white font-bold">{user?.name || 'Admin'}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/birthday/kavita-special"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/40 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <span>Live Demo Preview</span>
          <ExternalLink size={14} />
        </a>

        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
