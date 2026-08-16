import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { educationService } from "@/features/education/server";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { ContentRenderer } from "@/components/content";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { GraduationCap, MapPin, Globe, Award, Calendar } from "lucide-react";
import I18n from "@/shared/components/I18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const education = await educationService.getPublicById(slug);
    const description = education.shortDesc || `${education.degree} at ${education.institution}`;
    return {
      title: `${education.degree} | ${education.institution}`,
      description,
      openGraph: {
        title: `${education.degree} | ${education.institution}`,
        description,
        images: education.logo ? [education.logo] : [],
      },
    };
  } catch {
    return { title: "Education Not Found" };
  }
}

export default async function PublicEducationDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let education;
  try {
    education = await educationService.getPublicById(slug);
  } catch {
    notFound();
  }

  const json = education.contentJson || {};
  const start = new Date(education.startDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const end = education.isCurrent
    ? "Present"
    : education.endDate
    ? new Date(education.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <FeatureDetailsBanner
        variant="split"
        backHref="/educations"
        backLabel="Education"
        eyebrow="Academic History"
        title={education.degree}
        description={education.shortDesc || `Academic program review and accomplishments.`}
        badges={[
          education.institution,
          ...(education.grade ? [`Grade: ${education.grade}`] : []),
        ]}
        imageSrc={education.logo || undefined}
        imageAlt={`${education.institution} logo`}
        imagePosition="center"
        stats={[
          {
            label: "Timeline",
            value: `${start} - ${end}`,
          },
          {
            label: "Degree",
            value: education.fieldOfStudy ? `${education.degree} in ${education.fieldOfStudy}` : education.degree,
          },
        ]}
      />

      <section className="container-custom mx-auto mb-16 mt-8 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card/60 border border-border backdrop-blur-md rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Institution</I18n></p>
                <p className="text-foreground text-xs font-bold truncate">{education.institution}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Institution Website</I18n></p>
                {education.institutionUrl ? (
                  <a
                    href={education.institutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-bold truncate hover:underline"
                  >
                    {education.institutionUrl}
                  </a>
                ) : (
                  <p className="text-foreground text-xs font-bold truncate">—</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Award className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Credentials</I18n></p>
                {education.certificateUrl ? (
                  <a
                    href={education.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-bold truncate hover:underline"
                  >
                    <I18n>View Certificate</I18n>
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
        <div className="max-w-4xl mx-auto min-w-0">
          <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none font-medium prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl">
            {json && Object.keys(json).length > 0 ? (
              <ContentRenderer variant="blog" content={json} />
            ) : (
              <p className="text-muted-foreground italic"><I18n>No detailed accomplishments provided for this program.</I18n></p>
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
