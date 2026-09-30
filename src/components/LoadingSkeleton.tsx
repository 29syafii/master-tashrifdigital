import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-5 animate-pulse">
      {/* Header banner skeleton */}
      <div className="bg-[#1f705e]/25 border-2 border-[#1f705e]/30 rounded-2xl p-6 h-36 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1f705e]/30" />
          <div className="space-y-2.5">
            <div className="w-48 h-8 bg-[#1f705e]/30 rounded-xl" />
            <div className="w-72 h-4 bg-[#1f705e]/20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 w-36 bg-[#cbe3da] rounded-2xl shrink-0" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border-2 border-[#b5d8cd] p-4 space-y-3">
        <div className="h-6 w-56 bg-[#d8ebe3] rounded-lg" />
        <div className="space-y-2 pt-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-[#edf6f2] rounded-xl flex items-center justify-between px-4"
            >
              <div className="w-28 h-4 bg-[#c8e2d8] rounded" />
              <div className="w-36 h-6 bg-[#b6d8cc] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
