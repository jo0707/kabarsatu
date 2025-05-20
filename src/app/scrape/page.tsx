import { getNewsArticles } from "@/services/news-aggregator"
import Link from "next/link";


function BackButton() {
    return (
        <div className="mt-4">
            <Link href="/">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Kembali ke Beranda
                </button>
            </Link>
        </div>
    );
}

export default async function Page() {
    const articles = await getNewsArticles();
    return (
        <div>
            <BackButton />
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {JSON.stringify(articles, null, 2)}
            </pre>
        </div>
    );
}