import type { NewsArticle } from "@/types"
import * as cheerio from "cheerio"
import axios from "axios"

async function scrapeKumparanIndonesia(): Promise<NewsArticle[] | null> {
    const url = "https://www.antaranews.com/"

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                "Upgrade-Insecure-Requests": "1",
            },
            timeout: 10000,
        })

        const $ = cheerio.load(html)
        const articles: NewsArticle[] = []

        // Select the first 3 articles
        $(".card__post.card__post-list")
            .slice(0, 3)
            .each((_, el) => {
                const article = $(el)
                const anchor = article.find(".card__post__title a")
                const title = anchor.attr("title") || ""
                const url = anchor.attr("href") || ""
                const imageUrl = article.find("picture img").attr("src") || ""
                const summary = title // Using title as summary
                let publicationDate = new Date().toISOString()

                const dateText = article.find(".card__post__author-info .text-secondary").text().trim()
                if (dateText.includes("menit lalu")) {
                    const minutesAgo = parseInt(dateText.split(" ")[0], 10)
                    if (!isNaN(minutesAgo)) {
                        const date = new Date()
                        date.setMinutes(date.getMinutes() - minutesAgo)
                        publicationDate = date.toISOString()
                    }
                } else if (dateText.includes("jam lalu")) {
                    const hoursAgo = parseInt(dateText.split(" ")[0], 10)
                    if (!isNaN(hoursAgo)) {
                        const date = new Date()
                        date.setHours(date.getHours() - hoursAgo)
                        publicationDate = date.toISOString()
                    }
                }

                articles.push({
                    title,
                    summary,
                    url,
                    imageUrl,
                    publicationDate,
                    source: "Kumparan Indonesia",
                })
            })

        return articles
    } catch (error) {
        console.error(`Error scraping Kumparan Indonesia articles:`, error)
        return null
    }
}

async function scrapeSindoNews(): Promise<NewsArticle[] | null> {
    try {
        const { data: html } = await axios.get("http://international.sindonews.com/jagad-jungkir-balik", {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                "Upgrade-Insecure-Requests": "1",
            },
            timeout: 10000,
        })

        const $ = cheerio.load(html)
        const articles: NewsArticle[] = []

        // Select articles with data-no values 2, 3, and 4
        $('.list-article[data-no="2"], .list-article[data-no="3"], .list-article[data-no="4"]').each((_, el) => {
            const article = $(el)
            const anchor = article.find("a")
            const title = article.find(".title-article.news-title").text().trim()
            const summary = article.find(".sub-kanal").text().trim() || title
            const url = anchor.attr("href") || ""
            const imageUrl = article.find(".img-article img").attr("src") || ""

            // Extract publication date
            let publicationDate = new Date().toISOString()
            const dateText = article.find(".date-article").text().trim()
            if (dateText) {
                if (dateText.includes("WIB")) {
                    // Format: "07 Mei 2025 - 18:29 WIB"
                    const dateMatch = dateText.match(/(\d+)\s+([^\s]+)\s+(\d{4})\s+-\s+(\d+):(\d+)/)
                    if (dateMatch) {
                        const day = dateMatch[1].padStart(2, "0")
                        const monthName = dateMatch[2]
                        const year = dateMatch[3]
                        const hour = dateMatch[4].padStart(2, "0")
                        const minute = dateMatch[5].padStart(2, "0")

                        // Convert month name to month number (assuming Indonesian month names)
                        const monthMapping: { [key: string]: string } = {
                            Jan: "01",
                            Feb: "02",
                            Mar: "03",
                            Apr: "04",
                            Mei: "05",
                            Jun: "06",
                            Jul: "07",
                            Agu: "08",
                            Sep: "09",
                            Okt: "10",
                            Nov: "11",
                            Des: "12",
                        }

                        const month = monthMapping[monthName] || "01"
                        const dateStr = `${year}-${month}-${day}T${hour}:${minute}:00`
                        publicationDate = new Date(dateStr).toISOString()
                    }
                } else if (dateText.includes("hari yang lalu")) {
                    // Format: "3 hari yang lalu"
                    const daysAgo = parseInt(dateText.split(" ")[0], 10)
                    if (!isNaN(daysAgo)) {
                        const date = new Date()
                        date.setDate(date.getDate() - daysAgo)
                        publicationDate = date.toISOString()
                    }
                }
            }

            articles.push({
                title,
                summary,
                url,
                imageUrl,
                publicationDate,
                source: "Sindo News",
            })
        })

        return articles
    } catch (error) {
        console.error(`Error scraping Sindonews articles:`, error)
        return null
    }
}

async function scrapeCnbcIndonesia(): Promise<NewsArticle[] | null> {
    const url = "https://www.cnbcindonesia.com/entrepreneur"
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                "Upgrade-Insecure-Requests": "1",
            },
            timeout: 10000,
        })

        const $ = cheerio.load(html)
        const articles: NewsArticle[] = []

        // Select the first 3 <article> elements
        $(".nhl-list article")
            .slice(0, 3)
            .each((_, el) => {
                const anchor = $(el).find("a")
                const title = anchor.find("h2").text().trim()
                const summary = title // Using title as summary since CNBC doesn't have separate summaries
                const url = anchor.attr("href") || ""
                const imageUrl = anchor.find("img").attr("src") || ""

                // Parse publication date
                let publicationDate = new Date().toISOString()
                const dateText = anchor.find(".text-xs.text-gray").text().trim()

                if (dateText) {
                    const daysAgoMatch = dateText.match(/(\d+) hari yang lalu/)
                    if (daysAgoMatch) {
                        const daysAgo = parseInt(daysAgoMatch[1], 10)
                        if (!isNaN(daysAgo)) {
                            const date = new Date()
                            date.setDate(date.getDate() - daysAgo)
                            publicationDate = date.toISOString()
                        }
                    } else if (dateText.includes("minggu yang lalu")) {
                        const date = new Date()
                        date.setDate(date.getDate() - 7)
                        publicationDate = date.toISOString()
                    }
                }

                articles.push({
                    title,
                    summary,
                    url,
                    imageUrl,
                    publicationDate,
                    source: "CNBC Indonesia",
                })
            })

        return articles
    } catch (error) {
        console.error(`Error scraping CNBC Indonesia articles at ${url}:`, error)
        return null
    }
}

export async function getNewsArticles(sources?: string[]): Promise<NewsArticle[]> {
    const allArticles: NewsArticle[] = []
    const sourceFunctions: { [key: string]: () => Promise<NewsArticle[] | null> } = {
        "Kumparan Indonesia": scrapeKumparanIndonesia,
        "Sindo News": scrapeSindoNews,
        "CNBC Indonesia": scrapeCnbcIndonesia,
    }

    if (sources) {
        for (const source of sources) {
            const articles = await sourceFunctions[source]()
            if (articles) {
                allArticles.push(...articles)
            }
        }
    } else {
        for (const source in sourceFunctions) {
            const articles = await sourceFunctions[source]()
            if (articles) {
                allArticles.push(...articles)
            }
        }
    }

    // if (allArticles.length !== 0) {
    //     deleteAllArticles()
    // }

    // insertArticlesBatch(allArticles)    

    return allArticles
}
