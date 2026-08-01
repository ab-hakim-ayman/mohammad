"use client";

import Image from "next/image";
import { Link } from "@/shared/i18n";
import { FaLinkedin, FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";
import { MapPin, Globe, Cookie } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import type { SiteInfoRecord } from "@/features/site-info";
import { usePublicSiteInfo } from "@/features/site-info";
import I18n from "@/shared/components/I18n";

const footerVariants = cva(
  "relative w-full overflow-hidden transition-colors duration-300 text-foreground bg-background border-t border-border/60",
  {
    variants: {
      variant: {
        classic: "bg-background border-t border-border/60",
        glassmorphic: "bg-background/60 backdrop-blur-xl border-t border-border/50",
        brutalist: "bg-card border-t-4 border-border-strong shadow-md font-mono",
        "gradient-glow":
          "bg-background border-t border-border/60 relative after:absolute after:top-0 after:left-1/3 after:w-1/3 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-primary/40 after:to-transparent",
        minimal: "bg-background border-t border-border/40 py-6",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

type FooterLink =
  | { name: string; label: string; href: string; external?: false }
  | { name: string; label: string; href: string; external: true };

const footerGroups: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Company",
    links: [
      { name: "about", label: "About Us", href: "/about" },
      { name: "contact", label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "services", label: "Services", href: "/services" },
      { name: "specializations", label: "Specializations", href: "/specializations" },
      { name: "caseStudies", label: "Case Studies", href: "/case-studies" },
      { name: "technologies", label: "Technologies", href: "/technologies" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "blog", label: "Blog", href: "/blogs" },
      { name: "events", label: "Events", href: "/events" },
      { name: "galleries", label: "Galleries", href: "/galleries" },
      { name: "faqs", label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "clients", label: "Our Clients", href: "/clients" },
      { name: "testimonials", label: "Testimonials", href: "/testimonials" },
      { name: "projects", label: "Projects", href: "/projects" },
    ],
  },
];

const socialIconMap: Record<string, React.ElementType> = {
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
  youtube: FaYoutube,
};

function isExternalLink(link: FooterLink): link is FooterLink & { external: true } {
  return link.external === true;
}

function isAbsoluteUrl(value: string | undefined | null) {
  if (!value) return false;
  return /^https?:\/\//i.test(value);
}

export interface FooterProps extends VariantProps<typeof footerVariants> {
  siteInfo?: SiteInfoRecord | null;
}

export function Footer({ siteInfo, variant = "classic" }: FooterProps) {
  const { data: siteInfoResponse } = usePublicSiteInfo();
  const activeSiteInfo = siteInfo || siteInfoResponse?.data;

  const brandTitle = activeSiteInfo?.siteTitle || activeSiteInfo?.companyTitle || "A2ICoders";
  const brandKicker = activeSiteInfo?.businessType || "Software";
  const footerDescription = activeSiteInfo?.shortDesc || activeSiteInfo?.tagline;
  const footerCopyright = activeSiteInfo?.copyrightText || `© ${new Date().getFullYear()} ${brandTitle}. All rights reserved.`;
  const footerPrivacyUrl = activeSiteInfo?.privacyPolicyUrl || "/privacy";
  const footerTermsUrl = activeSiteInfo?.termsUrl || "/terms";

  const contactCards = [
    activeSiteInfo?.address
      ? { key: "address", value: activeSiteInfo.address, icon: MapPin }
      : null,
  ].filter(Boolean) as Array<{ key: string; value: string; icon: any }>;

  const socialLinks = [
    ["linkedin", activeSiteInfo?.linkedin],
    ["github", activeSiteInfo?.github],
  ]
    .filter(([, href]) => Boolean(href))
    .map(([name, href]) => ({ name: String(name), href: href as string }));

  const isMinimal = variant === "minimal";

  const handleOpenCookieConsent = () => {
    window.dispatchEvent(new Event("open-cookie-settings"));
  };

  return (
    <footer className={cn(footerVariants({ variant }))}>
      <div className="container-custom mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {!isMinimal && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_2fr] border-b border-border/60 pb-12 w-full">
            {/* BRAND SYNOPSIS PANEL */}
            <div className="flex flex-col items-start space-y-4 max-w-sm">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-muted/30 group-hover:border-primary/40 text-primary transition-all shadow-2xs">
                  {activeSiteInfo?.logo || activeSiteInfo?.darkLogo ? (
                    <Image
                      src={activeSiteInfo?.logo || activeSiteInfo?.darkLogo || ""}
                      alt={brandTitle || "Logo"}
                      fill
                      sizes="32px"
                      unoptimized
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className="text-[10px] font-black">A2I</span>
                  )}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-[10px] leading-none font-bold tracking-widest uppercase text-primary">
                    {brandKicker}
                  </span>
                  <span className="group-hover:text-primary text-foreground mt-0.5 truncate text-sm leading-none font-bold tracking-tight transition-colors">
                    {brandTitle}
                  </span>
                </div>
              </Link>

              {footerDescription && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {footerDescription}
                </p>
              )}

              {contactCards.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {contactCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Icon className="text-primary/80 mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="leading-tight">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Social Icons - Clean Vercel Style Buttons */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {socialLinks.map((link) => {
                    const Icon = socialIconMap[link.name] ?? Globe;
                    return (
                      <button
                        key={link.name}
                        type="button"
                        onClick={() => window.open(link.href, "_blank", "noopener,noreferrer")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer shadow-2xs"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LINK NAVIGATION GRID */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 w-full">
              {footerGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase select-none">
                    <I18n>{group.title}</I18n>
                  </h3>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        {isExternalLink(link) ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                          >
                            <I18n>{link.label}</I18n>
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                          >
                            <I18n>{link.label}</I18n>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM LEGAL & COOKIE SECTION */}
        <div
          className={cn(
            "flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row w-full",
            isMinimal ? "pt-0" : "pt-8"
          )}
        >
          <p className="text-center font-normal sm:text-left">{footerCopyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
            {footerPrivacyUrl &&
              (isAbsoluteUrl(footerPrivacyUrl) ? (
                <a
                  href={footerPrivacyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  <I18n>Privacy Policy</I18n>
                </a>
              ) : (
                <Link href={footerPrivacyUrl} className="hover:text-foreground transition-colors">
                  <I18n>Privacy Policy</I18n>
                </Link>
              ))}

            {footerTermsUrl &&
              (isAbsoluteUrl(footerTermsUrl) ? (
                <a
                  href={footerTermsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  <I18n>Terms of Service</I18n>
                </a>
              ) : (
                <Link href={footerTermsUrl} className="hover:text-foreground transition-colors">
                  <I18n>Terms of Service</I18n>
                </Link>
              ))}

            {/* Cookie Preferences Trigger */}
            <button
              type="button"
              onClick={handleOpenCookieConsent}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-medium"
            >
              <Cookie className="h-3.5 w-3.5 text-primary/80" />
              <I18n>Cookie Settings</I18n>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}