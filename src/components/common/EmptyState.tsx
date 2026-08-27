import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  actionText,
  onActionClick,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl max-w-md mx-auto w-full select-none ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00] mb-4">
          <Icon size={20} strokeWidth={2} />
        </div>
      )}
      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1.5">{title}</h3>
      <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold mb-5 max-w-xs">{description}</p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10 hover:scale-[1.02] active:scale-98"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
