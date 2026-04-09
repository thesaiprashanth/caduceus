import React, { useState } from 'react';
import {
  Plus, Search, MoreHorizontal, TrendingUp, TrendingDown,
  DollarSign, Handshake, Clock, CheckCircle2, XCircle, ChevronDown
} from 'lucide-react';

const stages = ['All', 'Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const stageStyle: Record<string, string> = {
  Lead:         'bg-orange-500/10 text-orange-300 ring-orange-500/20',
  Qualified:    'bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/20',
  Proposal:     'bg-blue-500/10 text-blue-300 ring-blue-500/20',
  Negotiation:  'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  'Closed Won': 'bg-teal-500/10 text-teal-300 ring-teal-500/20',
  'Closed Lost':'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
};

const deals = [
  { id: 1, name: 'Mulders Tech — Q3 License',     company: 'Mulders Tech',    value: 145000, stage: 'Negotiation',  owner: 'Fleur Z.',   ownerColor: 'bg-rose-500',   close: 'Aug 12, 2025', activity: '2h ago' },
  { id: 2, name: 'Acme Corp — Platform Upgrade',  company: 'Acme Corp',       value: 82000,  stage: 'Closed Won',   owner: 'Oliver B.',  ownerColor: 'bg-amber-500',  close: 'Jul 28, 2025', activity: '1d ago' },
  { id: 3, name: 'Kinetic Labs — Growth Pack',    company: 'Kinetic Labs',     value: 96500,  stage: 'Proposal',     owner: 'Ethan W.',   ownerColor: 'bg-pink-500',   close: 'Sep 5, 2025',  activity: '3h ago' },
  { id: 4, name: 'Nordlane — Starter Bundle',     company: 'Nordlane',         value: 31000,  stage: 'Qualified',    owner: 'Leo P.',     ownerColor: 'bg-orange-500', close: 'Sep 20, 2025', activity: '5h ago' },
  { id: 5, name: 'Orion Systems — Enterprise',    company: 'Orion Systems',    value: 210000, stage: 'Lead',         owner: 'Alistair C.',ownerColor: 'bg-violet-500', close: 'Oct 1, 2025',  activity: '1h ago' },
  { id: 6, name: 'Vertex AI — Analytics Suite',   company: 'Vertex AI',        value: 68000,  stage: 'Negotiation',  owner: 'Sara M.',    ownerColor: 'bg-sky-500',    close: 'Aug 30, 2025', activity: '30m ago'},
  { id: 7, name: 'Pulse Media — Ads Package',     company: 'Pulse Media',      value: 44000,  stage: 'Closed Lost',  owner: 'Jamie R.',   ownerColor: 'bg-indigo-500', close: 'Jul 10, 2025', activity: '2d ago' },
  { id: 8, name: 'BrightPath — CRM Rollout',      company: 'BrightPath',       value: 128000, stage: 'Proposal',     owner: 'Nina K.',    ownerColor: 'bg-teal-500',   close: 'Sep 14, 2025', activity: '4h ago' },
];

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

const totalWon   = deals.filter(d => d.stage === 'Closed Won').reduce((s, d) => s + d.value, 0);
const totalOpen  = deals.filter(d => !['Closed Won','Closed Lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);
const winRate    = Math.round((deals.filter(d => d.stage === 'Closed Won').length /
                   deals.filter(d => ['Closed Won','Closed Lost'].includes(d.stage)).length) * 100);

const stats = [
  { label: 'Open Pipeline',  value: fmt(totalOpen),  sub: `${deals.filter(d => !['Closed Won','Closed Lost'].includes(d.stage)).length} deals`, icon: Handshake,    trend: '+12%', up: true  },
  { label: 'Closed Won',     value: fmt(totalWon),   sub: `${deals.filter(d => d.stage === 'Closed Won').length} deals`,   icon: CheckCircle2, trend: '+8%',  up: true  },
  { label: 'Win Rate',       value: `${winRate}%`,   sub: 'last 90 days',        icon: TrendingUp,   trend: '+3%',  up: true  },
  { label: 'Avg Deal Size',  value: fmt(Math.round(totalOpen / deals.filter(d => !['Closed Won','Closed Lost'].includes(d.stage)).length)), sub: 'open deals', icon: DollarSign, trend: '-2%', up: false },
];

export default function DealsPage() {
  const [activeStage, setActiveStage] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = deals.filter(d => {
    const matchStage = activeStage === 'All' || d.stage === activeStage;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.company.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans antialiased">
      <div className="px-10 py-8 max-w-[1400px] mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Deals</h1>
            <p className="text-zinc-500 mt-1 text-sm">Track and manage every opportunity in your pipeline.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, trend, up }) => (
            <div key={label} className="rounded-xl bg-zinc-900/40 ring-1 ring-white/5 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500">{label}</span>
                <Icon className="w-4 h-4 text-zinc-600" strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-500">{sub}</span>
                <span className={`ml-auto text-[11px] font-medium flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-8 flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search deals…"
              className="pl-9 pr-4 py-2 text-sm bg-zinc-900/60 ring-1 ring-white/8 rounded-lg text-zinc-200 placeholder-zinc-600 outline-none focus:ring-white/15 transition-all w-56"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {stages.map(s => (
              <button
                key={s}
                onClick={() => setActiveStage(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeStage === s
                    ? 'bg-white/10 text-white ring-1 ring-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-zinc-600">{filtered.length} deal{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-xl ring-1 ring-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/40">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">Deal</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Value</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Close Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Activity</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map(deal => (
                <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-zinc-100 truncate max-w-[220px]">{deal.name}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{deal.company}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ring-1 ${stageStyle[deal.stage]}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-white tabular-nums">{fmt(deal.value)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full ${deal.ownerColor} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                        {deal.owner[0]}
                      </span>
                      <span className="text-zinc-400 text-xs">{deal.owner}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-400 text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      {deal.close}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 text-xs">{deal.activity}</td>
                  <td className="px-4 py-3.5">
                    <button className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-600 text-sm">
                    No deals match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
