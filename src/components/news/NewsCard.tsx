'use client'; // Mark as a Client Component

import Link from 'next/link';
import type { NewsArticle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
import { Clock } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  // Function to safely parse date and format distance
  const formatRelativeTime = (dateString: string): string => {
    if (!dateString) {
      console.warn(`Missing date string for article: ${article.title}`);
      return 'Kapan lalu'; // Improved fallback
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Handle invalid date string
        console.warn(`Invalid date format for article: ${article.title}, value: ${dateString}`);
        return 'Tanggal tidak valid';
      }
      return formatDistanceToNow(date, { addSuffix: true, locale: id });
    } catch (error) {
      console.error(`Error formatting date for article: ${article.title}`, error);
      return 'Beberapa waktu lalu'; // Keep original fallback for errors
    }
  };

  // Limit title length (example: 70 characters)
  const truncatedTitle = article.title.length > 70
    ? article.title.substring(0, 70) + '...'
    : article.title;

  // Encode the URL to be used as a slug
  const slug = encodeURIComponent(article.url);


  return (
    <Link href={`/berita/${slug}`} legacyBehavior>
      <a className="block group h-full"> {/* Ensure link takes full height */}
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-accent border bg-card text-card-foreground shadow-sm">
           <CardHeader className="p-0">
             <div className="relative aspect-video w-full bg-muted"> {/* Add background color */}
                <img
                  src={article.imageUrl || '/images/placeholder-news.svg'} // Fallback image
                  alt={article.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint="news article list"
                  onError={(e) => {
                    console.warn(`Failed to load image for article: ${article.title}, URL: ${article.imageUrl}`);
                    // Optionally set a visible fallback or hide the image element
                    // e.currentTarget.style.display = 'none';
                    // Or replace src: e.currentTarget.src = '/images/placeholder-error.svg';
                  }}
                />
              </div>
           </CardHeader>
          <CardContent className="p-4 flex-grow flex flex-col"> {/* Make content grow */}
            <CardTitle className="text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
               {truncatedTitle}
            </CardTitle>
             <p className="text-sm text-muted-foreground line-clamp-3 flex-grow"> {/* Allow summary to grow */}
               {article.summary}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-2 flex justify-between items-center text-xs text-muted-foreground"> {/* Reduced top padding */}
             <Badge variant="secondary" className="shrink-0">{article.source || 'N/A'}</Badge>
             <span className="flex items-center gap-1 text-right shrink-0">
               <Clock className="h-3 w-3" />
               {formatRelativeTime(article.publicationDate)}
             </span>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
