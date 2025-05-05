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

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

// Function to safely format date
const formatFullDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
       console.warn(`Invalid date format in detail page: ${dateString}`);
       return 'Tanggal tidak valid';
    }
    // Example format: Senin, 29 Juli 2024 16:30 WIB
    // Note: Timezone handling might need adjustment based on source data/requirements
    return format(date, "EEEE, dd MMMM yyyy HH:mm 'WIB'", { locale: id });
  } catch (error) {
     console.error(`Error formatting date in detail page: ${dateString}`, error);
     return 'Beberapa waktu lalu';
  }
};


export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = params;
  const decodedUrl = decodeURIComponent(slug);

  // Fetch all articles (simulating finding the specific one)
  // In a real app, you'd fetch only the required article if possible
  const articles = await getNewsArticles();
  const article = articles.find((a) => a.url === decodedUrl);

  if (!article) {
    notFound(); // Show 404 if article not found
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <Badge variant="secondary" className="mb-2">{article.source}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{article.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>{formatFullDate(article.publicationDate)}</span>
        </div>
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md mb-6">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 66vw"
            className="object-cover"
            data-ai-hint="news article detail"
            priority // Prioritize the main image
            unoptimized={article.imageUrl.startsWith('https://picsum.photos')} // Disable optimization for Picsum
          />
        </div>
      </header>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        {/* Displaying summary as placeholder for full content */}
        <p className="lead text-xl mb-6">{article.summary}</p>

        {/* Placeholder for full article content */}
        <p>
          [Konten artikel lengkap akan ditampilkan di sini. Untuk saat ini, kami menggunakan ringkasan sebagai placeholder.]
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
         <p>
          Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur aliquet quam id dui posuere blandit. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Nulla porttitor accumsan tincidunt. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
        </p>

      </div>

      <footer className="mt-8 pt-4 border-t">
         <Button asChild variant="outline">
           <Link href={article.url} target="_blank" rel="noopener noreferrer">
             Baca Selengkapnya di {article.source}
             <ExternalLink className="ml-2 h-4 w-4" />
           </Link>
         </Button>
      </footer>
    </article>
  );
}

// Optional: Generate static paths if you know the articles beforehand
// export async function generateStaticParams() {
//   const articles = await getNewsArticles();
//   return articles.map((article) => ({
//     slug: encodeURIComponent(article.url),
//   }));
// }

// Add metadata generation
export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = params;
  const decodedUrl = decodeURIComponent(slug);
  const articles = await getNewsArticles();
  const article = articles.find((a) => a.url === decodedUrl);

  if (!article) {
    return {
      title: 'Berita Tidak Ditemukan',
    };
  }

  return {
    title: `${article.title} | KabarSatu`,
    description: article.summary,
    openGraph: {
        title: article.title,
        description: article.summary,
        images: [
            {
                url: article.imageUrl,
                width: 600, // Example width
                height: 400, // Example height
                alt: article.title,
            },
        ],
        url: `/berita/${slug}`, // Use the app's URL for the detail page
        siteName: 'KabarSatu',
        type: 'article',
        publishedTime: article.publicationDate,
        authors: [article.source], // Use source as author placeholder
    },
     twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        images: [article.imageUrl],
    },
  };
}
