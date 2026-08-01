"use client";

import Image from "next/image";
import { BriefcaseBusiness, Globe, Mail, UserRound } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
import type { AdminProfileRecord } from "../types/profile.types";
import I18n from "@/shared/components/I18n";

interface ProfileDetailProps {
  profile: AdminProfileRecord;
}

function detailValue(value?: string | number | null, fallback = "N/A") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function ProfileDetail({ profile }: ProfileDetailProps) {
  // ১. প্রত্যেকটির জন্য আলাদা এবং সঠিক আইকন অ্যাসাইন করা হলো
  const links = [
    profile.portfolioUrl
      ? { key: "portfolio", label: "Portfolio", href: profile.portfolioUrl, icon: Globe }
      : null,
    profile.linkedinUrl
      ? { key: "linkedin", label: "LinkedIn", href: profile.linkedinUrl, icon: FaLinkedin }
      : null,
    profile.githubUrl
      ? { key: "github", label: "GitHub", href: profile.githubUrl, icon: FaGithub }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    href: string;
    icon: any;
  }>;

  const profileFacts = [
    ["Full name", detailValue(profile.fullName)],
    ["Headline", detailValue(profile.headline)],
    ["Designation", detailValue(profile.designation)],
    ["Experience", profile.experienceYears != null ? `${profile.experienceYears} years` : "N/A"],
    ["Public profile", profile.isPublic ? "Enabled" : "Hidden"],
  ];

  return (
    <div className="w-full space-y-6">
      {/* ব্যানার এবং প্রোফাইল কার্ড */}
      <div className="border-border bg-card/60 overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-muted/50 relative h-36 w-full sm:h-44">
          {profile.coverImage ? (
            <Image
              src={profile.coverImage}
              alt={profile.fullName || "Profile cover"}
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="bg-muted absolute inset-0" />
          )}
        </div>
        <div className="p-6 sm:p-6">
          <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="border-background bg-muted relative z-10 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow-md sm:h-24 sm:w-24">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.fullName || "Profile avatar"}
                    fill
                    sizes="96px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <UserRound className="text-muted-foreground h-8 w-8 sm:h-10 sm:w-10" />
                )}
              </div>
              <div className="pb-1">
                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  {profile.fullName || "Untitled Profile"}
                </h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {profile.designation || profile.headline || "No designation added yet."}
                </p>
              </div>
            </div>
            <div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold",
                  profile.isPublic
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-warning/10 text-warning border-warning/20"
                )}
              >
                {profile.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>

          {profile.bio && (
            <div className="border-border bg-muted/20 mt-6 rounded-lg border p-4">
              <h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                <I18n>Biography</I18n>
              </h3>
              <p className="text-foreground mt-2 text-sm leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* প্রোফাইল ফ্যাক্টস গ্রিড */}
      <div className="border-border bg-card/60 rounded-xl border p-6 shadow-sm">
        <h3 className="text-foreground mb-4 text-base font-bold">
          <I18n>Profile details</I18n>
        </h3>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profileFacts.map(([label, value]) => (
            <div key={label} className="border-border bg-muted/30 rounded-lg border p-4.5">
              <span className="text-muted-foreground block text-xs font-bold tracking-wider uppercase">
                {label}
              </span>
              <span
                className="text-foreground mt-1 block truncate text-sm font-semibold"
                title={value}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* স্কিল এবং লিংক সেকশন */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {/* স্কিল বক্স */}
        <div className="border-border bg-card/60 rounded-xl border p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="bg-primary/10 text-primary border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-foreground text-base font-bold">
                <I18n>Skills and expertise</I18n>
              </h3>
            </div>
          </div>
          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-muted text-foreground border-border rounded-full border px-3 py-1 text-xs font-medium"
                >
                  {skill.title}
                </span>
              ))}
            </div>
          ) : (
            <div className="border-border text-muted-foreground rounded-xl border border-dashed p-4 text-center text-xs">
              <I18n>No skills added yet.</I18n>
            </div>
          )}
        </div>

        {/* সোশ্যাল লিঙ্ক বক্স */}
        <div className="border-border bg-card/60 rounded-xl border p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="bg-primary/10 text-primary border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-foreground text-base font-bold">
                <I18n>Profile links</I18n>
              </h3>
            </div>
          </div>
          {links.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {links.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-border bg-muted/30 hover:bg-muted/60 group flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 transition-colors"
                  >
                    <IconComponent className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-foreground block text-xs font-bold">{link.label}</span>
                      <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                        {link.href}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="border-border text-muted-foreground rounded-xl border border-dashed p-4 text-center text-xs">
              <I18n>No profile links added yet.</I18n>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
