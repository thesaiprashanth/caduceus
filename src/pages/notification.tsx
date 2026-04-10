import React, { useState } from 'react';
import {
  Sparkles, TrendingUp, AlertTriangle, RefreshCw, ArrowUpRight,
  Check, X, Clock, Search, Zap,
  UserCheck, DollarSign, Star
} from 'lucide-react';

type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type Category = 'Follow-up' | 'Upsell' | 'Re-engage' | 'Risk Alert' | 'All';

interface Recommendation {
  id: number;
  category: Exclude<Category, 'All'>;
  priority: Priority;
  contact: string;
  company: string;
  avatar: string;
  avatarColor: string;
  title: string;
  description: string;
  suggestedAction: string;
  impact: string;
  confidence: number;
  timeAgo: string;
  dealValue?: string;
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    category: 'Risk Alert',
    priority: 'Critical',
    contact: 'Oliver B.',
    company: 'Acme Corp',
    avatar: 'OB',
    avatarColor: 'bg-amber-500',
    title: 'Deal stalled — no activity for 14 days',
    description: 'The Acme Corp platform upgrade deal has had zero activity since Jul 14. Historically, deals silent for 2+ weeks have a 68% churn rate.',
    suggestedAction: 'Send a personalised check-in email referencing their Q3 goals.',
    impact: 'Saves ₹82K deal',
    confidence: 91,
    timeAgo: '1h ago',
    dealValue: '₹82K',
  },
  {
    id: 2,
    category: 'Follow-up',
    priority: 'High',
    contact: 'Ethan W.',
    company: 'Kinetic Labs',
    avatar: 'EW',
    avatarColor: 'bg-pink-500',
    title: 'Proposal opened 3 times — prospect is hot',
    description: 'The Growth Pack proposal was opened 3 times in the last 48 hours, including once at 10:42 PM. High engagement signals buying intent.',
    suggestedAction: 'Schedule a 15-minute call to address any remaining objections.',
    impact: '+₹96.5K pipeline',
    confidence: 87,
    timeAgo: '3h ago',
    dealValue: '₹96.5K',
  },
  {
    id: 3,
    category: 'Upsell',
    priority: 'High',
    contact: 'Fleur Z.',
    company: 'Mulders Tech',
    avatar: 'FZ',
    avatarColor: 'bg-rose-500',
    title: 'Upsell opportunity — usage at 94% capacity',
    description: 'Mulders Tech has been consistently hitting 90%+ usage limits for 3 consecutive months. They are a strong candidate for the Enterprise tier.',
    suggestedAction: 'Introduce the Enterprise plan upgrade with a 10% loyalty discount.',
    impact: '+₹55K ARR',
    confidence: 83,
    timeAgo: '5h ago',
    dealValue: '₹55K',
  },
  {
    id: 4,
    category: 'Re-engage',
    priority: 'Medium',
    contact: 'Jamie R.',
    company: 'Pulse Media',
    avatar: 'JR',
    avatarColor: 'bg-indigo-500',
    title: 'Lost deal — competitor pain point identified',
    description: 'Pulse Media chose a competitor 90 days ago. Their LinkedIn activity shows frustration with reporting features — a key Caduceus strength.',
    suggestedAction: 'Share a case study highlighting our reporting suite and offer a free demo.',
    impact: 'Win-back ₹44K',
    confidence: 62,
    timeAgo: '1d ago',
    dealValue: '₹44K',
  },
  {
    id: 5,
    category: 'Follow-up',
    priority: 'High',
    contact: 'Sara M.',
    company: 'Vertex AI',
    avatar: 'SM',
    avatarColor: 'bg-sky-500',
    title: 'Decision-maker changed — update contact',
    description: "Sara M's LinkedIn shows a role change at Vertex AI. The new procurement head, Arjun Nair, is now the likely decision-maker for the Analytics Suite deal.",
    suggestedAction: 'Connect with Arjun Nair on LinkedIn and re-pitch the value proposition.',
    impact: 'Protects ₹68K deal',
    confidence: 78,
    timeAgo: '2h ago',
    dealValue: '₹68K',
  },
  {
    id: 6,
    category: 'Upsell',
    priority: 'Medium',
    contact: 'Leo P.',
    company: 'Nordlane',
    avatar: 'LP',
    avatarColor: 'bg-orange-500',
    title: 'Add-on module matches their recent queries',
    description: "Nordlane's team has asked 3 support questions about automation workflows this quarter. The Automation add-on directly addresses their pain points.",
    suggestedAction: 'Demo the Automation module in their next check-in call.',
    impact: '+₹12K ARR',
    confidence: 74,
    timeAgo: '6h ago',
    dealValue: '₹12K',
  },
  {
    id: 7,
    category: 'Risk Alert',
    priority: 'Medium',
    contact: 'Nina K.',
    company: 'BrightPath',
    avatar: 'NK',
    avatarColor: 'bg-teal-500',
    title: 'Champion left — internal sponsor gone',
    description: "Nina K. who was your internal champion at BrightPath has left the company. The CRM Rollout proposal is now without an internal advocate.",
    suggestedAction: "Reach out to BrightPath's new CTO to re-establish the relationship.",
    impact: 'Protects ₹1.28L deal',
    confidence: 88,
    timeAgo: '4h ago',
    dealValue: '₹1.28L',
  },
  {
    id: 8,
    category: 'Re-engage',
    priority: 'Low',
    contact: 'Alistair C.',
    company: 'Orion Systems',
    avatar: 'AC',
    avatarColor: 'bg-violet-500',
    title: 'Prospect went cold after demo — nurture now',
    description: "Orion Systems attended a product demo 3 weeks ago but hasn't responded to 2 follow-up emails. A content-led nurture approach may warm them back up.",
    suggestedAction: 'Add to the "Enterprise Nurture" email sequence and pause direct outreach.',
    impact: '+₹2.1L pipeline',
    confidence: 55,
    timeAgo: '2d ago',
    dealValue: '₹2.1L',
  },
];

