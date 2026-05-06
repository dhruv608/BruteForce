"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import Logo from '@/components/Logo';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link
          href="/"
          aria-label="BruteForce home"
          className="inline-flex items-center transition-opacity hover:opacity-80 [&_svg]:!w-[100px] [&_svg]:!h-[39px] [&_svg]:-translate-y-[7px]"
        >
          <Logo />
        </Link>

        <p className="text-sm text-muted-foreground">
          Made By
          <a
            href="https://www.linkedin.com/in/dhruvnarang608"
            target="_blank"
            rel="noopener noreferrer"
            title="Dhruv Narang's LinkedIn"
            className="text-primary p-1 hover:underline underline-offset-4 transition-colors"
          >
            Dhruv Narang
          </a>
          and
          <a
            href="https://www.linkedin.com/in/ayush2006"
            target="_blank"
            rel="noopener noreferrer"
            title="Ayush Chaurasiya's LinkedIn"
            className="text-primary p-1 hover:underline underline-offset-4 transition-colors"
          >
            Ayush Chaurasiya
          </a>
        </p>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          Built with <Heart className="w-4 h-4 text-primary fill-primary" /> at
          <a
            href="https://www.pwioi.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit PW Institute of Innovation"
            className="text-primary p-1 hover:underline underline-offset-4 transition-colors"
          >
            PW Institute of Innovation
          </a>
        </p>
      </div>
    </footer>
  );
}
