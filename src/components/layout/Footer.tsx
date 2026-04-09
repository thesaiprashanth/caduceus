import React from 'react';
import Logo from '../../Assets/Logo.jpeg';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 opacity-50">
          <img src={Logo} alt="Caduceus Logo" className="w-5 h-5 object-cover rounded" />
          <span className="text-sm font-bold tracking-tight">Caduceus CRM</span>
        </div>
        <p className="text-white/20 text-xs font-medium">
          © 2026 Caduceus AI CRM. Powered by Gemini 3.
        </p>
        <div className="flex gap-6 text-white/40 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
        </div>
      </div>
    </footer>
  );
}
