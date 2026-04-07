import React from 'react';

const CardSkeleton = () => (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 animate-pulse">
        <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gray-100"></div>
            <div className="h-4 w-12 bg-gray-100 rounded"></div>
        </div>
        <div className="h-3 w-20 bg-gray-50 rounded mb-2"></div>
        <div className="h-8 w-24 bg-gray-100 rounded-lg"></div>
    </div>
);

const ChartSkeleton = () => (
    <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm min-h-[400px] flex flex-col animate-pulse">
        <div className="flex items-center justify-between mb-10">
            <div className="h-6 w-40 bg-gray-100 rounded"></div>
            <div className="h-8 w-24 bg-gray-50 rounded-xl"></div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100"></div>
    </div>
);

export { CardSkeleton, ChartSkeleton };
