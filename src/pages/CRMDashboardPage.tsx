import React, { useState } from 'react';
import logo from '../Assets/Logo.jpeg';
import {
  Search, PanelLeft, Activity, Bell, SlidersHorizontal,
  ArrowUpDown, Plus, MoreHorizontal
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useDeals } from '../context/DealsContext';

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

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg bg-zinc-900/95 backdrop-blur ring-1 ring-white/10 px-3 py-2 text-xs shadow-2xl">
      <div className="text-zinc-400 mb-1.5">Day {label}</div>
      <div className="space-y-1 min-w-[140px]">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-zinc-300">Revenue</span></div>
          <span className="text-zinc-100 tabular-nums">{payload[0]?.value}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /><span className="text-zinc-300">Deals</span></div>
          <span className="text-zinc-100 tabular-nums">{payload[1]?.value}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-zinc-300">AI forecast</span></div>
          <span className="text-zinc-100 tabular-nums">{payload[2]?.value}</span>
        </div>
      </div>
    </div>
  );
}

const RANGE_DAYS: Record<string, number> = { '7D': 7, '1M': 30, '3M': 90, '6M': 180 };
const RANGE_TICKS: Record<string, number> = { '7D': 7, '1M': 10, '3M': 9,  '6M': 6  };

export default function CRMDashboardPage() {
  const { deals, chartData } = useDeals();
  const [tab, setTab]     = useState('Clients');
  const [range, setRange] = useState('1M');

  const totalRevenue = deals
    .filter(d => d.stage === 'Closed Won')
    .reduce((s, d) => s + d.value, 0);
  const totalDeals = deals.length;

  // Slice last N points for the selected range, re-index to 1…N so the
  // x-axis always starts at day 1 regardless of how many deals have been added.
  const days        = RANGE_DAYS[range] ?? 30;
  const visibleData = chartData
    .slice(-days)
    .map((p, i) => ({ ...p, day: i + 1 }));

  // Evenly-spaced x-axis ticks across the visible window
  const tickCount = Math.min(RANGE_TICKS[range] ?? 10, visibleData.length);
  const xTicks = Array.from({ length: tickCount }, (_, i) =>
    Math.round(1 + (i * (visibleData.length - 1)) / Math.max(tickCount - 1, 1))
  );

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans antialiased" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "SF Pro Display", sans-serif' }}>
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
        {/* Header */}
        <h1 className="text-[32px] font-semibold text-white tracking-tight">CRM</h1>
        <p className="text-zinc-500 mt-1.5 text-[15px]">Manage clients, track deals, and stay on top of every relationship — all in one place.</p>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-7 border-b border-white/5">
          {['Clients', 'Deals', 'Contacts'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm transition-colors relative ${tab === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {t}
              {tab === t && <span className="absolute left-0 right-0 -bottom-px h-px bg-white" />}
            </button>
          ))}
        </div>

        {/* Chart card */}
        <div className="mt-6 rounded-xl bg-zinc-900/40 ring-1 ring-white/5 p-6">
          <div className="flex gap-10">
            <div className="shrink-0">
              <div className="text-sm text-zinc-500">Total revenue</div>
              <div className="text-[28px] font-semibold text-white tracking-tight mt-1">{fmt(totalRevenue || 82000)}</div>
              <div className="text-sm text-zinc-500 mt-5">Total deals</div>
              <div className="text-[28px] font-semibold text-white tracking-tight mt-1">{totalDeals}</div>

              <div className="mt-8 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Revenue over time</div>
                <div className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" />Deals created</div>
                <div className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />AI revenue forecast</div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-end gap-1 mb-2">
                {['7D', '1M', '3M', '6M'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${range === r ? 'bg-white/10 text-white ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibleData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#52525b"
                      tick={{ fontSize: 11, fill: '#71717a' }}
                      tickLine={false}
                      axisLine={false}
                      ticks={xTicks}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Line type="monotone" dataKey="revenue"  stroke="#34d399" strokeWidth={1.75} dot={false} />
                    <Line type="monotone" dataKey="deals"    stroke="#38bdf8" strokeWidth={1.75} dot={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#fbbf24" strokeWidth={1.5}  strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Client table */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[15px] font-medium text-white">All clients</h2>
            <span className="text-sm text-zinc-500">{deals.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search..."
                className="bg-zinc-900/60 ring-1 ring-white/5 rounded-md pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 w-56 focus:outline-none focus:ring-white/15"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-300 bg-zinc-900/60 ring-1 ring-white/5 rounded-md hover:bg-zinc-800/60">
              <SlidersHorizontal className="w-3.5 h-3.5" />Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-300 bg-zinc-900/60 ring-1 ring-white/5 rounded-md hover:bg-zinc-800/60">
              <ArrowUpDown className="w-3.5 h-3.5" />Sort
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-white/10 ring-1 ring-white/15 rounded-md hover:bg-white/15">
              <Plus className="w-3.5 h-3.5" />Add Deal
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-[24px_1.6fr_1fr_0.6fr_1fr_1.4fr_1.2fr_1.4fr_24px] gap-4 px-3 py-2 text-xs text-zinc-500 border-b border-white/5">
            <div></div>
            <div>Client</div>
            <div>Phase</div>
            <div>Deals</div>
            <div>Deal Value</div>
            <div>Owner</div>
            <div>Last activity</div>
            <div>Close Date</div>
            <div></div>
          </div>
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="grid grid-cols-[24px_1.6fr_1fr_0.6fr_1fr_1.4fr_1.2fr_1.4fr_24px] gap-4 px-3 py-3.5 items-center text-sm border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
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
    </div>
  );
}
