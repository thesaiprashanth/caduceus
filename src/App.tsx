import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { analyzeProfile, chatWithProfile } from './lib/gemini';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';
import { ProfileData, Post } from './types';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatSidebar from './components/chat/ChatSidebar';
import FloatingChatButton from './components/chat/FloatingChatButton';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import CRMDashboardPage from './pages/CRMDashboardPage';
import LeadPipelinePage from './pages/LeadPipelinePage';
import AutomationPage from './pages/AutomationPage';
import { Routes, Route } from 'react-router-dom';

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
      bio: "Elevating lifestyle through design and innovation. \uD83C\uDF3F | Est. 2020 | Worldwide Shipping \uD83D\uDCE6",
      followers: 125400,
      following: 842,
      posts: 432,
      engagementRate: 4.8,
      avgLikes: 5800,
      avgComments: 124,
      profilePic: `https://picsum.photos/seed/${handle}/200/200`,
      recentPosts: [
        { id: '1', imageUrl: 'https://picsum.photos/seed/post1/400/400', likes: 6200, comments: 145, caption: "New collection dropping tomorrow! \u2728 #lifestyle #design", date: "2h ago", engagement: 5.1 },
        { id: '2', imageUrl: 'https://picsum.photos/seed/post2/400/400', likes: 4100, comments: 89, caption: "Morning routines that matter. \u2615\uFE0F", date: "1d ago", engagement: 3.4 },
        { id: '3', imageUrl: 'https://picsum.photos/seed/post3/400/400', likes: 8900, comments: 312, caption: "Our best-seller is back in stock! Limited quantities. \uD83C\uDFC3\u200D\u2642\uFE0F", date: "3d ago", engagement: 7.2 },
        { id: '4', imageUrl: 'https://picsum.photos/seed/post4/400/400', likes: 5400, comments: 92, caption: "Behind the scenes at our studio. \uD83C\uDFA8", date: "5d ago", engagement: 4.5 },
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
    <Routes>
      {/* CRM Dashboard — full-screen, no header/footer */}
      <Route path="/crm-dashboard" element={<CRMDashboardPage />} />

      {/* All other routes with standard layout */}
      <Route path="*" element={
        <div className="min-h-screen font-sans text-white selection:bg-brand-primary/30 pb-20 relative">
          {/* Chat Sidebar */}
          <AnimatePresence>
            {isChatOpen && data && (
              <ChatSidebar 
                data={data}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                chatHistory={chatHistory}
                isChatLoading={isChatLoading}
                onClose={() => setIsChatOpen(false)}
                onSendMessage={handleSendMessage}
              />
            )}
          </AnimatePresence>

          {/* Floating Chat Button */}
          {data && (
            <FloatingChatButton onClick={() => setIsChatOpen(true)} />
          )}

          {/* Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full" />
          </div>

          {/* Header */}
          <Header user={user} handleLogin={handleLogin} handleLogout={handleLogout} />

          <main className="max-w-7xl mx-auto px-6 pt-12">
            <Routes>
              <Route path="/" element={
                <>
                  <LandingPage 
                    handle={handle}
                    setHandle={setHandle}
                    isExtracting={isExtracting}
                    handleExtract={handleExtract}
                    hasData={!!data}
                  />

                  <AnimatePresence mode="wait">
                    {data && (
                      <DashboardPage 
                        data={data}
                        isAnalyzing={isAnalyzing}
                        aiAnalysis={aiAnalysis}
                      />
                    )}
                  </AnimatePresence>
                </>
              } />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/lead-pipeline" element={<LeadPipelinePage />} />
              <Route path="/automation" element={<AutomationPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      } />
    </Routes>
  );
}
