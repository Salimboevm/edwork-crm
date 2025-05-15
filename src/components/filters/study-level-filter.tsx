// Study Level Filter Component - /src/components/filters/study-level-filter.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export function StudyLevelFilter({ 
  title, 
  onChange,
  dictionary
}: { 
  title: string; 
  onChange: (value: string) => void;
  dictionary: any;
}) {
  const searchParams = useSearchParams();
  const currentLevel = searchParams.get('level');
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Study Level"
          value={currentLevel || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
