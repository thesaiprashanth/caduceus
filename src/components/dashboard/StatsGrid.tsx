import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Heart, MessageSquare, Sparkles } from 'lucide-react';
import { ProfileData } from '../../types';

export default function StatsGrid({ data }: { data: ProfileData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Growth Chart */}
      <div className="md:col-span-2 glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold">Follower Growth</h3>
            <p className="text-sm text-white/40">Last 7 days performance</p>
          </div>
          <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
            <TrendingUp className="w-4 h-4" />
            +1.2%
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.growthData}>
              <defs>
                <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E1306C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E1306C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#ffffff40" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                hide 
                domain={['dataMin - 100', 'dataMax + 100']} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#E1306C' }}
              />
              <Area 
                type="monotone" 
                dataKey="followers" 
                stroke="#E1306C" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorFollowers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white/60">Avg. Likes</span>
          </div>
          <p className="text-4xl font-bold">{(data.avgLikes / 1000).toFixed(1)}K</p>
          <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[75%]"></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white/60">Avg. Comments</span>
          </div>
          <p className="text-4xl font-bold">{data.avgComments}</p>
          <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[45%]"></div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-brand-accent/20 to-brand-primary/20 border-brand-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/10 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white/80">Strategy Score</span>
          </div>
          <p className="text-4xl font-bold">88<span className="text-xl text-white/40">/100</span></p>
          <p className="text-xs text-white/60 mt-2">Excellent content consistency</p>
        </div>
      </div>
    </div>
  );
}
