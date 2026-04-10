import React, { useState } from 'react';
import {
  Plus, Search, MoreHorizontal, TrendingUp, TrendingDown,
  DollarSign, Handshake, Clock, CheckCircle2, X, ChevronDown
} from 'lucide-react';
import { useDeals } from '../context/DealsContext';

const stageOptions = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
const stages = ['All', ...stageOptions];

const stageStyle: Record<string, string> = {
  Lead: 'bg-orange-500/10 text-orange-300 ring-orange-500/20',
  Qualified: 'bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/20',
  Proposal: 'bg-blue-500/10 text-blue-300 ring-blue-500/20',
  Negotiation: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  'Closed Won': 'bg-teal-500/10 text-teal-300 ring-teal-500/20',
  'Closed Lost': 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
};

const ownerColors = [
  'bg-rose-500', 'bg-amber-500', 'bg-pink-500', 'bg-orange-500',
  'bg-violet-500', 'bg-sky-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-emerald-500', 'bg-fuchsia-500',
];

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

const blank = { name: '', company: '', stage: 'Lead', value: '', owner: '', close: '', activity: 'just now' };

export default function DealsPage() {
  const { deals, addDeal } = useDeals();
  const [activeStage, setActiveStage] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalWon = deals.filter(d => d.stage === 'Closed Won').reduce((s, d) => s + d.value, 0);
  const totalOpen = deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const closedDeals = deals.filter(d => ['Closed Won', 'Closed Lost'].includes(d.stage));
  const winRate = closedDeals.length
    ? Math.round((deals.filter(d => d.stage === 'Closed Won').length / closedDeals.length) * 100)
    : 0;
  const openDeals = deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage));
  const avgDeal = openDeals.length ? Math.round(totalOpen / openDeals.length) : 0;

  const stats = [
    { label: 'Open Pipeline', value: fmt(totalOpen), sub: `${openDeals.length} deals`, icon: Handshake, trend: '+12%', up: true },
    { label: 'Closed Won', value: fmt(totalWon), sub: `${deals.filter(d => d.stage === 'Closed Won').length} deals`, icon: CheckCircle2, trend: '+8%', up: true },
    { label: 'Win Rate', value: `${winRate}%`, sub: 'last 90 days', icon: TrendingUp, trend: '+3%', up: true },
    { label: 'Avg Deal Size', value: fmt(avgDeal), sub: 'open deals', icon: DollarSign, trend: '-2%', up: false },
  ];

  const filtered = deals.filter(d => {
    const matchStage = activeStage === 'All' || d.stage === activeStage;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Deal name is required';
    if (!form.company.trim()) e.company = 'Company is required';
    if (!form.owner.trim()) e.owner = 'Owner is required';
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0)
      e.value = 'Enter a valid value';
    if (!form.close) e.close = 'Close date is required';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const color = ownerColors[deals.length % ownerColors.length];
    addDeal({
      name:       form.name.trim(),
      company:    form.company.trim(),
      value:      Number(form.value),
      stage:      form.stage,
      owner:      form.owner.trim(),
      ownerColor: color,
      close:      new Date(form.close).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      activity:   'just now',
    });
    setForm(blank);
    setErrors({});
    setShowModal(false);
  };

  const field = (key: keyof typeof form, label: string, placeholder: string, type = 'text') => (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
        placeholder={placeholder}
        className={`w-full bg-zinc-900 ring-1 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-white/20 transition-all ${errors[key] ? 'ring-red-500/50' : 'ring-white/8'}`}
      />
      {errors[key] && <p className="text-[11px] text-red-400 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans antialiased">
      <div className="px-10 py-8 max-w-[1400px] mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Deals</h1>
            <p className="text-zinc-500 mt-1 text-sm">Track and manage every opportunity in your pipeline.</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setForm(blank); setErrors({}); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeStage === s
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

      {/* New Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-zinc-950 ring-1 ring-white/10 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-base font-semibold text-white">New Deal</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Fill in the details to add a deal to your pipeline.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              {field('name', 'Deal Name', 'e.g. Acme Corp — Enterprise Plan')}
              {field('company', 'Company', 'e.g. Acme Corp')}

              {/* Stage dropdown */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Stage</label>
                <div className="relative">
                  <select
                    value={form.stage}
                    onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                    className="w-full appearance-none bg-zinc-900 ring-1 ring-white/8 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-white/20 transition-all pr-8"
                  >
                    {stageOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {field('value', 'Deal Value (₹)', 'e.g. 85000', 'number')}
              {field('owner', 'Owner', 'e.g. John D.')}
              {field('close', 'Close Date', '', 'date')}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 pb-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