const categories: Category[] = ['All', 'Follow-up', 'Upsell', 'Re-engage', 'Risk Alert'];

const priorityStyle: Record<Priority, string> = {
  Critical: 'bg-red-500/10 text-red-400 ring-red-500/20',
  High:     'bg-orange-500/10 text-orange-300 ring-orange-500/20',
  Medium:   'bg-yellow-500/10 text-yellow-300 ring-yellow-500/20',
  Low:      'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
};

const categoryStyle: Record<Exclude<Category, 'All'>, string> = {
  'Follow-up':  'bg-blue-500/10 text-blue-300 ring-blue-500/20',
  'Upsell':     'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  'Re-engage':  'bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/20',
  'Risk Alert': 'bg-red-500/10 text-red-400 ring-red-500/20',
};

const categoryIcon: Record<Exclude<Category, 'All'>, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  'Follow-up':  UserCheck,
  'Upsell':     TrendingUp,
  'Re-engage':  RefreshCw,
  'Risk Alert': AlertTriangle,
};

const stats = [
  { label: 'Active Recommendations', value: '8',     sub: 'across all contacts',    icon: Sparkles,   color: 'text-violet-400' },
  { label: 'High Priority',          value: '3',     sub: 'need immediate action',   icon: Zap,        color: 'text-orange-400' },
  { label: 'Potential Revenue',      value: '₹5.6L', sub: 'at-risk or upsell',       icon: DollarSign, color: 'text-emerald-400' },
  { label: 'Avg. Confidence',        value: '77%',   sub: 'AI prediction score',     icon: Star,       color: 'text-amber-400' },
];

export default function NotificationPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [accepted, setAccepted] = useState<Set<number>>(new Set());

  const visible = recommendations.filter(r => {
    if (dismissed.has(r.id) || accepted.has(r.id)) return false;
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.contact.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const dismiss = (id: number) => setDismissed(prev => new Set(prev).add(id));
  const accept  = (id: number) => setAccepted(prev => new Set(prev).add(id));

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans antialiased">
      <div className="px-10 py-8 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-violet-400" strokeWidth={1.75} />
              <h1 className="text-[28px] font-semibold text-white tracking-tight">Recommendations</h1>
            </div>
            <p className="text-zinc-500 mt-1 text-sm">AI-powered actions to grow revenue and reduce churn.</p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            Updated just now
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="rounded-xl bg-zinc-900/40 ring-1 ring-white/5 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
              <div className="text-xs text-zinc-500 mt-1">{sub}</div>
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
              placeholder="Search recommendations…"
              className="pl-9 pr-4 py-2 text-sm bg-zinc-900/60 ring-1 ring-white/8 rounded-lg text-zinc-200 placeholder-zinc-600 outline-none focus:ring-white/15 transition-all w-60"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-white/10 text-white ring-1 ring-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-zinc-600">
            {visible.length} recommendation{visible.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-4 space-y-3">
          {visible.map(rec => {
            const CatIcon = categoryIcon[rec.category];
            return (
              <div
                key={rec.id}
                className="rounded-xl bg-zinc-900/40 ring-1 ring-white/5 px-6 py-5 hover:ring-white/10 transition-all"
              >
                <div className="flex items-start gap-5">

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${rec.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5`}>
                    {rec.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">

                    {/* Top row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ring-1 ${categoryStyle[rec.category]}`}>
                        <CatIcon className="w-3 h-3" strokeWidth={2} />
                        {rec.category}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ring-1 ${priorityStyle[rec.priority]}`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs text-zinc-600 ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.timeAgo}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2.5 text-sm font-semibold text-white leading-snug">{rec.title}</h3>

                    {/* Contact + company */}
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {rec.contact} · {rec.company}
                      {rec.dealValue && <span className="text-zinc-600"> · {rec.dealValue} deal</span>}
                    </p>

                    {/* Description */}
                    <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">{rec.description}</p>

                    {/* Suggested action */}
                    <div className="mt-3 flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-white/[0.03] ring-1 ring-white/5">
                      <ArrowUpRight className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        <span className="text-violet-400 font-medium">Suggested: </span>
                        {rec.suggestedAction}
                      </p>
                    </div>

                    {/* Footer row */}
                    <div className="mt-4 flex items-center gap-4 flex-wrap">
                      {/* Confidence bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-600 shrink-0">AI confidence</span>
                        <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-zinc-400 font-medium">{rec.confidence}%</span>
                      </div>

                      {/* Impact pill */}
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        {rec.impact}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => dismiss(rec.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Dismiss
                        </button>
                        <button
                          onClick={() => accept(rec.id)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {visible.length === 0 && (
            <div className="py-20 text-center">
              <Sparkles className="w-8 h-8 text-zinc-700 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-zinc-500 text-sm">No recommendations match your filters.</p>
              <p className="text-zinc-700 text-xs mt-1">Try clearing your search or switching categories.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
