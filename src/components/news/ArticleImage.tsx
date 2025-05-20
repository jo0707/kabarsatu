// src/components/news/ArticleImage.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ArticleImageProps {
  src: string | undefined;
  alt: string;
  priority?: boolean;
  unoptimized?: boolean;
}

export default function ArticleImage({ src, alt, priority, unoptimized }: ArticleImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="flex items-center justify-center h-full w-full text-muted-foreground bg-muted rounded-lg aspect-video">
        Gambar tidak dapat dimuat
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 66vw"
      className="object-cover"
      data-ai-hint="news article detail"
      priority={priority}
      unoptimized={unoptimized}
      onError={() => {
        console.error(`Failed to load image: ${src}`);
        setImageError(true);
      }}
    />
  );
}
