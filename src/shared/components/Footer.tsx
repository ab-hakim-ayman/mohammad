"use client";

import { Link } from "@/shared/i18n";
import { FaLinkedin, FaGithub, FaBook, FaPencilAlt } from "react-icons/fa";
import { Coffee, Heart } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import type { SiteInfoRecord } from "@/features/site-info";
import { usePublicSiteInfo } from "@/features/site-info";
import I18n from "@/shared/components/I18n";

const footerVariants = cva(
  "relative w-full overflow-hidden transition-colors duration-300 text-muted-foreground bg-background border-t border-border/60",
  {
    variants: {
      variant: {
        classic: "bg-background border-t border-border/60",
        glassmorphic: "bg-background/60 backdrop-blur-xl border-t border-border/50",
        brutalist: "bg-card border-t-4 border-border-strong shadow-md font-mono",
        gradientGlow:
          "bg-background border-t border-border/60 relative after:absolute after:top-0 after:left-1/3 after:w-1/3 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-primary/40 after:to-transparent",
        minimal: "bg-background border-t border-border/40 py-6",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

// Navigation links
const footerNavLinks = [
  { name: "work", label: "Work", href: "/projects" },
  { name: "tools", label: "Tools", href: "/technologies" },
  { name: "games", label: "Games", href: "/games" },
];

export interface FooterProps extends VariantProps<typeof footerVariants> {
  siteInfo?: SiteInfoRecord | null;
  version?: string;
  buildDate?: string;
}

export function Footer({
  siteInfo,
  variant = "classic",
  version = "v0.1.38",
  buildDate = "2026-07-21T03:36:26.566Z",
}: FooterProps) {
  const { data: siteInfoResponse } = usePublicSiteInfo();
  const activeSiteInfo = siteInfo || siteInfoResponse?.data;

  const brandTitle = activeSiteInfo?.title || activeSiteInfo?.fullName || "Hafiq Iqbal";
  const footerCopyright = activeSiteInfo?.copyrightText || `© ${new Date().getFullYear()} ${brandTitle}`;

  const linkedinUrl = activeSiteInfo?.linkedin || "https://linkedin.com";
  const githubUrl = activeSiteInfo?.github || "https://github.com";
  const coffeeUrl = "https://buymeacoffee.com";
  const paypalUrl = "https://paypal.com";

  return (
    <footer className={cn(footerVariants({ variant }))}>
      <div className="container-custom mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top Navigation Links (Work, Tools, Games) */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
          {footerNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <I18n>{link.label}</I18n>
            </Link>
          ))}
        </div>

        {/* Bottom Bar: Social Icons, Support Icons & Copyright/Version */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-6 border-t border-border/60">
          {/* Left Side: Social & Support Icons */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {/* Socials */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a href="/blogs" className="hover:text-foreground transition-colors">
              <FaBook className="h-4 w-4" />
            </a>
            <a href="/notes" className="hover:text-foreground transition-colors">
              <FaPencilAlt className="h-4 w-4" />
            </a>

            {/* Vertical Divider */}
            <span className="text-border select-none">|</span>

            {/* Support Work Icons */}
            <a
              href={coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffdd00] hover:opacity-80 transition-opacity"
              title="Buy Me a Coffee"
            >
              <Coffee className="h-4 w-4" />
            </a>
            <a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0070ba] hover:opacity-80 transition-opacity"
              title="PayPal"
            >
              <Heart className="h-4 w-4 fill-current" />
            </a>
          </div>

          {/* Right Side: Copyright & Version Details */}
          <div className="text-right space-y-1 text-xs text-muted-foreground font-mono">
            <p>{footerCopyright}</p>
            <p className="text-[11px] text-muted-foreground/60">
              {version} · {buildDate}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}