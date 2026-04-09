import React from 'react';
import { UserPlus, Target, Mail, Briefcase } from 'lucide-react';

export default function CRMInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-card p-6 border-l-4 border-brand-primary">
        <div className="flex items-center gap-3 mb-2 text-white/40">
          <UserPlus className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">New Leads</span>
        </div>
        <p className="text-2xl font-bold">1,284</p>
        <p className="text-[10px] text-green-400 font-bold mt-1">+12% this week</p>
      </div>
      <div className="glass-card p-6 border-l-4 border-brand-accent">
        <div className="flex items-center gap-3 mb-2 text-white/40">
          <Target className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Conversion Rate</span>
        </div>
        <p className="text-2xl font-bold">3.2%</p>
        <p className="text-[10px] text-brand-primary font-bold mt-1">Target: 5.0%</p>
      </div>
      <div className="glass-card p-6 border-l-4 border-brand-secondary">
        <div className="flex items-center gap-3 mb-2 text-white/40">
          <Mail className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Active Outreach</span>
        </div>
        <p className="text-2xl font-bold">432</p>
        <p className="text-[10px] text-white/40 font-bold mt-1">Automated sequences</p>
      </div>
      <div className="glass-card p-6 border-l-4 border-white/20">
        <div className="flex items-center gap-3 mb-2 text-white/40">
          <Briefcase className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Pipeline Value</span>
        </div>
        <p className="text-2xl font-bold">$12.4K</p>
        <p className="text-[10px] text-white/40 font-bold mt-1">Estimated monthly</p>
      </div>
    </div>
  );
}
