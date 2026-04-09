import React from 'react';
import { LogOut } from 'lucide-react';
import Logo from '../../Assets/Logo.jpeg';
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: User | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export default function Header({ user, handleLogin, handleLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
            <img src={Logo} alt="Caduceus Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Caduceus <span className="gradient-text">CRM</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link to="/chatbot" className="hover:text-white transition-colors">Chatbot</Link>
          <Link to="/crm-dashboard" className="hover:text-white transition-colors">CRM Dashboard</Link>
          <Link to="/lead-pipeline" className="hover:text-white transition-colors">Lead Pipeline</Link>
          <Link to="/automation" className="hover:text-white transition-colors">Automation</Link>
          <button className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            Enterprise
          </button>
          {user ? (
            <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-4">
              <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-white/20" referrerPolicy="no-referrer" />
              <span className="text-sm font-semibold">{user.displayName?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-red-400" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all ml-4">
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
