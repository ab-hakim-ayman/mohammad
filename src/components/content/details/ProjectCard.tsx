import { Link } from "@/shared/i18n";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import I18n from "@/shared/components/I18n";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    heroImage?: string | null;
    cardImage?: string | null;
    caseStudy?: {
      slug: string;
    } | null;
    client?: {
      title: string;
    } | null;
    technologies?: {
      title: string;
    }[];
    isFeatured?: boolean;
  };
  showImage?: boolean;
}

export function ProjectCard({ project, showImage = false }: ProjectCardProps) {
  const projectImage = project.heroImage || project.cardImage;
  return (
    <div className="group border-border bg-card shadow-soft hover:border-primary/20 hover:shadow-soft-hover flex h-full flex-col overflow-hidden rounded-none sm:rounded-lg border transition-all hover:-translate-y-1">
      {showImage && projectImage && (
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          <Image
            src={projectImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {project.isFeatured && (
          <span className="bg-primary/10 text-primary mb-4 inline-block self-start rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase">
            <I18n>Featured</I18n>
          </span>
        )}
        {project.client && (
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            {project.client.title}
          </p>
        )}
        <h3 className="text-foreground text-xl font-semibold">{project.title}</h3>
        {project.shortDesc && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{project.shortDesc}</p>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech.title}
                className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium"
              >
                {tech.title}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-6">
          <Link
            href={`/projects/${project.slug}`}
            className="text-primary inline-flex items-center text-sm font-semibold hover:underline"
          >
            <I18n>View Project</I18n> <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
          {project.caseStudy && (
            <Link
              href={`/case-studies/${project.caseStudy.slug}`}
              className="text-muted-foreground hover:text-primary inline-flex items-center text-sm font-semibold hover:underline"
            >
              <I18n>Read Case Study</I18n> <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
