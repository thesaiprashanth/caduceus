import React, { useState } from 'react';
import {
  Search, PanelLeft, Activity, Bell, SlidersHorizontal,
  ArrowUpDown, Plus, MoreHorizontal
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const chartData = Array.from({ length: 30 }, (_, i) => {
  const x = i + 1;
  const revenue = 60 + Math.sin(i / 3) * 18 + i * 2.2 + (i > 15 ? 15 : 0);
  const deals = 50 + Math.cos(i / 2.5) * 14 + i * 1.6;
  const forecast = 55 + i * 2.8;
  return { day: x, revenue: Math.round(revenue), deals: Math.round(deals), forecast: Math.round(forecast) };
});

const clients = [
  { name: 'Mulders Tech', phase: 'Qualified', phaseColor: 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/30', deals: 3, value: '₹145,000', owner: 'Fleur Zethoven', ownerColor: 'bg-rose-500', activity: 'Email sent', date: 'Jul 25, 2025, 2:35 PM', dot: 'from-sky-400 to-blue-600' },
  { name: 'Acme Corp', phase: 'Closed', phaseColor: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30', deals: 2, value: '₹82,000', owner: 'Oliver Bennett', ownerColor: 'bg-amber-500', activity: 'Call completed', date: 'Jul 23, 2025, 9:50 AM', dot: 'from-zinc-300 to-zinc-500' },
  { name: 'Kinetic Labs', phase: 'Negotiation', phaseColor: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30', deals: 5, value: '₹96,500', owner: 'Ethan Wright', ownerColor: 'bg-pink-500', activity: 'Task created', date: 'Jul 20, 2025, 4:22 PM', dot: 'from-purple-400 to-fuchsia-600' },
  { name: 'Nordlane', phase: 'Proposal', phaseColor: 'bg-blue-500/15 text-blue-300 ring-blue-500/30', deals: 7, value: '₹31,000', owner: 'Leo Patel', ownerColor: 'bg-orange-500', activity: 'Note added', date: 'Jul 18, 2025, 10:45 AM', dot: 'from-orange-400 to-red-500' },
  { name: 'Orion Systems', phase: 'Lead', phaseColor: 'bg-orange-500/15 text-orange-300 ring-orange-500/30', deals: 7, value: '₹31,000', owner: 'Alistair Crowley', ownerColor: 'bg-violet-500', activity: 'Deal closed', date: 'Jul 18, 2025, 10:45 AM', dot: 'from-cyan-400 to-teal-500' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg bg-zinc-900/95 backdrop-blur ring-1 ring-white/10 px-3 py-2 text-xs shadow-2xl">
      <div className="text-zinc-400 mb-1.5">Dec {label}, 2025</div>
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

export default function CRMDashboardPage() {
  const [tab, setTab] = useState('Clients');
  const [range, setRange] = useState('1M');

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans antialiased" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "SF Pro Display", sans-serif' }}>
      {/* Top bar */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3 text-zinc-400">
          <PanelLeft className="w-4 h-4" />
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
              className={`pb-3 text-sm transition-colors relative ${tab === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
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
              <div className="text-[28px] font-semibold text-white tracking-tight mt-1">₹182,500</div>
              <div className="text-sm text-zinc-500 mt-5">Total deals</div>
              <div className="text-[28px] font-semibold text-white tracking-tight mt-1">18</div>

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
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${range === r ? 'bg-white/10 text-white ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#52525b"
                      tick={{ fontSize: 11, fill: '#71717a' }}
                      tickLine={false}
                      axisLine={false}
                      ticks={[1, 3, 5, 7, 10, 13, 15, 17, 20, 23, 25, 27, 30]}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={1.75} dot={false} />
                    <Line type="monotone" dataKey="deals" stroke="#38bdf8" strokeWidth={1.75} dot={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
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
            <span className="text-sm text-zinc-500">24</span>
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
            <div>Created on</div>
            <div></div>
          </div>
          {clients.map((c, i) => (
            <div
              key={c.name}
              className="grid grid-cols-[24px_1.6fr_1fr_0.6fr_1fr_1.4fr_1.2fr_1.4fr_24px] gap-4 px-3 py-3.5 items-center text-sm border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <input type="checkbox" className="w-3.5 h-3.5 rounded bg-zinc-800 border-zinc-700" />
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${c.dot} ring-1 ring-white/10`} />
                <span className="text-zinc-100">{c.name}</span>
              </div>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs ring-1 ${c.phaseColor}`}>{c.phase}</span>
              </div>
              <div className="text-zinc-300 tabular-nums">{c.deals}</div>
              <div className="text-zinc-300 tabular-nums">{c.value}</div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${c.ownerColor} ring-1 ring-white/10`} />
                <span className="text-zinc-300">{c.owner}</span>
              </div>
              <div className="text-zinc-400">{c.activity}</div>
              <div className="text-zinc-500">{c.date}</div>
              <button className="text-zinc-500 hover:text-zinc-300"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}