import React from 'react';
import { ChevronRight, Heart, MessageSquare, Share2, Info } from 'lucide-react';
import { ProfileData } from '../../types';

export default function RecentPosts({ data }: { data: ProfileData }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Top Performing Content</h3>
        <button className="text-sm font-bold text-brand-primary flex items-center gap-1 hover:underline">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.recentPosts.map((post) => (
          <div key={post.id} className="glass-card group overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-1">
                  <Heart className="w-6 h-6 text-white fill-white" />
                  <span className="font-bold">{post.likes}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <MessageSquare className="w-6 h-6 text-white fill-white" />
                  <span className="font-bold">{post.comments}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                {post.engagement}% Eng.
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-white/70 line-clamp-2 mb-2">{post.caption}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40 font-bold uppercase">{post.date}</span>
                <div className="flex gap-2">
                  <Share2 className="w-4 h-4 text-white/40 hover:text-white cursor-pointer" />
                  <Info className="w-4 h-4 text-white/40 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
