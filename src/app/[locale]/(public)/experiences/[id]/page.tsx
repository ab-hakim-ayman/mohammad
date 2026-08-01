import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experienceService } from "@/features/experience/server";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { ContentRenderer } from "@/components/content";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { Calendar, Clock, Layers, User, Briefcase, MapPin, Globe } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { BadgeList } from "@/components/content/details";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const experience = await experienceService.getPublicById(id);
    const description = experience.shortDesc || `${experience.position} at ${experience.companyName}`;
    return {
      title: `${experience.position} at ${experience.companyName} | Experience`,
      description,
      openGraph: {
        title: `${experience.position} at ${experience.companyName}`,
        description,
        images: experience.cardImage || experience.logo || experience.ogImage ? [experience.cardImage || experience.logo || experience.ogImage || ""] : [],
      },
    };
  } catch {
    return { title: "Experience Not Found" };
  }
}

export default async function PublicExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;

  let experience;
  try {
    experience = await experienceService.getPublicById(id);
  } catch {
    notFound();
  }

  const json = experience.contentJson || {};
  const start = new Date(experience.startDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const end = experience.isCurrent
    ? "Present"
    : experience.endDate
    ? new Date(experience.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/experiences"
        backLabel="Experiences"
        eyebrow="Professional Experience"
        title={`${experience.position} at ${experience.companyName}`}
        description={experience.shortDesc || `Detailed technical review of position and accomplishments.`}
        badges={[
          experience.employmentType.replace("_", " "),
          ...(experience.location ? [experience.location] : []),
        ]}
        imageSrc={experience.cardImage || experience.logo || undefined}
        imageAlt={`${experience.companyName} logo`}
        imagePosition="center"
        stats={[
          {
            label: "Timeline",
            value: `${start} - ${end}`,
          },
          {
            label: "Location Type",
            value: experience.locationType || "Onsite",
          },
        ]}
      />

      <section className="container-custom mx-auto mb-16 mt-8 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card/60 border border-border backdrop-blur-md rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Employment Type</I18n></p>
                <p className="text-foreground text-xs font-bold truncate">{experience.employmentType.replace("_", " ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Location</I18n></p>
                <p className="text-foreground text-xs font-bold truncate">{experience.location || "—"} ({experience.locationType || "Onsite"})</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Company Site</I18n></p>
                {experience.companyUrl ? (
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-bold truncate hover:underline"
                  >
                    {experience.companyUrl}
                  </a>
                ) : (
                  <p className="text-foreground text-xs font-bold truncate">—</p>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="container-custom px-4 sm:px-6 mb-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_280px] xl:gap-16">
          <div className="w-full min-w-0">
            <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none font-medium prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl">
              {json && Object.keys(json).length > 0 ? (
                <ContentRenderer variant="blog" content={json} />
              ) : (
                <p className="text-muted-foreground italic"><I18n>No detailed accomplishments provided for this role.</I18n></p>
              )}
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28">
            {experience.technologies && experience.technologies.length > 0 && (
              <div className="border border-border/80 rounded-xl p-5 bg-card/40 backdrop-blur-xs">
                <h4 className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">
                  <I18n>Technologies Used</I18n>
                </h4>
                <div className="flex flex-wrap gap-2">
                  <BadgeList items={experience.technologies} hrefPrefix="/technologies/" />
                </div>
              </div>
            )}

            {experience.projects && experience.projects.length > 0 && (
              <div className="border border-border/80 rounded-xl p-5 bg-card/40 backdrop-blur-xs">
                <h4 className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">
                  <I18n>Associated Projects</I18n>
                </h4>
                <div className="flex flex-wrap gap-2">
                  <BadgeList items={experience.projects} hrefPrefix="/projects/" />
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </article>
  );
}
