import React from "react";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, icon, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest mb-4 ${className}`}>
      {icon && <span className="text-accent">{icon}</span>}
      {title}
    </div>
  );
}
