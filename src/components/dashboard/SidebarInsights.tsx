import React from 'react';

export default function SidebarInsights() {
  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Audience Sentiment</h4>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>POSITIVE</span>
              <span className="text-green-400">82%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 w-[82%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>NEUTRAL</span>
              <span className="text-white/40">15%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white/20 w-[15%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>NEGATIVE</span>
              <span className="text-red-400">3%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 w-[3%]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Best Time to Post</h4>
        <div className="grid grid-cols-7 gap-1 h-32 items-end">
          {[40, 60, 80, 100, 70, 50, 30].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div 
                className="w-full bg-brand-primary/40 rounded-t-sm hover:bg-brand-primary transition-colors cursor-help"
                style={{ height: `${h}%` }}
                title={`Engagement: ${h}%`}
              ></div>
              <span className="text-[8px] font-bold text-white/20">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 text-center">
          <p className="text-xs font-bold text-brand-primary">Thursday @ 6:00 PM</p>
          <p className="text-[10px] text-white/40 uppercase mt-1">Peak Activity</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Top Hashtags</h4>
        <div className="flex flex-wrap gap-2">
          {['#lifestyle', '#design', '#minimal', '#aesthetic', '#branding', '#innovation'].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
