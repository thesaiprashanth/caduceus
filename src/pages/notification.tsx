import React, { useState } from 'react';
import { Sparkles, Search, Users } from 'lucide-react';

interface Profile {
  id: number;
  username: string;
  fullName: string;
  bio: string;
  followers: number;
  following: number;
  profilePic: string;
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
      : String(n);

const profiles: Profile[] = [
  {
    id: 1,
    username: 'oliver.bennett',
    fullName: 'Oliver Bennett',
    bio: 'Head of Procurement @ Acme Corp 🏢 | Tech buyer | B2B SaaS enthusiast',
    followers: 4820,
    following: 312,
    profilePic: 'https://ui-avatars.com/api/?name=Oliver+Bennett&background=f59e0b&color=fff&size=200',
  },
  {
    id: 2,
    username: 'ethan.wright_',
    fullName: 'Ethan Wright',
    bio: 'Co-founder & CTO @KineticLabs ⚡ | Building the future of analytics | Prev @Google',
    followers: 18_400,
    following: 540,
    profilePic: 'https://ui-avatars.com/api/?name=Ethan+Wright&background=ec4899&color=fff&size=200',
  },
  {
    id: 3,
    username: 'fleur.zethoven',
    fullName: 'Fleur Zethoven',
    bio: 'VP Growth @ Mulders Tech 🌱 | SaaS scaling & partnerships | Amsterdam 🇳🇱',
    followers: 9_210,
    following: 724,
    profilePic: 'https://ui-avatars.com/api/?name=Fleur+Zethoven&background=f43f5e&color=fff&size=200',
  },
  {
    id: 4,
    username: 'jamie.r.media',
    fullName: 'Jamie Rodrigues',
    bio: 'Founder @PulseMedia 📱 | Digital content & brand strategy | Coffee addict ☕',
    followers: 31_700,
    following: 890,
    profilePic: 'https://ui-avatars.com/api/?name=Jamie+Rodrigues&background=6366f1&color=fff&size=200',
  },
  {
    id: 5,
    username: 'sara.m.vertex',
    fullName: 'Sara Mehta',
    bio: 'Ex-Procurement Lead @VertexAI | Now @Horizon Ventures 🚀 | Connecting tech & business',
    followers: 6_340,
    following: 415,
    profilePic: 'https://ui-avatars.com/api/?name=Sara+Mehta&background=0ea5e9&color=fff&size=200',
  },
  {
    id: 6,
    username: 'leo.patel.nord',
    fullName: 'Leo Patel',
    bio: 'Head of Ops @Nordlane 🔧 | Automation & workflow nerd | Building smarter systems',
    followers: 2_180,
    following: 198,
    profilePic: 'https://ui-avatars.com/api/?name=Leo+Patel&background=f97316&color=fff&size=200',
  },
  {
    id: 7,
    username: 'nina.k.official',
    fullName: 'Nina Kapoor',
    bio: 'Just left BrightPath after 4 years 🌟 | Exploring new opportunities in EdTech | DMs open',
    followers: 11_900,
    following: 602,
    profilePic: 'https://ui-avatars.com/api/?name=Nina+Kapoor&background=14b8a6&color=fff&size=200',
  },
  {
    id: 8,
    username: 'alistair.crowley',
    fullName: 'Alistair Crowley',
    bio: 'CEO @OrionSystems 🛰️ | Enterprise infrastructure | Speaker | Prev @IBM | London',
    followers: 24_500,
    following: 1_030,
    profilePic: 'https://ui-avatars.com/api/?name=Alistair+Crowley&background=8b5cf6&color=fff&size=200',
  },
];

export default function NotificationPage() {
  const [search, setSearch] = useState('');

  const visible = profiles.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.username.toLowerCase().includes(search.toLowerCase())
  );

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
            <p className="text-zinc-500 mt-1 text-sm">Instagram profiles scraped for your leads.</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or username…"
              className="pl-9 pr-4 py-2 text-sm bg-zinc-900/60 ring-1 ring-white/8 rounded-lg text-zinc-200 placeholder-zinc-600 outline-none focus:ring-white/15 transition-all w-64"
            />
          </div>
          <span className="ml-auto text-xs text-zinc-600">{visible.length} profiles</span>
        </div>

        {/* Cards */}
        <div className="mt-4 space-y-3">
          {visible.map(p => (
            <div
              key={p.id}
              className="rounded-xl bg-zinc-900/40 ring-1 ring-white/5 px-6 py-4 hover:ring-white/10 transition-all flex items-center gap-5"
            >
              <img
                src={p.profilePic}
                alt={p.fullName}
                className="w-12 h-12 rounded-full ring-1 ring-white/10 shrink-0 object-cover"
                onError={e => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName)}&background=3f3f46&color=fff&size=200`;
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{p.fullName}</span>
                  <span className="text-xs text-zinc-500">@{p.username}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed line-clamp-1">{p.bio}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <Users className="w-3 h-3" />
                    <span className="text-zinc-300 font-medium">{fmt(p.followers)}</span> followers
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    <span className="text-zinc-300 font-medium">{fmt(p.following)}</span> following
                  </span>
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="py-20 text-center">
              <Sparkles className="w-8 h-8 text-zinc-700 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-zinc-500 text-sm">No profiles match your search.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
