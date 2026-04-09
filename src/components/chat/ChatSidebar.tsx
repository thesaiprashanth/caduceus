import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, MessageSquare, Loader2, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { ProfileData } from '../../types';

interface ChatSidebarProps {
  data: ProfileData;
  chatMessage: string;
  setChatMessage: (msg: string) => void;
  chatHistory: { role: string; parts: string }[];
  isChatLoading: boolean;
  onClose: () => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export default function ChatSidebar({
  data,
  chatMessage,
  setChatMessage,
  chatHistory,
  isChatLoading,
  onClose,
  onSendMessage
}: ChatSidebarProps) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Ask Caduceus AI</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">CRM Assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-sm text-white/40">
                Ask me anything about @{data.username}'s CRM strategy, audience quality, or growth opportunities.
              </p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={cn(
              "flex flex-col max-w-[85%]",
              msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-brand-primary text-white rounded-tr-none" 
                  : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
              )}>
                <ReactMarkdown>{msg.parts}</ReactMarkdown>
              </div>
              <span className="text-[10px] text-white/20 mt-1 uppercase font-bold tracking-widest">
                {msg.role === 'user' ? 'You' : 'Caduceus'}
              </span>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex flex-col items-start mr-auto max-w-[85%]">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none">
                <Loader2 className="w-4 h-4 animate-spin text-white/40" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={onSendMessage} className="p-6 border-t border-white/10 bg-white/5">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Type your question..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all pr-12"
            />
            <button 
              type="submit"
              disabled={!chatMessage || isChatLoading}
              className="absolute right-2 p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all disabled:opacity-0"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
