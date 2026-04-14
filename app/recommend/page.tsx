"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GENRES = ["Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Fantasy", "Romance", "Thriller", "Biography", "Self-Help", "History"];

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
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm"
                    style={{ color: "#6B7280" }}
                >
                    Back to Dashboard
                </button>
            </nav>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-2" style={{ color: "#1C1C1C" }}>
                    Find your next book
                </h1>
                <p className="mb-8" style={{ color: "#6B7280" }}>
                    Tell us what you&apos;re in the mood for.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Genres */}
                    <div>
                        <label className="block font-medium mb-3" style={{ color: "#1C1C1C" }}>
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
                                        backgroundColor: genres.includes(g) ? "#7C9A7E" : "#FFFFFF",
                                        color: genres.includes(g) ? "#FFFFFF" : "#1C1C1C",
                                        borderColor: genres.includes(g) ? "#7C9A7E" : "#E5E7EB",
                                    }}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mood */}
                    <div>
                        <label className="block font-medium mb-3" style={{ color: "#1C1C1C" }}>
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
                                        backgroundColor: mood === m ? "#7C9A7E" : "#FFFFFF",
                                        color: mood === m ? "#FFFFFF" : "#1C1C1C",
                                        borderColor: mood === m ? "#7C9A7E" : "#E5E7EB",
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loved Books */}
                    <div>
                        <label className="block font-medium mb-2" style={{ color: "#1C1C1C" }}>
                            Books you&apos;ve loved
                        </label>
                        <textarea
                            value={lovedBooks}
                            onChange={(e) => setLovedBooks(e.target.value)}
                            placeholder="e.g. The Alchemist, Atomic Habits, Gone Girl..."
                            rows={3}
                            className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                            style={{ borderColor: "#E5E7EB", backgroundColor: "#FFFFFF", color: "#1C1C1C" }}
                        />
                    </div>

                    {/* Avoid */}
                    <div>
                        <label className="block font-medium mb-2" style={{ color: "#1C1C1C" }}>
                            Anything to avoid? <span style={{ color: "#6B7280", fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea
                            value={avoid}
                            onChange={(e) => setAvoid(e.target.value)}
                            placeholder="e.g. No horror, no slow burns..."
                            rows={2}
                            className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                            style={{ borderColor: "#E5E7EB", backgroundColor: "#FFFFFF", color: "#1C1C1C" }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: "#7C9A7E" }}
                    >
                        {loading ? "Finding your books..." : "Get Recommendations"}
                    </button>
                </form>

                {/* Results */}
                {recommendations.length > 0 && (
                    <div className="mt-12 flex flex-col gap-4">
                        <h2 className="text-xl font-bold" style={{ color: "#1C1C1C" }}>
                            Your recommendations
                        </h2>
                        {recommendations.map((book) => (
                            <div
                                key={book.title}
                                className="rounded-2xl p-6 border flex flex-col gap-3"
                                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                            >
                                <div>
                                    <h3 className="font-semibold" style={{ color: "#1C1C1C" }}>{book.title}</h3>
                                    <p className="text-sm" style={{ color: "#7C9A7E" }}>{book.author}</p>
                                    <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{book.description}</p>
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
                                            style={{ borderColor: "#E5E7EB", color: "#1C1C1C" }}
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
                                                        [book.title]: { ...prev[book.title]!, total_pages: Number(e.target.value) },
                                                    }))
                                                }
                                                className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                                                style={{ borderColor: "#E5E7EB", color: "#1C1C1C" }}
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
                                                className="flex-1 py-2 rounded-full text-sm font-medium text-white"
                                                style={{ backgroundColor: "#7C9A7E" }}
                                            >
                                                Confirm Save
                                            </button>
                                            <button
                                                onClick={() => setSaving((prev) => ({ ...prev, [book.title]: null }))}
                                                className="flex-1 py-2 rounded-full text-sm font-medium border"
                                                style={{ borderColor: "#E5E7EB", color: "#6B7280" }}
                                            >
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
                                        className="self-start px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:opacity-90"
                                        style={{ borderColor: "#7C9A7E", color: "#4A7C59" }}
                                    >
                                        Save to Dashboard
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
