"use client";
import { Card, CardContent } from "@/components/ui/card";

import { TrendingDown, AlertCircle, BarChart3, Info } from "lucide-react";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useMemo, useEffect, useState } from "react";
import { BreakdownRow } from "@/components/dashboard/BreakdownRow";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default function InsightsPage() {
  const { spendingBreakdown, highestSpendCategory, insight, trendDetection } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSpend = useMemo(() => {
    return Object.values(spendingBreakdown || {}).reduce((acc: number, val) => acc + (val as number), 0);
  }, [spendingBreakdown]);

  const breakdownArray = useMemo(() => {
    if (!spendingBreakdown) return [];
    return Object.entries(spendingBreakdown)
      .filter(([_, val]) => (val as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number));
  }, [spendingBreakdown]);

  const colors = ["bg-destructive/50", "bg-amber-500", "bg-blue-500", "bg-accent", "bg-purple-500"];

  if (!mounted) return null;
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Insights</h1>
        <p className="text-muted mt-1 font-medium">Deep dive into your behavioral spending patterns.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card text-foreground border border-border shadow-xl rounded-xl p-6 col-span-2">
          <SectionHeader title="Spending Breakdown" icon={<BarChart3 className="w-4 h-4" />} />
          <div className="space-y-6">
            {breakdownArray.length > 0 ? (
              breakdownArray.map(([category, amount], i) => {
                const percentage = totalSpend > 0 ? Math.round(((amount as number) / totalSpend) * 100) : 0;
                return (
                  <BreakdownRow 
                    key={category}
                    label={category} 
                    amount={`₹${(amount as number).toLocaleString()}`} 
                    percentage={percentage} 
                    color={colors[i % colors.length]} 
                  />
                );
              })
            ) : (
              <div className="text-sm text-secondary py-4 text-center border border-dashed border-border rounded-lg">No data. Connect your bank to see breakdown.</div>
            )}
          </div>
        </div>

        <div className="bg-card text-foreground border border-border shadow-xl rounded-xl p-6">
          <SectionHeader title="Highest Category" icon={<AlertCircle className="w-4 h-4" />} />
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-destructive mb-2">{highestSpendCategory || "N/A"}</div>
            {highestSpendCategory && spendingBreakdown?.[highestSpendCategory] && (
               <p className="text-sm text-secondary">
                 {totalSpend > 0 ? Math.round((spendingBreakdown[highestSpendCategory] as number / totalSpend) * 100) : 0}% of your total discretionary spend.
               </p>
            )}
          </div>
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-foreground/70 leading-relaxed font-bold">
              AI Analysis: {insight || "Run the AI pipeline to see your personalized recommendation."}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card text-foreground border border-border shadow-xl rounded-xl p-6">
         <SectionHeader title="Trend Analysis" icon={<TrendingDown className="w-4 h-4" />} />
         {trendDetection ? (
           <div className="min-h-[9rem] flex items-center justify-center border border-white/10 border-dashed rounded-xl bg-background/20 p-6">
             <p className="text-sm text-foreground leading-relaxed font-medium">
                <Info className="inline-block w-4 h-4 text-success mr-2 mb-0.5" />
                {trendDetection}
             </p>
           </div>
         ) : (
           <EmptyState title="Graph Processing Engine" description="Waiting for telemetry data" />
         )}
      </div>
    </div>
  );
}

