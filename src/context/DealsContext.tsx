import React, { createContext, useContext, useState } from 'react';

export interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: string;
  owner: string;
  ownerColor: string;
  close: string;
  activity: string;
}

export interface ChartPoint {
  day: number;
  revenue: number;
  deals: number;
  forecast: number;
}

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  chartData: ChartPoint[];
}

const DealsContext = createContext<DealsContextType | null>(null);

// 180 data points = 6 months of daily data.
// Two wave layers so every zoom level (7D/1M/3M/6M) shows interesting curves.
const baseChartData: ChartPoint[] = Array.from({ length: 180 }, (_, i) => {
  const revenue  = Math.round(
    60 + Math.sin(i / 18) * 18 + Math.sin(i / 3.5) * 6
       + i * 0.42 + (i > 60 ? 10 : 0) + (i > 120 ? 8 : 0)
  );
  const deals    = Math.max(20, Math.round(
    50 + Math.cos(i / 15) * 13 + Math.cos(i / 2.5) * 4 + i * 0.32
  ));
  const forecast = Math.round(55 + i * 0.50);
  return { day: i + 1, revenue, deals, forecast };
});

export const initialDeals: Deal[] = [
  { id: 1, name: 'Mulders Tech — Q3 License',    company: 'Mulders Tech',  value: 145000, stage: 'Negotiation',  owner: 'Fleur Z.',    ownerColor: 'bg-rose-500',   close: 'Aug 12, 2025', activity: '2h ago'  },
  { id: 2, name: 'Acme Corp — Platform Upgrade',  company: 'Acme Corp',     value: 82000,  stage: 'Closed Won',   owner: 'Oliver B.',   ownerColor: 'bg-amber-500',  close: 'Jul 28, 2025', activity: '1d ago'  },
  { id: 3, name: 'Kinetic Labs — Growth Pack',    company: 'Kinetic Labs',  value: 96500,  stage: 'Proposal',     owner: 'Ethan W.',    ownerColor: 'bg-pink-500',   close: 'Sep 5, 2025',  activity: '3h ago'  },
  { id: 4, name: 'Nordlane — Starter Bundle',     company: 'Nordlane',      value: 31000,  stage: 'Qualified',    owner: 'Leo P.',      ownerColor: 'bg-orange-500', close: 'Sep 20, 2025', activity: '5h ago'  },
  { id: 5, name: 'Orion Systems — Enterprise',    company: 'Orion Systems', value: 210000, stage: 'Lead',         owner: 'Alistair C.', ownerColor: 'bg-violet-500', close: 'Oct 1, 2025',  activity: '1h ago'  },
  { id: 6, name: 'Vertex AI — Analytics Suite',   company: 'Vertex AI',     value: 68000,  stage: 'Negotiation',  owner: 'Sara M.',     ownerColor: 'bg-sky-500',    close: 'Aug 30, 2025', activity: '30m ago' },
  { id: 7, name: 'Pulse Media — Ads Package',     company: 'Pulse Media',   value: 44000,  stage: 'Closed Lost',  owner: 'Jamie R.',    ownerColor: 'bg-indigo-500', close: 'Jul 10, 2025', activity: '2d ago'  },
  { id: 8, name: 'BrightPath — CRM Rollout',      company: 'BrightPath',    value: 128000, stage: 'Proposal',     owner: 'Nina K.',     ownerColor: 'bg-teal-500',   close: 'Sep 14, 2025', activity: '4h ago'  },
];

export function DealsProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals]         = useState<Deal[]>(initialDeals);
  const [chartData, setChartData] = useState<ChartPoint[]>(baseChartData);

  const addDeal = (deal: Omit<Deal, 'id'>) => {
    setDeals(prev => [...prev, { ...deal, id: prev.length + 1 }]);

    setChartData(prev => {
      const last = prev[prev.length - 1];
      // Scale the deal value into the chart's normalised unit range (~60-140)
      const revenueBoost  = deal.stage === 'Closed Won'
        ? Math.max(10, Math.round(deal.value / 8000))
        : Math.max(3,  Math.round(deal.value / 20000));
      const dealsBoost    = 4;
      const forecastBoost = Math.max(5, Math.round(deal.value / 12000));
      return [
        ...prev,
        {
          day:      last.day + 1,
          revenue:  last.revenue  + revenueBoost,
          deals:    last.deals    + dealsBoost,
          forecast: last.forecast + forecastBoost,
        },
      ];
    });
  };

  return (
    <DealsContext.Provider value={{ deals, addDeal, chartData }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const ctx = useContext(DealsContext);
  if (!ctx) throw new Error('useDeals must be used within DealsProvider');
  return ctx;
}
