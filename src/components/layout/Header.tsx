import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Newspaper } from 'lucide-react';

export default function Header() {
  // TODO: Implement actual authentication state check later
  const isLoggedIn = false; // Placeholder

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:text-accent transition-colors">
          <Newspaper className="h-6 w-6 text-accent" />
          KabarSatu
        </Link>
        <nav>
          {/* Placeholder for potential future navigation links */}
        </nav>
        <div>
          {isLoggedIn ? (
            // TODO: Add user menu or logout button
            <Button variant="outline">Profil</Button>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
