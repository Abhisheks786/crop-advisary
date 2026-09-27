import React from 'react';

/**
 * Skeleton Components for Smooth Loading States
 * Replaces blank screens with elegant pulsing agriculture-themed placeholders.
 */

export const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#E8E6D5]/60 rounded-xl ${className}`} />
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-2xl border border-[#E8E6D5] shadow-xs space-y-4 animate-pulse ${className}`}>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-xl bg-[#E8E6D5]/70 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-[#E8E6D5] rounded-md w-1/3" />
        <div className="h-3.5 bg-[#E8E6D5]/60 rounded-md w-1/2" />
      </div>
    </div>
    <div className="space-y-2 pt-2">
      <div className="h-4 bg-[#E8E6D5]/60 rounded-md w-full" />
      <div className="h-4 bg-[#E8E6D5]/50 rounded-md w-5/6" />
      <div className="h-4 bg-[#E8E6D5]/40 rounded-md w-2/3" />
    </div>
    <div className="h-10 bg-[#E8E6D5]/70 rounded-xl w-full mt-4" />
  </div>
);

export const SkeletonHeroCard = () => (
  <div className="p-8 bg-white rounded-3xl border border-[#E8E6D5] shadow-sm space-y-6 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center space-x-5">
        <div className="w-24 h-24 rounded-2xl bg-[#E8E6D5] shrink-0" />
        <div className="space-y-3">
          <div className="h-8 bg-[#E8E6D5] rounded-lg w-48" />
          <div className="h-4 bg-[#E8E6D5]/70 rounded-md w-32" />
          <div className="h-6 bg-[#E8E6D5]/50 rounded-full w-24" />
        </div>
      </div>
      <div className="w-28 h-28 rounded-full bg-[#E8E6D5]/60 self-center" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E8E6D5]">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-[#FAFAF7] rounded-xl border border-[#E8E6D5]/60" />
      ))}
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 4 }) => (
  <div className="bg-white rounded-2xl border border-[#E8E6D5] overflow-hidden shadow-xs animate-pulse">
    <div className="p-4 bg-[#FAFAF7] border-b border-[#E8E6D5]">
      <div className="h-5 bg-[#E8E6D5] rounded w-1/4" />
    </div>
    <div className="divide-y divide-[#E8E6D5]/40">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center justify-between space-x-4">
          <div className="h-4 bg-[#E8E6D5] rounded w-1/4" />
          <div className="h-4 bg-[#E8E6D5]/70 rounded w-1/5" />
          <div className="h-4 bg-[#E8E6D5]/60 rounded w-1/6" />
          <div className="h-8 bg-[#E8E6D5]/80 rounded-lg w-24" />
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonCard;
