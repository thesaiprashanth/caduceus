import React from 'react';
import {
  Search, Bot, Users, Building2, HelpCircle,
  Bell, Handshake, LogOut, Home, GitMerge, Zap,
  BarChart3, Briefcase, Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Logo from '../../Assets/Logo.jpeg';

const navGroups = [
  {
    label: 'MAIN',
    items: [
      { icon: Home, label: 'Home', path: '/' },
      { icon: BarChart3, label: 'CRM Dashboard', path: '/crm-dashboard' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { icon: Users, label: 'Conversations', path: '/chatbot' },
      { icon: Handshake, label: 'Deals', path: '/deals' },
      { icon: Sparkles, label: 'Recommendations', path: '/notifications' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { icon: HelpCircle, label: 'Help Center', path: '/help-center' },
    ],
  },
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
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-white/10 shrink-0">
            <img src={Logo} alt="Caduceus" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Caduceus CRM</span>
        </div>
        <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500">
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="px-2 mt-4 flex-1 overflow-y-auto space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ icon: Icon, label, path }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    to={path}
                    key={label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                      ? 'bg-white/5 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                  >
                    <Icon className="w-[16px] h-[16px] shrink-0" strokeWidth={1.75} />
                    <span className="flex-1 text-left">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User row */}
      <div className="border-t border-white/5 px-3 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200 shrink-0">S</div>
        <span className="text-sm text-zinc-300 flex-1 truncate">Sai</span>
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
