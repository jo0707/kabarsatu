/**
 * Represents a news article with standardized metadata.
 */
export interface NewsArticle {
  /**
   * The title of the news article.
   */
  title: string;
  /**
   * A brief summary or excerpt of the news article.
   */
  summary: string;
  /**
   * The URL of the news article. Used as a unique identifier/slug.
   */
  url: string;
  /**
   * The URL of the news article's image.
   */
  imageUrl: string;
  /**
   * The publication date and time of the news article in ISO format.
   */
  publicationDate: string;
  /**
   * The source or publication from which the news article originated.
   */
  source: string;
}
