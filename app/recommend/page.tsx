"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles, BookmarkPlus, Check, X } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const GENRES = ["Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Fantasy", "Romance", "Thriller", "Biography", "Self-Help",
    "History"];

const MOODS = [
    "Looking for adventure",
    "Want to learn something",
    "Need a laugh",
    "Want to cry",
    "Feeling romantic",
    "Want to be scared",
];

export default function RecommendPage() {
    const router = useRouter();
    const [genres, setGenres] = useState<string[]>([]);
    const [mood, setMood] = useState("");
    const [lovedBooks, setLovedBooks] = useState("");
    const [avoid, setAvoid] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<{ title: string; author: string; description: string }[]>([]);
    const [saving, setSaving] = useState<Record<string, { status: string; total_pages: number } | null>>({});
    const [currentPage, setCurrentPage] = useState(0);

    const resultsRef = useRef<HTMLDivElement>(null);

    const ITEMS_PER_PAGE = 5;
    const totalPages = Math.ceil(recommendations.length / ITEMS_PER_PAGE);
    const paginatedBooks = recommendations.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    function toggleGenre(genre: string) {
        setGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setRecommendations([]);
        try {
            const res = await fetch("/api/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ genres, mood, lovedBooks, avoid }),
            });
            const data = await res.json();
            setRecommendations(data.books || []);
            setCurrentPage(0);
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            {/* Navbar */}
            <nav
                className="flex items-center justify-between px-8 py-4 border-b"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
            >
                <span className="text-xl font-semibold" style={{ color: "var(--color-primary-dark)" }}>
                    Paige
                </span>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-1 text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        <ChevronLeft size={16} />
                        Back to Dashboard
                    </button>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
                    Find your next book
                </h1>
                <p className="mb-8" style={{ color: "var(--color-text-secondary)" }}>
                    Tell us what you&apos;re in the mood for.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Genres */}
                    <div>
                        <label className="block font-medium mb-3" style={{ color: "var(--color-text-primary)" }}>
                            What genres do you enjoy?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {GENRES.map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => toggleGenre(g)}
                                    className="px-4 py-2 rounded-full text-sm border transition-colors"
                                    style={{
                                        backgroundColor: genres.includes(g) ? "var(--color-primary)" : "var(--color-card)",
                                        color: genres.includes(g) ? "#FFFFFF" : "var(--color-text-primary)",
                                        borderColor: genres.includes(g) ? "var(--color-primary)" : "var(--color-border)",
                                    }}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mood */}
                    <div>
                        <label className="block font-medium mb-3" style={{ color: "var(--color-text-primary)" }}>
                            What&apos;s your current mood?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {MOODS.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMood(m)}
                                    className="px-4 py-2 rounded-full text-sm border transition-colors"
                                    style={{
                                        backgroundColor: mood === m ? "var(--color-primary)" : "var(--color-card)",
                                        color: mood === m ? "#FFFFFF" : "var(--color-text-primary)",
                                        borderColor: mood === m ? "var(--color-primary)" : "var(--color-border)",
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loved Books */}
                    <div>
                        <label className="block font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
                            Books you&apos;ve loved
                        </label>
                        <textarea
                            value={lovedBooks}
                            onChange={(e) => setLovedBooks(e.target.value)}
                            placeholder="e.g. The Alchemist, Atomic Habits, Gone Girl..."
                            rows={3}
                            className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                            style={{
                                borderColor: "var(--color-border)", backgroundColor: "var(--color-card)", color:
                                    "var(--color-text-primary)"
                            }}
                        />
                    </div>

                    {/* Avoid */}
                    <div>
                        <label className="block font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
                            Anything to avoid? <span style={{
                                color: "var(--color-text-secondary)", fontWeight: 400
                            }}>(optional)</span>
                        </label>
                        <textarea
                            value={avoid}
                            onChange={(e) => setAvoid(e.target.value)}
                            placeholder="e.g. No horror, no slow burns..."
                            rows={2}
                            className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                            style={{
                                borderColor: "var(--color-border)", backgroundColor: "var(--color-card)", color:
                                    "var(--color-text-primary)"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-medium text-white
  transition-colors hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        <Sparkles size={16} />
                        {loading ? "Finding your books..." : "Get Recommendations"}
                    </button>
                </form>

                {/* Results */}
                {recommendations.length > 0 && (
                    <div ref={resultsRef} className="mt-12 flex flex-col gap-4">
                        <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                            Your recommendations
                        </h2>
                        {paginatedBooks.map((book) => (
                            <div
                                key={book.title}
                                className="rounded-2xl p-6 border flex flex-col gap-3"
                                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
                            >
                                <div>
                                    <h3 className="font-semibold" style={{
                                        color: "var(--color-text-primary)"
                                    }}>{book.title}</h3>
                                    <p className="text-sm" style={{ color: "var(--color-primary)" }}>{book.author}</p>
                                    <p className="text-sm mt-1" style={{
                                        color: "var(--color-text-secondary)"
                                    }}>{book.description}</p>
                                </div>

                                {saving[book.title] ? (
                                    <div className="flex flex-col gap-2">
                                        <select
                                            value={saving[book.title]!.status}
                                            onChange={(e) =>
                                                setSaving((prev) => ({
                                                    ...prev,
                                                    [book.title]: { ...prev[book.title]!, status: e.target.value },
                                                }))
                                            }
                                            className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                                            style={{
                                                borderColor: "var(--color-border)", color:
                                                    "var(--color-text-primary)", backgroundColor: "var(--color-card)"
                                            }}
                                        >
                                            <option value="want_to_read">Want to Read</option>
                                            <option value="reading">Reading</option>
                                            <option value="finished">Finished</option>
                                        </select>
                                        {saving[book.title]!.status === "reading" && (
                                            <input
                                                type="number"
                                                placeholder="Total pages (optional)"
                                                value={saving[book.title]!.total_pages || ""}
                                                onChange={(e) =>
                                                    setSaving((prev) => ({
                                                        ...prev,
                                                        [book.title]: {
                                                            ...prev[book.title]!, total_pages:
                                                                Number(e.target.value)
                                                        },
                                                    }))
                                                }
                                                className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                                                style={{
                                                    borderColor: "var(--color-border)", color:
                                                        "var(--color-text-primary)", backgroundColor: "var(--color-card)"
                                                }}
                                            />
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={async () => {
                                                    await fetch("/api/books/save", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            ...book,
                                                            status: saving[book.title]!.status,
                                                            total_pages: saving[book.title]!.total_pages,
                                                        }),
                                                    });
                                                    setSaving((prev) => ({ ...prev, [book.title]: null }));
                                                    alert(`"${book.title}" saved to your dashboard!`);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full
  text-sm font-medium text-white"
                                                style={{ backgroundColor: "var(--color-primary)" }}
                                            >
                                                <Check size={14} />
                                                Confirm Save
                                            </button>
                                            <button
                                                onClick={() => setSaving((prev) => ({ ...prev, [book.title]: null }))}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full
  text-sm font-medium border"
                                                style={{
                                                    borderColor: "var(--color-border)", color:
                                                        "var(--color-text-secondary)"
                                                }}
                                            >
                                                <X size={14} />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setSaving((prev) => ({
                                                ...prev,
                                                [book.title]: { status: "want_to_read", total_pages: 0 },
                                            }))
                                        }
                                        className="self-start flex items-center gap-2 px-4 py-2 rounded-full text-sm
  font-medium border transition-colors hover:opacity-90"
                                        style={{ borderColor: "var(--color-primary)", color: "var(--color-primary-dark)" }}
                                    >
                                        <BookmarkPlus size={15} />
                                        Save to Dashboard
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={() => {
                                        setCurrentPage((p) => p - 1);
                                        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                    disabled={currentPage === 0}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border
  transition-colors disabled:opacity-40"
                                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                                >
                                    <ChevronLeft size={15} />
                                    Previous
                                </button>
                                <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => {
                                        setCurrentPage((p) => p + 1);
                                        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                    disabled={currentPage === totalPages - 1}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border
  transition-colors disabled:opacity-40"
                                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                                >
                                    Next
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}