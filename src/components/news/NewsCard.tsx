import Link from 'next/link';
import Image from 'next/image';
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
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Handle invalid date string
        console.warn(`Invalid date format for article: ${article.title}`);
        return 'Tanggal tidak valid';
      }
      return formatDistanceToNow(date, { addSuffix: true, locale: id });
    } catch (error) {
      console.error(`Error formatting date for article: ${article.title}`, error);
      return 'Beberapa waktu lalu'; // Fallback text
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
      <a className="block group">
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:border-accent">
           <CardHeader className="p-0">
             <div className="relative aspect-video w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint="news article"
                  priority={true} // Prioritize images above the fold
                  unoptimized={article.imageUrl.startsWith('https://picsum.photos')} // Disable optimization for Picsum
                />
              </div>
           </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
               {truncatedTitle}
            </CardTitle>
             <p className="text-sm text-muted-foreground line-clamp-3">
               {article.summary}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
             <Badge variant="secondary">{article.source}</Badge>
             <span className="flex items-center gap-1">
               <Clock className="h-3 w-3" />
               {formatRelativeTime(article.publicationDate)}
             </span>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
