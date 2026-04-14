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
    status: "want_to_read" | "reading" | "finished";
    current_page: number;
    total_pages: number;
};

const STATUS_LABELS: Record<Book["status"], string> = {
    want_to_read: "Want to Read",
    reading: "Reading",
    finished: "Finished",
};

const STATUS_COLORS: Record<Book["status"], string> = {
    want_to_read: "#E8E0D0",
    reading: "#7C9A7E",
    finished: "#4A7C59",
};

const STATUS_TEXT_COLORS: Record<Book["status"], string> = {
    want_to_read: "#1C1C1C",
    reading: "#FFFFFF",
    finished: "#FFFFFF",
};

export default function Dashboard() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [progressForm, setProgressForm] = useState<{
        status: Book["status"];
        current_page: number;
        total_pages: number;
    }>({ status: "want_to_read", current_page: 0, total_pages: 0 });

    useEffect(() => {
        fetchBooks();
    }, []);

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

    function openProgressForm(book: Book) {
        setExpandedId(book.id);
        setProgressForm({
            status: book.status,
            current_page: book.current_page,
            total_pages: book.total_pages,
        });
    }

    async function handleProgressUpdate(bookId: string) {
        await fetch("/api/books/progress", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: bookId, ...progressForm }),
        });
        setExpandedId(null);
        fetchBooks();
    }

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
                        Welcome back{user?.firstName ? `, ${user.firstName}!` : "!"}
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
                                className="rounded-2xl p-6 border flex flex-col gap-3"
                                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                            >
                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-xs font-medium px-3 py-1 rounded-full"
                                        style={{
                                            backgroundColor: STATUS_COLORS[book.status],
                                            color: STATUS_TEXT_COLORS[book.status],
                                        }}
                                    >
                                        {STATUS_LABELS[book.status]}
                                    </span>
                                </div>

                                {/* Book Info */}
                                <div>
                                    <h3 className="font-semibold mb-1" style={{ color: "#1C1C1C" }}>
                                        {book.title}
                                    </h3>
                                    <p className="text-sm mb-1" style={{ color: "#7C9A7E" }}>
                                        {book.author}
                                    </p>
                                    <p className="text-sm" style={{ color: "#6B7280" }}>
                                        {book.description}
                                    </p>
                                </div>

                                {/* Progress Bar (only for reading) */}
                                {book.status === "reading" && book.total_pages > 0 && (
                                    <div>
                                        <div className="flex justify-between text-xs mb-1" style={{ color: "#6B7280" }}>
                                            <span>Page {book.current_page} of {book.total_pages}</span>
                                            <span>{Math.round((book.current_page / book.total_pages) * 100)}%</span>
                                        </div>
                                        <div className="w-full rounded-full h-2" style={{ backgroundColor: "#E5E7EB" }}>
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{
                                                    backgroundColor: "#7C9A7E",
                                                    width: `${Math.min((book.current_page / book.total_pages) * 100, 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Update Progress */}
                                {expandedId === book.id ? (
                                    <div className="flex flex-col gap-3 pt-2 border-t" style={{ borderColor: "#E5E7EB" }}>
                                        <select
                                            value={progressForm.status}
                                            onChange={(e) => setProgressForm((p) => ({ ...p, status: e.target.value as Book["status"] }))}
                                            className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                                            style={{ borderColor: "#E5E7EB", color: "#1C1C1C" }}
                                        >
                                            <option value="want_to_read">Want to Read</option>
                                            <option value="reading">Reading</option>
                                            <option value="finished">Finished</option>
                                        </select>
                                        {progressForm.status === "reading" && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Current page"
                                                    value={progressForm.current_page || ""}
                                                    onChange={(e) => setProgressForm((p) => ({ ...p, current_page: Number(e.target.value) }))}
                                                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                                                    style={{ borderColor: "#E5E7EB", color: "#1C1C1C" }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Total pages"
                                                    value={progressForm.total_pages || ""}
                                                    onChange={(e) => setProgressForm((p) => ({ ...p, total_pages: Number(e.target.value) }))}
                                                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                                                    style={{ borderColor: "#E5E7EB", color: "#1C1C1C" }}
                                                />
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleProgressUpdate(book.id)}
                                                className="flex-1 py-2 rounded-full text-sm font-medium text-white"
                                                style={{ backgroundColor: "#7C9A7E" }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setExpandedId(null)}
                                                className="flex-1 py-2 rounded-full text-sm font-medium border"
                                                style={{ borderColor: "#E5E7EB", color: "#6B7280" }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openProgressForm(book)}
                                        className="self-start text-sm"
                                        style={{ color: "#7C9A7E" }}
                                    >
                                        Update Progress
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}                