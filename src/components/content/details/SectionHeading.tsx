interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`container-custom ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="text-primary mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-foreground text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
