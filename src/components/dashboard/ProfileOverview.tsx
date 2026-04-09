import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ProfileData } from '../../types';

export default function ProfileOverview({ data }: { data: ProfileData }) {
  return (
    <div className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-tr from-brand-accent to-brand-secondary rounded-full blur opacity-40"></div>
        <img 
          src={data.profilePic} 
          alt={data.username} 
          className="relative w-32 h-32 rounded-full border-4 border-[#050505] object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">@{data.username}</h2>
          <div className="flex justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider">Business</span>
            <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider">Verified</span>
          </div>
        </div>
        <p className="text-xl font-medium mb-2">{data.fullName}</p>
        <p className="text-white/60 max-w-2xl mb-6">{data.bio}</p>
        <div className="flex flex-wrap justify-center md:justify-start gap-8">
          <div>
            <p className="text-2xl font-bold">{(data.followers / 1000).toFixed(1)}K</p>
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{data.following}</p>
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Following</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{data.posts}</p>
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Posts</p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto flex flex-col gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-brand-primary mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Engagement</span>
          </div>
          <p className="text-3xl font-bold">{data.engagementRate}%</p>
          <p className="text-[10px] text-white/40 uppercase font-bold">Above Average</p>
        </div>
      </div>
    </div>
  );
}
