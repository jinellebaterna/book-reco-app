"use client";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

export default function Dashboard() {
    const { signOut } = useClerk();

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8F9F5" }}>
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
            <main className="max-w-3xl mx-auto px-6 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4" style={{ color: "#1C1C1C" }}>
                    Your Dashboard
                </h1>
                <p style={{ color: "#6B7280" }}>Your saved books will appear here.</p>
            </main>
        </div>
    );
}       