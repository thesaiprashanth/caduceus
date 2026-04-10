import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/Logo.jpeg';
import {
  Search, PanelLeft, Activity, Bell, SlidersHorizontal,
  ArrowUpDown, Plus, MoreHorizontal, X, ChevronDown, Check
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useDeals } from '../context/DealsContext';

// ─── style maps ──────────────────────────────────────────────────────────────

const phaseColor: Record<string, string> = {
  Lead:          'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  Qualified:     'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/30',
  Proposal:      'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  Negotiation:   'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  'Closed Won':  'bg-teal-500/15 text-teal-300 ring-teal-500/30',
  'Closed Lost': 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30',
};

const dotGradient: Record<string, string> = {
  Lead:          'from-orange-400 to-red-500',
  Qualified:     'from-fuchsia-400 to-purple-600',
  Proposal:      'from-sky-400 to-blue-600',
  Negotiation:   'from-emerald-400 to-teal-500',
  'Closed Won':  'from-teal-400 to-emerald-600',
  'Closed Lost': 'from-zinc-300 to-zinc-500',
};

const stageOptions = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
const ownerColors  = ['bg-rose-500','bg-amber-500','bg-pink-500','bg-orange-500','bg-violet-500','bg-sky-500','bg-indigo-500','bg-teal-500','bg-emerald-500','bg-fuchsia-500'];

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

// ─── chart ────────────────────────────────────────────────────────────────────

