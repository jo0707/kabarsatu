import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter from Google Fonts
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import Header from '@/components/layout/Header'; // Import Header
import AuthProvider from '@/components/providers/AuthProvider'; // Import AuthProvider
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import authOptions

const inter = Inter({
  variable: '--font-inter', // Define CSS variable for Inter
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KabarSatu - Portal Berita Terkini', // Updated title
  description: 'Agregator berita dari berbagai sumber terpercaya', // Updated description
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session on the server to potentially pass down
  const session = await getServerSession(authOptions);

  return (
    <html lang="id"> {/* Set language to Indonesian */}
      <body className={`${inter.variable} font-sans antialiased`}> {/* Use Inter variable */}
         {/* Wrap everything with AuthProvider, passing the session */}
        <AuthProvider session={session}>
          <div className="flex min-h-screen flex-col">
            <Header /> {/* Header now might use useSession hook */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            {/* Optional: Add a Footer here later */}
          </div>
          <Toaster /> {/* Add Toaster for notifications */}
        </AuthProvider>
      </body>
    </html>
  );
}
