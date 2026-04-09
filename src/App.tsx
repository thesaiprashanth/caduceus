/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Instagram, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  ChevronRight,
  Info,
  Briefcase,
  Mail,
  UserPlus,
  Target,
  LogOut
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { analyzeProfile, chatWithProfile } from './lib/gemini';
import { cn } from './lib/utils';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';

// Types
interface ProfileData {
  username: string;
  fullName: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  profilePic: string;
  recentPosts: Post[];
  growthData: { date: string; followers: number }[];
}

interface Post {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
  date: string;
  engagement: number;
}

export default function App() {
  const [handle, setHandle] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<ProfileData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string, parts: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage || !data || isChatLoading) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', parts: userMsg }]);
    setIsChatLoading(true);

    const response = await chatWithProfile(data, userMsg, chatHistory);
    setChatHistory(prev => [...prev, { role: 'model', parts: response || '' }]);
    setIsChatLoading(false);
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    setIsExtracting(true);
    setData(null);
    setAiAnalysis(null);

    // Simulate extraction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock Data for demonstration
    const mockData: ProfileData = {
      username: handle.replace('@', ''),
      fullName: "Premium Brand Co.",
      bio: "Elevating lifestyle through design and innovation. 🌿 | Est. 2020 | Worldwide Shipping 📦",
      followers: 125400,
      following: 842,
      posts: 432,
      engagementRate: 4.8,
      avgLikes: 5800,
      avgComments: 124,
      profilePic: `https://picsum.photos/seed/${handle}/200/200`,
      recentPosts: [
        { id: '1', imageUrl: 'https://picsum.photos/seed/post1/400/400', likes: 6200, comments: 145, caption: "New collection dropping tomorrow! ✨ #lifestyle #design", date: "2h ago", engagement: 5.1 },
        { id: '2', imageUrl: 'https://picsum.photos/seed/post2/400/400', likes: 4100, comments: 89, caption: "Morning routines that matter. ☕️", date: "1d ago", engagement: 3.4 },
        { id: '3', imageUrl: 'https://picsum.photos/seed/post3/400/400', likes: 8900, comments: 312, caption: "Our best-seller is back in stock! Limited quantities. 🏃‍♂️", date: "3d ago", engagement: 7.2 },
        { id: '4', imageUrl: 'https://picsum.photos/seed/post4/400/400', likes: 5400, comments: 92, caption: "Behind the scenes at our studio. 🎨", date: "5d ago", engagement: 4.5 },
      ],
      growthData: [
        { date: 'Mon', followers: 124100 },
        { date: 'Tue', followers: 124350 },
        { date: 'Wed', followers: 124800 },
        { date: 'Thu', followers: 125100 },
        { date: 'Fri', followers: 125250 },
        { date: 'Sat', followers: 125350 },
        { date: 'Sun', followers: 125400 },
      ]
    };

    setData(mockData);
    setIsExtracting(false);
    
    // Auto-trigger AI Analysis
    handleAnalyze(mockData);
  };

  const handleAnalyze = async (profileData: ProfileData) => {
    setIsAnalyzing(true);
    const analysis = await analyzeProfile(profileData);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen font-sans text-white selection:bg-brand-primary/30 pb-20">
      {/* Chat Sidebar */}
      <AnimatePresence>
        {isChatOpen && data && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
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
                  onClick={() => setIsChatOpen(false)}
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
                    <p className="text-sm text-white/40">Ask me anything about @{data.username}'s CRM strategy, audience quality, or growth opportunities.</p>
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

              <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-white/5">
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
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      {data && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent via-brand-primary to-brand-secondary shadow-2xl z-50 flex items-center justify-center group"
        >
          <div className="absolute -inset-1 bg-brand-primary blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <MessageSquare className="relative text-white w-7 h-7" />
        </motion.button>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent via-brand-primary to-brand-secondary flex items-center justify-center">
              <Target className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Caduceus <span className="gradient-text">CRM</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">CRM Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Lead Pipeline</a>
            <a href="#" className="hover:text-white transition-colors">Automation</a>
            <button className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Enterprise
            </button>
            {user ? (
              <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-4">
                <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                <span className="text-sm font-semibold">{user.displayName?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-red-400" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all ml-4">
                Sign in
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Hero Search */}
        <section className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            The AI-First CRM for <br />
            <span className="gradient-text italic font-serif">Instagram Business</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg max-w-2xl mx-auto mb-10"
          >
            Convert followers into customers. Caduceus uses Gemini AI to extract leads, analyze relationship quality, and automate your outreach strategy.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleExtract}
            className="max-w-xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-2">
              <div className="pl-4 text-white/40">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Enter Instagram handle (e.g. @nike)"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-lg outline-none"
              />
              <button 
                disabled={isExtracting}
                className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Extract"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.form>
        </section>

        <AnimatePresence mode="wait">
          {isExtracting && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#050505]/80 backdrop-blur-xl flex flex-col items-center justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-secondary rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-center"
              >
                <h3 className="text-2xl font-bold mb-2">Extracting Intelligence</h3>
                <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Scanning profile data...</p>
              </motion.div>
            </motion.div>
          )}

          {data ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-8"
            >
              {/* CRM Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-l-4 border-brand-primary">
                  <div className="flex items-center gap-3 mb-2 text-white/40">
                    <UserPlus className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">New Leads</span>
                  </div>
                  <p className="text-2xl font-bold">1,284</p>
                  <p className="text-[10px] text-green-400 font-bold mt-1">+12% this week</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-brand-accent">
                  <div className="flex items-center gap-3 mb-2 text-white/40">
                    <Target className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Conversion Rate</span>
                  </div>
                  <p className="text-2xl font-bold">3.2%</p>
                  <p className="text-[10px] text-brand-primary font-bold mt-1">Target: 5.0%</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-brand-secondary">
                  <div className="flex items-center gap-3 mb-2 text-white/40">
                    <Mail className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Active Outreach</span>
                  </div>
                  <p className="text-2xl font-bold">432</p>
                  <p className="text-[10px] text-white/40 font-bold mt-1">Automated sequences</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-white/20">
                  <div className="flex items-center gap-3 mb-2 text-white/40">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Pipeline Value</span>
                  </div>
                  <p className="text-2xl font-bold">$12.4K</p>
                  <p className="text-[10px] text-white/40 font-bold mt-1">Estimated monthly</p>
                </div>
              </div>

              {/* Profile Overview */}
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

              {/* Stats Grid */}
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

              {/* AI Analysis Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
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

                  {/* Recent Posts */}
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
                </div>

                {/* Sidebar Insights */}
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
              </div>
            </motion.div>
          ) : (
            !isExtracting && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <BarChart3 className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Data Extracted</h2>
                <p className="text-white/40 max-w-sm">Enter a business handle above to start analyzing performance and strategy.</p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <Target className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">Caduceus CRM</span>
          </div>
          <p className="text-white/20 text-xs font-medium">
            © 2026 Caduceus AI CRM. Powered by Gemini 3.
          </p>
          <div className="flex gap-6 text-white/40 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
