import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  isProcessing?: boolean;
}

export function EmptyState({ icon, title, description, isProcessing = false }: EmptyStateProps) {
  return (
    <div className="min-h-[9rem] flex flex-col items-center justify-center border border-border border-dashed rounded-xl bg-surface/50 p-6 text-center">
      {icon && (
        <div className={`mb-3 ${isProcessing ? "animate-pulse" : ""}`}>
          {icon}
        </div>
      )}
      <p className="text-sm font-bold text-foreground mb-1">{title}</p>
      {description && (
        <p className="text-xs font-medium text-muted uppercase tracking-widest">
          {description}
        </p>
      )}
    </div>
  );
}