const RANGE_DAYS:  Record<string, number> = { '7D': 7, '1M': 30, '3M': 90, '6M': 180 };
const RANGE_TICKS: Record<string, number> = { '7D': 7, '1M': 10, '3M': 9,  '6M': 6  };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-zinc-900/95 backdrop-blur ring-1 ring-white/10 px-3 py-2 text-xs shadow-2xl">
      <div className="text-zinc-400 mb-1.5">Day {label}</div>
      <div className="space-y-1 min-w-[140px]">
        {[['bg-emerald-400','Revenue'],['bg-sky-400','Deals'],['bg-amber-400','AI forecast']].map(([dot, name], idx) => (
          <div key={name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2"><span className={`w-1.5 h-1.5 rounded-full ${dot}`} /><span className="text-zinc-300">{name}</span></div>
            <span className="text-zinc-100 tabular-nums">{payload[idx]?.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── blank form ───────────────────────────────────────────────────────────────

const blank = { name: '', company: '', stage: 'Lead', value: '', owner: '', close: '' };

// ─── small dropdown hook ──────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return { open, setOpen, ref };
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CRMDashboardPage() {
  const navigate = useNavigate();
  const { deals, addDeal, chartData } = useDeals();

  // chart
  const [range, setRange] = useState('1M');

  // table controls
  const [search,      setSearch]      = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [sortBy,      setSortBy]      = useState<'none'|'value-desc'|'value-asc'|'company'|'close'>('none');

  // dropdowns
  const filterDD = useDropdown();
  const sortDD   = useDropdown();

  // new deal modal
  const [showModal, setShowModal] = useState(false);
  const [form,   setForm]   = useState(blank);
  const [errors, setErrors] = useState<Record<string,string>>({});

  // ── chart slice ────────────────────────────────────────────────────────────
  const days        = RANGE_DAYS[range] ?? 30;
  const visibleData = chartData.slice(-days).map((p, i) => ({ ...p, day: i + 1 }));
  const tickCount   = Math.min(RANGE_TICKS[range] ?? 10, visibleData.length);
  const xTicks      = Array.from({ length: tickCount }, (_, i) =>
    Math.round(1 + (i * (visibleData.length - 1)) / Math.max(tickCount - 1, 1))
  );

  // ── totals ─────────────────────────────────────────────────────────────────
  const totalRevenue = deals.filter(d => d.stage === 'Closed Won').reduce((s,d) => s + d.value, 0);

  // ── table data ─────────────────────────────────────────────────────────────
  let rows = [...deals];
  if (search)              rows = rows.filter(d => d.company.toLowerCase().includes(search.toLowerCase()) || d.owner.toLowerCase().includes(search.toLowerCase()));
  if (filterStage !== 'All') rows = rows.filter(d => d.stage === filterStage);
  if (sortBy === 'value-desc') rows.sort((a,b) => b.value - a.value);
  if (sortBy === 'value-asc')  rows.sort((a,b) => a.value - b.value);
  if (sortBy === 'company')    rows.sort((a,b) => a.company.localeCompare(b.company));
  if (sortBy === 'close')      rows.sort((a,b) => new Date(a.close).getTime() - new Date(b.close).getTime());

  // ── new deal form ──────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())    e.name    = 'Deal name is required';
    if (!form.company.trim()) e.company = 'Company is required';
    if (!form.owner.trim())   e.owner   = 'Owner is required';
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) e.value = 'Enter a valid value';
    if (!form.close)          e.close   = 'Close date is required';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    addDeal({
      name:       form.name.trim(),
      company:    form.company.trim(),
      value:      Number(form.value),
      stage:      form.stage,
      owner:      form.owner.trim(),
      ownerColor: ownerColors[deals.length % ownerColors.length],
      close:      new Date(form.close).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
      activity:   'just now',
    });
    setForm(blank); setErrors({}); setShowModal(false);
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

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans antialiased">
      {/* Top bar */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2 text-zinc-400">
          <PanelLeft className="w-4 h-4" />
          <img src={logo} alt="Caduceus" className="w-5 h-5 object-cover rounded" />
          <span className="text-sm">CRM</span>
        </div>
        <div className="flex items-center gap-5 text-zinc-400 text-sm">
          <button className="flex items-center gap-1.5 hover:text-zinc-200"><Activity className="w-4 h-4" />Activity Log</button>
          <button className="flex items-center gap-1.5 hover:text-zinc-200"><Bell className="w-4 h-4" />Required Actions</button>
        </div>
      </div>

      <div className="px-10 py-8 max-w-[1400px] mx-auto">
        <h1 className="text-[32px] font-semibold text-white tracking-tight">CRM</h1>
        <p className="text-zinc-500 mt-1.5 text-[15px]">Manage clients, track deals, and stay on top of every relationship.</p>

        {/* Tabs — Contacts removed; Deals navigates away */}
        <div className="mt-6 flex items-center gap-7 border-b border-white/5">
          {(['Clients', 'Deals'] as const).map(t => (
            <button
              key={t}
              onClick={() => t === 'Deals' ? navigate('/deals') : undefined}
              className={`pb-3 text-sm transition-colors relative ${t === 'Clients' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {t}
              {t === 'Clients' && <span className="absolute left-0 right-0 -bottom-px h-px bg-white" />}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="mt-6 rounded-xl bg-zinc-900/40 ring-1 ring-white/5 p-6">
          <div className="flex gap-10">
            <div className="shrink-0">
              <div className="text-sm text-zinc-500">Total revenue</div>
              <div className="text-[28px] font-semibold text-white tracking-tight mt-1">{fmt(totalRevenue || 82000)}</div>
              <div className="text-sm text-zinc-500 mt-5">Total deals</div>
              <div className="text-[28px] font-semibold text-white tracking-tight mt-1">{deals.length}</div>
              <div className="mt-8 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Revenue over time</div>
                <div className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" />Deals created</div>
                <div className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />AI revenue forecast</div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-end gap-1 mb-2">
                {['7D','1M','3M','6M'].map(r => (
                  <button key={r} onClick={() => setRange(r)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${range === r ? 'bg-white/10 text-white ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibleData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="day" stroke="#52525b" tick={{ fontSize:11, fill:'#71717a' }} tickLine={false} axisLine={false} ticks={xTicks} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke:'rgba(255,255,255,0.1)', strokeWidth:1 }} />
                    <Line type="monotone" dataKey="revenue"  stroke="#34d399" strokeWidth={1.75} dot={false} />
                    <Line type="monotone" dataKey="deals"    stroke="#38bdf8" strokeWidth={1.75} dot={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[15px] font-medium text-white">All clients</h2>
            <span className="text-sm text-zinc-500">{rows.length}</span>
          </div>
          <div className="flex items-center gap-2">

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-zinc-900/60 ring-1 ring-white/5 rounded-md pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 w-48 focus:outline-none focus:ring-white/15"
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative" ref={filterDD.ref}>
              <button
                onClick={() => { filterDD.setOpen(o => !o); sortDD.setOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ring-1 transition-colors ${filterStage !== 'All' ? 'bg-violet-500/10 text-violet-300 ring-violet-500/30' : 'text-zinc-300 bg-zinc-900/60 ring-white/5 hover:bg-zinc-800/60'}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter{filterStage !== 'All' ? `: ${filterStage}` : ''}
              </button>
              {filterDD.open && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-zinc-900 ring-1 ring-white/10 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden">
                  <p className="px-3 py-1 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">Stage</p>
                  {['All', ...stageOptions].map(s => (
                    <button
                      key={s}
                      onClick={() => { setFilterStage(s); filterDD.setOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 transition-colors"
                    >
                      {s}
                      {filterStage === s && <Check className="w-3 h-3 text-violet-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative" ref={sortDD.ref}>
              <button
                onClick={() => { sortDD.setOpen(o => !o); filterDD.setOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ring-1 transition-colors ${sortBy !== 'none' ? 'bg-violet-500/10 text-violet-300 ring-violet-500/30' : 'text-zinc-300 bg-zinc-900/60 ring-white/5 hover:bg-zinc-800/60'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort{sortBy !== 'none' ? ' ✓' : ''}
              </button>
              {sortDD.open && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-zinc-900 ring-1 ring-white/10 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden">
                  <p className="px-3 py-1 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">Sort by</p>
                  {([
                    ['none',       'Default'],
                    ['value-desc', 'Value — High to Low'],
                    ['value-asc',  'Value — Low to High'],
                    ['company',    'Company A → Z'],
                    ['close',      'Close Date'],
                  ] as [typeof sortBy, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key); sortDD.setOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 transition-colors"
                    >
                      {label}
                      {sortBy === key && <Check className="w-3 h-3 text-violet-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Deal */}
            <button
              onClick={() => { setShowModal(true); setForm(blank); setErrors({}); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-white/10 ring-1 ring-white/15 rounded-md hover:bg-white/15"
            >
              <Plus className="w-3.5 h-3.5" />Add Deal
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4">
          <div className="grid grid-cols-[24px_1.6fr_1fr_0.6fr_1fr_1.4fr_1.2fr_1.4fr_24px] gap-4 px-3 py-2 text-xs text-zinc-500 border-b border-white/5">
            <div /><div>Client</div><div>Phase</div><div>Deals</div>
            <div>Deal Value</div><div>Owner</div><div>Last activity</div><div>Close Date</div><div />
          </div>

          {rows.length === 0 && (
            <div className="py-14 text-center text-zinc-600 text-sm">No clients match your filters.</div>
          )}

          {rows.map(deal => (
            <div key={deal.id} className="grid grid-cols-[24px_1.6fr_1fr_0.6fr_1fr_1.4fr_1.2fr_1.4fr_24px] gap-4 px-3 py-3.5 items-center text-sm border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <input type="checkbox" className="w-3.5 h-3.5 rounded bg-zinc-800 border-zinc-700" />
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${dotGradient[deal.stage] ?? 'from-zinc-400 to-zinc-600'} ring-1 ring-white/10`} />
                <span className="text-zinc-100 truncate">{deal.company}</span>
              </div>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs ring-1 ${phaseColor[deal.stage] ?? 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30'}`}>
                  {deal.stage}
                </span>
              </div>
              <div className="text-zinc-300 tabular-nums">1</div>
              <div className="text-zinc-300 tabular-nums">{fmt(deal.value)}</div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${deal.ownerColor} ring-1 ring-white/10 flex items-center justify-center text-[10px] font-bold text-white`}>
                  {deal.owner[0]}
                </div>
                <span className="text-zinc-300">{deal.owner}</span>
              </div>
              <div className="text-zinc-400">{deal.activity}</div>
              <div className="text-zinc-500">{deal.close}</div>
              <button className="text-zinc-500 hover:text-zinc-300"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* New Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md mx-4 bg-zinc-950 ring-1 ring-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-base font-semibold text-white">New Deal</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Fill in the details to add a deal to your pipeline.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {field('name',    'Deal Name',      'e.g. Acme Corp — Enterprise Plan')}
              {field('company', 'Company',        'e.g. Acme Corp')}
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Stage</label>
                <div className="relative">
                  <select
                    value={form.stage}
                    onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                    className="w-full appearance-none bg-zinc-900 ring-1 ring-white/8 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-white/20 pr-8"
                  >
                    {stageOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
              {field('value', 'Deal Value (₹)', 'e.g. 85000', 'number')}
              {field('owner', 'Owner',          'e.g. John D.')}
              {field('close', 'Close Date',     '', 'date')}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 pb-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5">Cancel</button>
              <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90">
                <Plus className="w-3.5 h-3.5" />Add Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
