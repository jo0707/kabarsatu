import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter from Google Fonts
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import Header from '@/components/layout/Header'; // Import Header

const inter = Inter({
  variable: '--font-inter', // Define CSS variable for Inter
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KabarSatu - Portal Berita Terkini', // Updated title
  description: 'Agregator berita dari berbagai sumber terpercaya', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id"> {/* Set language to Indonesian */}
      <body className={`${inter.variable} font-sans antialiased`}> {/* Use Inter variable */}
        <div className="flex min-h-screen flex-col">
          <Header /> {/* Add the Header */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          {/* Optional: Add a Footer here later */}
        </div>
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
