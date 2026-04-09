import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  isAnalyzing: boolean;
  aiAnalysis: string | null;
}

export default function AIAnalysis({ isAnalyzing, aiAnalysis }: AIAnalysisProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-brand-secondary" />
          <h3 className="text-xl font-bold">Intelligent AI Analysis</h3>
        </div>
        {isAnalyzing && <Loader2 className="w-5 h-5 animate-spin text-brand-secondary" />}
      </div>
      <div className="p-8 prose prose-invert max-w-none">
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse"></div>
          </div>
        ) : aiAnalysis ? (
          <div className="text-white/80 leading-relaxed font-sans">
            <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-white/40 italic">Waiting for analysis...</p>
        )}
      </div>
    </div>
  );
}
