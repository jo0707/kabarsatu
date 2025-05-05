import type { Metadata } from 'next';
import { GeistSans } from 'next/font/google'; // Use GeistSans directly
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import Header from '@/components/layout/Header'; // Import Header

const geistSans = GeistSans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Removed Geist Mono as it wasn't explicitly requested

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
      <body className={`${geistSans.variable} font-sans antialiased`}>
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
