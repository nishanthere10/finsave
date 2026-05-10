import React from "react";
import { Progress } from "@/components/ui/progress";

interface BreakdownRowProps {
  label: string;
  amount: string;
  percentage: number;
  color?: string;
}

export function BreakdownRow({ label, amount, percentage, color = "bg-accent" }: BreakdownRowProps) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-2">
        <span className="text-foreground uppercase tracking-tight">{label}</span>
        <span className="text-muted">{amount} ({percentage}%)</span>
      </div>
      <Progress value={percentage} indicatorColor={color} className="h-2 bg-surface" />
    </div>
  );
}
