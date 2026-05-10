"use client";
import CountUp from "react-countup";
import { motion } from "framer-motion";

export interface MetricCardProps {
  title: string;
  value: number | string;
  subValue?: string;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  highlight?: "neutral" | "danger" | "success" | "accent";
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  subValue, 
  icon, 
  prefix = "", 
  suffix = "", 
  highlight = "neutral",
  delay = 0
}: MetricCardProps) {
  const valueColor = 
    highlight === "danger" ? "text-danger" :
    highlight === "success" ? "text-success" : 
    highlight === "accent" ? "text-accent" : 
    "text-foreground";

  const borderColor = 
    highlight === "danger" ? "border-danger/30" :
    highlight === "success" ? "border-success/30" :
    highlight === "accent" ? "border-accent/30" :
    "border-border";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      className={`bg-card text-foreground border ${borderColor} shadow-xl hover:shadow-md rounded-2xl p-6 transition-all duration-200 relative overflow-hidden group hover:-translate-y-0.5`}
    >
      <div className="space-y-3">
        <div className={subValue ? "" : "flex items-center justify-between mb-2"}>
          {subValue ? (
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{title}</p>
          ) : (
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{title}</span>
          )}
          {!subValue && <div>{icon}</div>}
          <div className={`text-2xl md:text-3xl font-bold tracking-tight font-mono ${valueColor}`}>
            {prefix && <span className="text-lg mr-0.5 opacity-60 font-sans font-medium">{prefix}</span>}
            {typeof value === "number" ? (
              <CountUp end={value} duration={1.5} separator="," useEasing={true} />
            ) : (
              value
            )}
            {suffix && <span className="text-lg ml-0.5 opacity-60 font-sans font-medium">{suffix}</span>}
          </div>
        </div>
        {subValue && (
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest">
              {subValue}
            </div>
            <div className="opacity-30 group-hover:opacity-100 transition-opacity text-muted">
              {icon}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
