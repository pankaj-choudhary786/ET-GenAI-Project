import React from 'react';
import clsx from 'clsx';

export default function SkeletonLoader({ type = 'row', count = 1, className }) {
  const renderSkeleton = () => {
    switch(type) {
      case 'card':
        return Array.from({ length: count }).map((_, i) => (
          <div key={i} className={clsx("w-full bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4", className)}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-4/6"></div>
            </div>
          </div>
        ));
      
      case 'row':
      default:
        return Array.from({ length: count }).map((_, i) => (
          <div key={i} className={clsx("flex items-center gap-4 py-3 w-full", className)}>
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-1/4"></div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-full"></div>
            </div>
          </div>
        ));
    }
  };

  return (
    <div className="w-full space-y-4">
      {renderSkeleton()}
    </div>
  );
}
