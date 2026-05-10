"use client";
import { Card, CardContent } from "@/components/ui/card";

import { useDashboardStore } from "@/lib/store/useDashboardStore";
import MoneyMirrorChart from "@/components/dashboard/MoneyMirrorChart";
import { SpendingDonutChart, ComparativeImpactChart } from "@/components/dashboard/AnalyticsCharts";
import { Info, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function MoneyMirrorPage() {
  const { 
    beforeAfterProjection, 
    spendingBreakdown, 
    mirrorPrediction,
    fiveYearLoss 
  } = useDashboardStore();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const wasteBefore = beforeAfterProjection?.waste_before || 4500;
  const wasteAfter = beforeAfterProjection?.waste_after || 2300;
  const futureSaved = beforeAfterProjection?.future_saved_5_years || 330000;
  const displayFiveYearLoss = fiveYearLoss || 270000;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Money Mirror</h1>
          <p className="text-muted mt-1 font-medium">AI-Powered deep trajectory analytics.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-card text-foreground border border-border shadow-xl rounded-xl p-6 md:col-span-3">
           <div className="flex items-center gap-2 mb-4 text-muted text-[10px] uppercase font-bold tracking-widest">
              <TrendingUp className="w-4 h-4 text-green-600" /> 5-Year Financial Trajectory
           </div>
          <MoneyMirrorChart wasteBefore={wasteBefore} wasteAfter={wasteAfter} />
        </div>
        <div className="bg-card text-foreground border border-border shadow-xl rounded-xl p-6 flex flex-col justify-center space-y-8">
            <div>
               <div className="text-[10px] uppercase text-muted font-bold tracking-widest mb-2">Projected Value Loss</div>
               <div className="text-3xl font-bold text-red-600 font-sans">-₹{displayFiveYearLoss.toLocaleString()}</div>
            </div>
           <div className="w-full h-px bg-border" />
            <div>
               <div className="text-[10px] uppercase text-muted font-bold tracking-widest mb-2">If AI Plan Executed</div>
               <div className="text-3xl font-bold text-green-600 font-sans">+₹{futureSaved.toLocaleString()}</div>
            </div>
           {mirrorPrediction && (
              <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20 text-xs text-blue-500/90 leading-relaxed font-semibold">
                 <Info className="inline w-3 h-3 mr-1" />
                 {mirrorPrediction}
              </div>
           )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card text-foreground border border-border shadow-xl rounded-xl p-6">
           <div className="flex items-center gap-2 mb-6 text-muted text-[10px] uppercase font-bold tracking-widest">
              <PieChartIcon className="w-4 h-4 text-green-600" /> Categorical Breakdown
           </div>
           
           <div className="space-y-3">
              {Object.entries(spendingBreakdown && Object.keys(spendingBreakdown).length > 0 ? spendingBreakdown : {
                "Food Delivery": 2200,
                "Shopping": 1500,
                "Subscriptions": 649,
                "Transport": 800
              })
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([category, amount], index) => (
                 <div key={category} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 transition-all hover:border-green-400">
                  <span className="font-bold text-foreground">{category}</span>
                  <span className={`font-bold font-sans ${index === 0 ? "text-red-600" : "text-foreground"}`}>₹{Number(amount).toLocaleString()}</span>
                </div>
              ))}
           </div>
        </div>
        
        <div className="bg-card text-foreground border border-border shadow-xl rounded-xl p-6 flex flex-col justify-center">
           <div className="flex items-center gap-2 mb-6 text-muted text-[10px] uppercase font-bold tracking-widest">
              <Info className="w-4 h-4 text-green-600" /> Monthly Impact Analysis
           </div>
           
           <div className="p-6 border border-green-200 rounded-xl bg-accent/5 dark:bg-accent/50/10 dark:border-accent/20 shadow-xl">
             <p className="text-sm text-green-800 dark:text-green-400 font-medium mb-3">
               Cutting your highest leak can save you
             </p>
             <h3 className="text-4xl font-bold text-green-600 dark:text-accent font-mono tracking-tight mb-2">
               ₹{(wasteBefore - wasteAfter > 0 ? (wasteBefore - wasteAfter) : 2200).toLocaleString()}/month
             </h3>
             <p className="text-sm text-green-700/80 dark:text-accent/80 font-medium mt-3 border-t border-green-200/50 pt-3">
               That's <span className="font-bold">₹{((wasteBefore - wasteAfter > 0 ? (wasteBefore - wasteAfter) : 2200) * 60).toLocaleString()}</span> over 5 years.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
