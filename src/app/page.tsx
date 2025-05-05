import type { NewsArticle } from '@/types';
import { getNewsArticles } from '@/services/news-aggregator';
import NewsCard from '@/components/news/NewsCard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function NewsList() {
  // Fetch news articles - let the service handle default sources or scraping logic
  const articles: NewsArticle[] = await getNewsArticles();

  if (!articles || articles.length === 0) {
    return <p className="text-center text-muted-foreground">Belum ada berita tersedia atau gagal mengambil data.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.url} article={article} />
      ))}
    </div>
  );
}

function NewsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-1/4 pt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}


export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 border-b pb-2">Berita Utama</h1>
      <Suspense fallback={<NewsListSkeleton />}>
         {/* Type assertion needed because TS can't infer the awaited promise type in JSX */}
        <NewsList />
      </Suspense>
    </div>
  );
}
