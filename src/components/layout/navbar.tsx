// Navbar Component - /src/components/layout/navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './language-switcher';

export function Navbar({ dictionary, locale }: { dictionary: any, locale: string }) {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={`/${locale}`} className="font-bold text-xl text-purple-800 flex items-center">
              <Image 
                src="/logo.png" 
                alt="EdWork CRM" 
                width={32} 
                height={32} 
                className="mr-2"
              />
              EdWork CRM
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href={`/${locale}`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === `/${locale}` ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                {dictionary.dashboard}
              </Link>
              <Link
                href={`/${locale}/courses`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.includes(`/${locale}/courses`) ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                {dictionary.courses}
              </Link>
              <Link
                href={`/${locale}/institutions`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.includes(`/${locale}/institutions`) ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                {dictionary.universities}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </nav>
  );
}