import { NewsArticle } from "@/types"
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    deleteField,
    writeBatch,
    Timestamp,
    getFirestore,
} from "firebase/firestore"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

const COLLECTION_NAME = "newsArticles"
const collectionRef = collection(db, COLLECTION_NAME)

// CREATE one
export async function createArticle(article: NewsArticle) {
    const docRef = doc(db, COLLECTION_NAME, encodeURIComponent(article.url))
    await setDoc(docRef, article)
    return docRef.id
}

// READ all
export async function getAllArticles(): Promise<NewsArticle[]> {
    const snapshot = await getDocs(collectionRef)
    return snapshot.docs.map((doc) => doc.data() as NewsArticle)
}

// READ one
export async function getArticleByUrl(url: string): Promise<NewsArticle | null> {
    const docRef = doc(db, COLLECTION_NAME, encodeURIComponent(url))
    const snapshot = await getDoc(docRef)
    return snapshot.exists() ? (snapshot.data() as NewsArticle) : null
}

// UPDATE by URL
export async function updateArticle(url: string, updates: Partial<NewsArticle>) {
    const docRef = doc(db, COLLECTION_NAME, encodeURIComponent(url))
    await updateDoc(docRef, updates)
}

// DELETE one
export async function deleteArticle(url: string) {
    const docRef = doc(db, COLLECTION_NAME, encodeURIComponent(url))
    await deleteDoc(docRef)
}

// INSERT batch (max 500 per batch)
export async function insertArticlesBatch(articles: NewsArticle[]) {
    const batch = writeBatch(db)

    articles.forEach((article) => {
        const docRef = doc(db, COLLECTION_NAME, encodeURIComponent(article.url))
        batch.set(docRef, article)
    })

    await batch.commit()
}

// DELETE all (careful!)
export async function deleteAllArticles() {
    const snapshot = await getDocs(collectionRef)
    const batch = writeBatch(db)

    snapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref)
    })

    await batch.commit()
}
