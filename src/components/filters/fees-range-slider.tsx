// Fees Range Slider Component - /src/components/filters/fees-range-slider.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function FeesRangeSlider({ 
  title, 
  minLabel, 
  maxLabel,
  onChange 
}: { 
  title: string; 
  minLabel: string;
  maxLabel: string;
  onChange: (min: number, max: number) => void;
}) {
  const searchParams = useSearchParams();
  const [minFee, setMinFee] = useState(parseInt(searchParams.get('minFee') || '0'));
  const [maxFee, setMaxFee] = useState(parseInt(searchParams.get('maxFee') || '300000'));
  
  useEffect(() => {
    // Only trigger onChange when user stops typing for 500ms
    const timer = setTimeout(() => {
      onChange(minFee, maxFee);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [minFee, maxFee, onChange]);
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <input
            type="number"
            value={minFee}
            onChange={(e) => setMinFee(parseInt(e.target.value) || 0)}
            placeholder={minLabel}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-1/2">
          <input
            type="number"
            value={maxFee}
            onChange={(e) => setMaxFee(parseInt(e.target.value) || 0)}
            placeholder={maxLabel}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-purple-600 rounded-full"
          style={{
            left: `${(minFee / 300000) * 100}%`,
            right: `${100 - (maxFee / 300000) * 100}%`,
          }}
        ></div>
        <div
          className="absolute w-6 h-6 bg-purple-600 rounded-full -mt-2 -ml-3 cursor-pointer"
          style={{ left: `${(minFee / 300000) * 100}%` }}
        ></div>
        <div
          className="absolute w-6 h-6 bg-purple-600 rounded-full -mt-2 -ml-3 cursor-pointer"
          style={{ left: `${(maxFee / 300000) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
