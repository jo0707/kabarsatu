'use client'; // Mark as client component to use hooks

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, Newspaper, User } from 'lucide-react'; // Import icons
import { useSession, signIn, signOut } from 'next-auth/react'; // Import NextAuth hooks
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function Header() {
  const { data: session, status } = useSession(); // Use session hook

  const isLoading = status === 'loading';

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
        <div className="flex items-center gap-4">
           {/* Placeholder for potential future links like 'About', 'Contact' */}
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" /> // Show skeleton while loading session
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? 'User'} />
                    <AvatarFallback>
                      {/* Show initials if no image */}
                       {session.user?.name
                          ? session.user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                          : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add other menu items like Profile, Settings later */}
                {/* <DropdownMenuItem>
                   <User className="mr-2 h-4 w-4" />
                   <span>Profil</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             // Use signIn function directly or link to login page
            <Button onClick={() => signIn('google')}>
               <LogIn className="mr-2 h-4 w-4" />
               Login
            </Button>
            // Or keep the link if preferred:
            // <Link href="/login">
            //   <Button>Login</Button>
            // </Link>
          )}
        </div>
      </div>
    </header>
  );
}
