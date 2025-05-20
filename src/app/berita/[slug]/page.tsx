import { getNewsArticles } from '@/services/news-aggregator';
import type { NewsArticle } from '@/types';
// Import the new client component for rendering images
import ArticleImage from '@/components/news/ArticleImage';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import * as cheerio from 'cheerio'; // Import cheerio to potentially parse scraped HTML

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

// Function to safely format date
const formatFullDate = (dateString: string): string => {
  if (!dateString) {
    console.warn('Missing date string in detail page');
    return 'Tanggal tidak diketahui';
  }
  try {
    const date = new Date(dateString);
    // Check if the date object is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format in detail page: ${dateString}`);
      return 'Tanggal tidak valid';
    }
    return format(date, "EEEE, dd MMMM yyyy HH:mm 'WIB'", { locale: id });
  } catch (error) {
    console.error(`Error formatting date in detail page: ${dateString}`, error);
    return 'Format tanggal bermasalah';
  }
};

// Function to render article content (handles basic HTML or plain text)
const renderArticleContent = (content: string | undefined, summary: string): React.ReactNode => {
    if (content) {
        if (content.includes('<script')) {
             console.warn("Potential script tag found in content, rendering as text.");
             return <p>{content}</p>;
        }
        if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
            try {
                 return <div dangerouslySetInnerHTML={{ __html: content }} />;
            } catch (e) {
                 console.error("Error rendering potentially unsafe HTML content", e);
                 return <p>{content}</p>;
            }
        } else {
            return content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ));
        }
    }
    return (
        <>
            <p className="lead text-xl mb-6">{summary}</p>
            <Alert variant="default" className="my-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Konten Lengkap Tidak Tersedia</AlertTitle>
              <AlertDescription>
                Saat ini kami hanya menampilkan ringkasan berita. Untuk membaca artikel selengkapnya, silakan kunjungi sumber asli.
              </AlertDescription>
            </Alert>
             <p>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
             </p>
        </>
    );
};


export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = params;
  const decodedUrl = decodeURIComponent(slug);
  const articles = await getNewsArticles();
  const article = articles.find((a) => a.url === decodedUrl);

  if (!article) {
    console.log(`Article not found for decoded URL: ${decodedUrl}`);
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto bg-card p-6 md:p-8 rounded-lg shadow-md">
      <header className="mb-8">
        <Badge variant="secondary" className="mb-2">{article.source || 'Sumber Tidak Diketahui'}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{article.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>{formatFullDate(article.publicationDate)}</span>
        </div>
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md mb-6 bg-muted">
          {/* Use the new ArticleImage client component */}
          <ArticleImage
            src={article.imageUrl}
            alt={article.title}
            priority
            unoptimized={article.imageUrl?.includes('picsum.photos')}
          />
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {renderArticleContent(article.content, article.summary)}
      </div>

      <footer className="mt-8 pt-6 border-t">
         <Button asChild variant="outline">
           <Link href={article.url} target="_blank" rel="noopener noreferrer">
             Baca Selengkapnya di {article.source || 'Sumber Asli'}
             <ExternalLink className="ml-2 h-4 w-4" />
           </Link>
         </Button>
      </footer>
    </article>
  );
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = params;
  const decodedUrl = decodeURIComponent(slug);
  const articles = await getNewsArticles();
  const article = articles.find((a) => a.url === decodedUrl);

  if (!article) {
    return {
      title: 'Berita Tidak Ditemukan | KabarSatu',
    };
  }

  const effectiveImageUrl = article.imageUrl || '/images/default-og-image.png';

  return {
    title: `${article.title} | KabarSatu`,
    description: article.summary,
    openGraph: {
        title: article.title,
        description: article.summary,
        images: [
            {
                url: effectiveImageUrl,
                width: 600,
                height: 400,
                alt: article.title,
            },
        ],
        url: `/berita/${slug}`,
        siteName: 'KabarSatu',
        type: 'article',
        publishedTime: article.publicationDate || undefined,
        authors: [article.source || 'KabarSatu'],
    },
     twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        images: [effectiveImageUrl],
    },
  };
}
