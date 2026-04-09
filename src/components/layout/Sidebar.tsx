import React from 'react';
import {
  Search, Bot, Users, Building2, HelpCircle,
  Bell, Handshake, LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Logo from '../../Assets/Logo.jpeg';

const navItems = [
  { icon: Bot, label: 'Home', path: '/' },
  { icon: Bot, label: 'Agents', path: '/agents' },
  { icon: Users, label: 'Conversations', path: '/chatbot' },
  { icon: Handshake, label: 'Deals', path: '/deals' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Building2, label: 'CRM', path: '/crm-dashboard' },
  { icon: HelpCircle, label: 'Help Center', path: '/help-center' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <aside className="w-60 shrink-0 bg-zinc-950 border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
          <img src={Logo} alt="Caduceus" className="w-full h-full object-cover" />
        </div>
        <button className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500">
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 mt-1">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-b from-amber-900/40 to-amber-950/30 ring-1 ring-amber-700/30 text-amber-100 text-sm font-medium shadow-inner">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          Ask Copilot
        </button>
      </div>

      <nav className="px-2 mt-4 space-y-0.5 flex-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              to={path}
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-white/5 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="w-[16px] h-[16px]" strokeWidth={1.75} />
              <span className="flex-1 text-left">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]">
          <span className="w-4 h-4 rounded-full bg-amber-500/80" />
          Support
        </button>
      </div>
      <div className="border-t border-white/5 px-3 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">S</div>
        <span className="text-sm text-zinc-300 flex-1">A D Suriya</span>
        <button
          onClick={handleLogout}
          className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
