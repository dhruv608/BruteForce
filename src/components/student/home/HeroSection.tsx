"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, PenTool, Zap } from "lucide-react";
import GraphBackground from "./GraphBackground";
import BruteForceTree from "./GraphBackground";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-start justify-center overflow-hidden hero-gradient pt-20 lg:pt-32">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[20%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-[var(--accent-primary)]/10 blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[140px] rounded-full" />
        <div className="absolute right-[10%] bottom-[10%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-[var(--accent-primary)]/10 blur-[70px] sm:blur-[90px] md:blur-[100px] lg:blur-[120px] rounded-full" />
      </div>

      {/* 🧠 CONTENT WRAPPER */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* 📝 LEFT SIDE (TEXT) */}
        <div className="flex flex-col justify-center items-start text-left gap-3 max-w-2xl">

          {/* TAG */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--logo)]/10 border border-[var(--logo)]/20 text-xs font-semibold text-[var(--logo)] uppercase tracking-wider backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <p>Your DSA Portal</p>
          </div>

          {/* BRAND */}
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="text-foreground">Brute</span>
            <span className="text-[var(--accent-primary)] ">Force</span>
          </h1>

          {/* 🔥 BIG TAGLINE (FIXED WRAPPING + SPACING) */}
          <h2 className="text-4xl md:text-6xl font-semibold leading-[1.15] tracking-tight">
            Solve Faster.<br />
            Rank Higher.<br />
            Stay Ahead.
          </h2>

          {/* SUBTEXT */}
          <p className="text-muted-foreground text-lg leading-relaxed">
            Master data structures, track your progress, and climb the leaderboard with precision.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-row gap-4 mt-3">

            <Button
              asChild
              size="lg"
              className="h-12 px-8 rounded-2xl font-semibold bg-[var(--accent-primary)] text-black hover:brightness-110 transition-all"
            >
              <Link href="/topics">
                <Compass className="w-5 h-5 mr-2" />
                Explore Topics
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="h-12 px-8 font-semibold rounded-2xl border border-foreground/10 bg-logo/10! text-logo!  hover:bg-white/10 transition-all"
            >
              <Link href="/practice">
                <PenTool className="w-5 h-5 mr-2" />
                Practice Now
              </Link>
            </Button>

          </div>
        </div>

        {/* 🎯 RIGHT SIDE */}
        <div className="hidden lg:flex items-center justify-center relative w-full h-full">
          <BruteForceTree />
        </div>

      </div>
    </section>
  );
}
