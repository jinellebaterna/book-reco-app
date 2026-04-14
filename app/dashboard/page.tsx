"use client";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";

type Book = {
    id: string;
    title: string;
    author: string;
    description: string;
    created_at: string;
};

export default function Dashboard() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const res = await fetch("/api/books");
                const data = await res.json();
                setBooks(data.books || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8F9F5" }}>
            {/* Navbar */}
            <nav
                className="flex items-center justify-between px-8 py-4 border-b"
                style={{ borderColor: "#E5E7EB", backgroundColor: "#FFFFFF" }}
            >
                <span className="text-xl font-semibold" style={{ color: "#4A7C59" }}>
                    Paige
                </span>
                <div className="flex items-center gap-4">
                    <Link
                        href="/recommend"
                        className="px-4 py-2 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: "#7C9A7E" }}
                    >
                        Get Recommendations
                    </Link>
                    <button
                        onClick={() => signOut({ redirectUrl: "/" })}
                        className="text-sm"
                        style={{ color: "#6B7280" }}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-1" style={{ color: "#1C1C1C" }}>
                        Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
                    </h1>
                    <p style={{ color: "#6B7280" }}>Your saved books are waiting for you.</p>
                </div>

                {/* Books */}
                {loading ? (
                    <p style={{ color: "#6B7280" }}>Loading your books...</p>
                ) : books.length === 0 ? (
                    <div
                        className="rounded-2xl p-12 border text-center"
                        style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                    >
                        <p className="font-medium mb-2" style={{ color: "#1C1C1C" }}>
                            No saved books yet
                        </p>
                        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                            Get your first recommendations and save the ones you love.
                        </p>
                        <Link
                            href="/recommend"
                            className="px-6 py-3 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: "#7C9A7E" }}
                        >
                            Get Recommendations
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="rounded-2xl p-6 border"
                                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                            >
                                <h3 className="font-semibold mb-1" style={{ color: "#1C1C1C" }}>
                                    {book.title}
                                </h3>
                                <p className="text-sm mb-2" style={{ color: "#7C9A7E" }}>
                                    {book.author}
                                </p>
                                <p className="text-sm" style={{ color: "#6B7280" }}>
                                    {book.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}  