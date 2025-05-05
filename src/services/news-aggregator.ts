import type { NewsArticle } from "@/types";
import * as cheerio from 'cheerio';

// --- Helper Function for Scraping (Example) ---
async function scrapeExampleArticle(url: string, sourceName: string): Promise<NewsArticle | null> {
    try {
        // IMPORTANT: In a real scenario, fetch the actual URL.
        // We are using placeholder HTML here to demonstrate scraping without hitting external sites.
        // const response = await fetch(url, { headers: { 'User-Agent': 'KabarSatu-Aggregator/1.0' } });
        // if (!response.ok) {
        //     console.error(`Failed to fetch ${url}: ${response.statusText}`);
        //     return null;
        // }
        // const html = await response.text();

        // --- SIMULATED HTML CONTENT ---
        // Replace this with actual fetched HTML in a real implementation
        const simulatedHtml = `
        <html>
            <head><title>Example Article Title</title></head>
            <body>
                <article>
                    <header>
                        <h1>Terobosan Teknologi AI Mengubah Industri Kesehatan Global</h1>
                        <img src="https://picsum.photos/seed/aihealth/600/400" alt="AI in health">
                        <time datetime="2024-07-28T09:00:00Z">July 28, 2024</time>
                    </header>
                    <div class="summary">
                        <p>Kecerdasan buatan merevolusi diagnosis penyakit, penemuan obat baru...</p>
                    </div>
                    <a href="${url}" class="original-link">Read more</a>
                </article>
            </body>
        </html>`;
        // --- END SIMULATED HTML ---

        const $ = cheerio.load(simulatedHtml); // Use simulatedHtml instead of fetched html

        // --- SELECTORS (Adjust based on actual target website structure) ---
        const title = $('article h1').first().text().trim();
        const summary = $('div.summary p').first().text().trim();
        // Prioritize specific image tag, fallback to og:image or first img
        let imageUrl = $('article header img').first().attr('src');
        if (!imageUrl) {
            imageUrl = $('meta[property="og:image"]').attr('content');
        }
        if (!imageUrl) {
             imageUrl = $('img').first().attr('src');
        }
         // Make image URL absolute if it's relative
         if (imageUrl && !imageUrl.startsWith('http')) {
             try {
                const pageUrl = new URL(url);
                imageUrl = new URL(imageUrl, pageUrl.origin).toString();
             } catch (e) {
                 console.warn(`Could not make image URL absolute for ${url}: ${imageUrl}`);
                 imageUrl = `https://picsum.photos/seed/${Math.random()}/600/400`; // Fallback placeholder
             }

         } else if (!imageUrl) {
             imageUrl = `https://picsum.photos/seed/${Math.random()}/600/400`; // Fallback placeholder if no image found
         }


        // Extract and parse date (requires robust parsing based on site format)
        const publicationDateStr = $('article header time').first().attr('datetime');
        let publicationDate: string;
        if (publicationDateStr && !isNaN(new Date(publicationDateStr).getTime())) {
            publicationDate = new Date(publicationDateStr).toISOString();
        } else {
             console.warn(`Could not parse date for ${url}. Using current time.`);
             publicationDate = new Date().toISOString(); // Fallback to now
        }

        // --- Basic Validation ---
        if (!title || !summary || !url) {
             console.warn(`Missing essential data for article from ${sourceName} at ${url}`);
             return null;
        }


        return {
            title,
            summary,
            url, // Use the original URL provided
            imageUrl,
            publicationDate,
            source: sourceName,
        };

    } catch (error) {
        console.error(`Error scraping ${sourceName} article at ${url}:`, error);
        return null;
    }
}


/**
 * Asynchronously retrieves and aggregates news articles by scraping example sources.
 *
 * NOTE: This implementation uses *simulated* scraping on placeholder HTML.
 * In a real application, this would fetch and parse live web pages.
 * Respect robots.txt and terms of service of target websites. Add delays
 * and error handling to be a responsible scraper.
 *
 * @param sources Optional array of source identifiers (currently mapped to example URLs).
 * @returns A promise that resolves to an array of NewsArticle objects.
 */
export async function getNewsArticles(sources?: string[]): Promise<NewsArticle[]> {

  // Map source identifiers to example URLs and names
  const sourceMap: { [key: string]: { url: string, name: string } } = {
    'teknologi': { url: "https://example.com/news/ai-kesehatan-global", name: "Berita Teknologi Terkini" },
    'ekonomi': { url: "https://example.com/news/pasar-saham-asia-stimulus", name: "Warta Ekonomi Global" },
    'energi': { url: "https://example.com/news/indonesia-energi-terbarukan-2030", name: "Kabar Nusantara Hijau" },
    'sains': { url: "https://example.com/news/spesies-laut-dalam-mariana", name: "Jurnal Sains Kelautan" },
    'hiburan': { url: "https://example.com/news/festival-film-internasional-luring", name: "Sorotan Hiburan Dunia" },
    'bisnis': { url: "https://example.com/news/startup-edutech-pendanaan-seri-b", name: "Bisnis Digital Hari Ini" },
  };

  // Use provided sources or default to all examples
  const sourcesToScrape = sources && sources.length > 0
    ? sources.filter(s => s in sourceMap)
    : Object.keys(sourceMap);

  if (sourcesToScrape.length === 0) {
    console.warn("No valid sources provided or mapped for scraping.");
    return [];
  }

  console.log(`Attempting to scrape sources: ${sourcesToScrape.join(', ')}`);

  // --- Scraping Execution ---
  const scrapingPromises = sourcesToScrape.map(key => {
      const sourceInfo = sourceMap[key];
      // Simulate scraping one article per source
      return scrapeExampleArticle(sourceInfo.url, sourceInfo.name);
  });

  // Wait for all scraping attempts to complete
  const results = await Promise.all(scrapingPromises);

  // Filter out null results (failed scrapes)
  const articles: NewsArticle[] = results.filter((article): article is NewsArticle => article !== null);

  // Simulate network delay (optional, but good practice for real scraping)
  // await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  if (articles.length === 0) {
      console.log("No articles successfully scraped.");
      // Return placeholder data if scraping fails completely in this example
      return [
          {
              title: "Gagal Mengambil Berita (Contoh)",
              summary: "Tidak dapat mengambil berita dari sumber manapun saat ini. Ini adalah data contoh.",
              url: "https://example.com/fallback",
              imageUrl: "https://picsum.photos/seed/fallback/600/400",
              publicationDate: new Date().toISOString(),
              source: "Sistem KabarSatu",
          },
      ];
  }

  console.log(`Successfully scraped ${articles.length} articles.`);
  return articles;
}
