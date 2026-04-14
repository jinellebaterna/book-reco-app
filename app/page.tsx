"use client";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

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
          onClick={() => openSignIn({ forceRedirectUrl: "/dashboard" })}
          className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:opacity-90"
          style={{ borderColor: "#7C9A7E", color: "#4A7C59" }}
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center text-center px-6 py-24 max-w-3xl mx-auto">
        <h1
          className="text-5xl font-bold leading-tight mb-6"
          style={{ color: "#1C1C1C" }}
        >
          Your next great read,{" "}
          <span style={{ color: "#7C9A7E" }}>recommended by AI</span>
        </h1>
        <p className="text-lg mb-10 max-w-xl" style={{ color: "#6B7280" }}>
          Tell us what you love. Paige uses Gemini AI to match you with
          books you&apos;ll actually want to read.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => openSignUp({ forceRedirectUrl: "/dashboard" })}
            className="px-6 py-3 rounded-full text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: "#7C9A7E" }}
          >
            Get Started — it&apos;s free
          </button>
          <button
            onClick={() => openSignIn({ forceRedirectUrl: "/dashboard" })}
            className="px-6 py-3 rounded-full font-medium border transition-colors hover:opacity-90"
            style={{ borderColor: "#E5E7EB", color: "#1C1C1C" }}
          >
            Sign In
          </button>
        </div>
      </main>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 pb-24 max-w-4xl mx-auto">
        {[
          {
            title: "Tell us your taste",
            desc: "Share your favorite genres, moods, and books you've loved.",
          },
          {
            title: "AI finds the match",
            desc: "Gemini analyzes your preferences and surfaces the best picks.",
          },
          {
            title: "Save & revisit",
            desc: "Build your personal reading list and come back anytime.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "#1C1C1C" }}>
              {f.title}
            </h3>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
