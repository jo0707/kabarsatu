'use client'; // Mark as client component for potential future interaction

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Import Google icon or use a library like lucide-react if available
import { Chrome } from "lucide-react"; // Using Chrome as a placeholder for Google icon

export default function LoginPage() {

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth2 login flow
    alert("Fungsi Login Google belum diimplementasikan.");
    // This would typically redirect to Google's OAuth endpoint
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
           {/* <div className="space-y-4">
             <Input id="email" placeholder="Email" type="email" />
             <Input id="password" placeholder="Password" type="password" />
           </div>
           <Button type="submit" className="w-full">Login Manual</Button>
           <Separator className="my-4" /> */}
           <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <Chrome className="mr-2 h-5 w-5" /> {/* Placeholder Icon */}
            Login dengan Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
