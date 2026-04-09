import React from 'react';
import { motion } from 'motion/react';
import CRMInsights from '../components/dashboard/CRMInsights';
import ProfileOverview from '../components/dashboard/ProfileOverview';
import StatsGrid from '../components/dashboard/StatsGrid';
import AIAnalysis from '../components/dashboard/AIAnalysis';
import RecentPosts from '../components/dashboard/RecentPosts';
import SidebarInsights from '../components/dashboard/SidebarInsights';
import { ProfileData } from '../types';

interface DashboardPageProps {
  data: ProfileData;
  isAnalyzing: boolean;
  aiAnalysis: string | null;
}

export default function DashboardPage({ data, isAnalyzing, aiAnalysis }: DashboardPageProps) {
  return (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="space-y-8"
    >
      <CRMInsights />
      <ProfileOverview data={data} />
      <StatsGrid data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AIAnalysis isAnalyzing={isAnalyzing} aiAnalysis={aiAnalysis} />
          <RecentPosts data={data} />
        </div>
        
        <SidebarInsights />
      </div>
    </motion.div>
  );
}
