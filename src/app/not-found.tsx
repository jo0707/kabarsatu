import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-muted-foreground mb-6">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Button asChild>
        <Link href="/">Kembali ke Halaman Utama</Link>
      </Button>
    </div>
  );
}
