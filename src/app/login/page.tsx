'use client'; // Mark as client component for using hooks and event handlers

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react"; // Using Chrome as a placeholder for Google icon
import { signIn } from "next-auth/react"; // Import signIn from next-auth
import { useSearchParams } from "next/navigation"; // To get callbackUrl

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // Get callbackUrl or default to home

  const handleGoogleLogin = async () => {
    // Use next-auth signIn function for Google provider
    await signIn("google", { callbackUrl });
    // No need for alert, signIn handles redirection
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login ke KabarSatu</CardTitle>
          <CardDescription>Gunakan akun Google Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           {/* Placeholder for potential username/password form if needed later */}
           {/* ... */}
           <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <Chrome className="mr-2 h-5 w-5" /> {/* Placeholder Icon */}
            Login dengan Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
