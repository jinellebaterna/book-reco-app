"use client";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogIn, Sparkles } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";

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
            onClick={() => openSignIn({ forceRedirectUrl: "/dashboard" })}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors
  hover:opacity-90"
            style={{ borderColor: "var(--color-primary)", color: "var(--color-primary-dark)" }}
          >
            <LogIn size={15} />
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center text-center px-6 py-24 max-w-3xl mx-auto">
        <h1
          className="text-5xl font-bold leading-tight mb-6"
          style={{ color: "var(--color-text-primary)" }}
        >
          Your next great read,{" "}
          <span style={{ color: "var(--color-primary)" }}>recommended by AI</span>
        </h1>
        <p className="text-lg mb-10 max-w-xl" style={{ color: "var(--color-text-secondary)" }}>
          Tell us what you love. Paige uses Gemini AI to match you with
          books you&apos;ll actually want to read.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => openSignUp({ forceRedirectUrl: "/dashboard" })}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-colors
  hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Sparkles size={16} />
            Get Started — it&apos;s free
          </button>
          <button
            onClick={() => openSignIn({ forceRedirectUrl: "/dashboard" })}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium border transition-colors
  hover:opacity-90"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
          >
            <LogIn size={16} />
            Sign In
          </button>
        </div>
      </main>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 pb-24 max-w-4xl mx-auto">
        {[
          { title: "Tell us your taste", desc: "Share your favorite genres, moods, and books you've loved." },
          { title: "AI finds the match", desc: "Gemini analyzes your preferences and surfaces the best picks." },
          { title: "Save & revisit", desc: "Build your personal reading list and come back anytime." },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6 border"
            style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
              {f.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}