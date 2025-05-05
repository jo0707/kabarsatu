import { getNewsArticles } from '@/services/news-aggregator';
import type { NewsArticle } from '@/types';
import Image from 'next/image';
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
      // Attempt to parse common non-standard formats if necessary, or return fallback
      // Example: Try parsing DD/MM/YYYY if ISO fails (add more as needed)
      // const parts = dateString.split('/');
      // if (parts.length === 3) {
      //   const parsed = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      //   if (!isNaN(parsed.getTime())) {
      //       return format(parsed, "EEEE, dd MMMM yyyy HH:mm 'WIB'", { locale: id });
      //   }
      // }
      return 'Tanggal tidak valid';
    }
    // Example format: Senin, 29 Juli 2024 16:30 WIB
    // Note: Timezone handling might need adjustment based on source data/requirements
    // Assuming the ISO string is in UTC, adjust accordingly if it's local time.
    return format(date, "EEEE, dd MMMM yyyy HH:mm 'WIB'", { locale: id });
  } catch (error) {
    console.error(`Error formatting date in detail page: ${dateString}`, error);
    return 'Format tanggal bermasalah'; // More specific fallback
  }
};

// Function to render article content (handles basic HTML or plain text)
const renderArticleContent = (content: string | undefined, summary: string): React.ReactNode => {
    if (content) {
        // Basic sanitization/check (in real app, use a proper sanitizer like DOMPurify)
        if (content.includes('<script')) {
             console.warn("Potential script tag found in content, rendering as text.");
             return <p>{content}</p>; // Render as plain text if potentially unsafe
        }

        // Attempt to render as HTML if it looks like HTML
        // A more robust check would involve cheerio or regex
        if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
            try {
                // Use dangerouslySetInnerHTML cautiously. Ensure content is trusted or sanitized.
                // For this example, we assume the simulated scraped content is safe.
                 return <div dangerouslySetInnerHTML={{ __html: content }} />;
            } catch (e) {
                 console.error("Error rendering potentially unsafe HTML content", e);
                 return <p>{content}</p>; // Fallback to plain text
            }
        } else {
            // Render as plain text paragraphs
            return content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ));
        }
    }

    // Fallback content if no full content is available
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
  // Decode the URL slug which contains the original article URL
  const decodedUrl = decodeURIComponent(slug);

  // Fetch all articles (simulating finding the specific one by URL)
  // In a real-world scenario with a database, you'd fetch by ID or slug directly.
  const articles = await getNewsArticles(); // Fetches based on the scraping logic now
  const article = articles.find((a) => a.url === decodedUrl);

  if (!article) {
    console.log(`Article not found for decoded URL: ${decodedUrl}`);
    notFound(); // Show 404 if article not found
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
          {article.imageUrl ? (
             <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 66vw"
                className="object-cover"
                data-ai-hint="news article detail"
                priority // Prioritize the main image
                // Only unoptimize if it's explicitly a picsum URL (or other known unoptimized source)
                unoptimized={article.imageUrl.includes('picsum.photos')}
                onError={(e) => {
                    console.error(`Failed to load image: ${article.imageUrl}`);
                    // Optionally replace src with a fallback image on error
                    // e.currentTarget.src = '/images/fallback.png';
                 }}
             />
          ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">
                 Gambar tidak tersedia
             </div>
          )}

        </div>
      </header>

      {/* Use prose for typography styling, max-w-none to override default width limit */}
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

// Optional: Generate static paths if you know the articles beforehand
// export async function generateStaticParams() {
//   // Fetch articles based on your scraping/data source logic
//   const articles = await getNewsArticles();
//   return articles.map((article) => ({
//     slug: encodeURIComponent(article.url),
//   }));
// }

// Add metadata generation
export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = params;
  const decodedUrl = decodeURIComponent(slug);
  const articles = await getNewsArticles(); // Fetch based on scraping logic
  const article = articles.find((a) => a.url === decodedUrl);

  if (!article) {
    return {
      title: 'Berita Tidak Ditemukan | KabarSatu',
    };
  }

  const effectiveImageUrl = article.imageUrl || '/images/default-og-image.png'; // Fallback OG image

  return {
    title: `${article.title} | KabarSatu`,
    description: article.summary,
    openGraph: {
        title: article.title,
        description: article.summary,
        images: [
            {
                url: effectiveImageUrl,
                width: 600, // Adjust if actual image dimensions are known
                height: 400, // Adjust if actual image dimensions are known
                alt: article.title,
            },
        ],
        url: `/berita/${slug}`, // Use the app's URL for the detail page
        siteName: 'KabarSatu',
        type: 'article',
        publishedTime: article.publicationDate || undefined, // Only include if valid
        authors: [article.source || 'KabarSatu'], // Use source as author placeholder
    },
     twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        images: [effectiveImageUrl],
    },
  };
}
