// src/components/news/ArticleImage.tsx
'use client';

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
    <img
      src={src}
      alt={alt}
      className="object-cover w-full h-full"
      data-ai-hint="news article detail"
      onError={() => {
        console.error(`Failed to load image: ${src}`);
        setImageError(true);
      }}
    />
  );
}
