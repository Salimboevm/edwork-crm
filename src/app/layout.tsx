// Root Layout with Internationalization - /src/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { getDictionary } from '@/lib/dictionaries';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'uz' }];
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dict = await getDictionary(locale);
  
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Navbar dictionary={dict.navigation} locale={locale} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}