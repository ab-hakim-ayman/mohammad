# UI Theme System Audit Report

## 1. Current Theme Architecture

- **Theme Provider:** Custom implementation located at `src/shared/theme/provider.tsx`. It manages a React state for the active theme (`light` or `dark`), persists it using `localStorage` under `THEME_STORAGE_KEY`, and leverages a DOM mutation (`applyTheme` in `config.ts`) to toggle the `.dark` class on the `<html>` root, as well as updating `data-theme` and `color-scheme` properties.
- **CSS Variables & Theming:** `src/app/globals.css` declares a comprehensive set of Material Design 3 (M3) tonal roles utilizing HSL values inside the `:root` and `.dark` scopes.
- **UI Abstractions:** A rich set of custom `.ui-*` component classes (e.g., `.ui-card`, `.ui-shell`, `.ui-button-primary`, `.ui-input`) handles complex styling like gradients, borders, and shadows that automatically adapt to light/dark themes by relying on underlying semantic aliases (e.g., `--color-surface-muted`, `--color-border-strong`).
- **Tailwind Mapping:** `tailwind.config.ts` extends the default Tailwind palette with semantic names like `background`, `surface`, `primary`, `card`, `popover`, `muted`, etc., mapping them to the `hsl(var(--md-sys-color-*))` CSS variables.

## 2. Tailwind Version and Recommended Implementation Approach

- **Installed Version:** `3.4.19` (detected from `package.json`).
- **Configuration Strategy:** Since Tailwind CSS v3 is utilized, semantic colors map dynamically through the `colors` object within `tailwind.config.ts` referencing CSS variables.
- **Recommended Approach:** For standard Tailwind utilities, replace hardcoded literal color utility classes (e.g., `bg-white`, `text-gray-800`) with semantic M3 equivalents derived from the tailwind config (e.g., `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`). In components needing more complex shadows/borders/states, strictly adopt the pre-built global `.ui-*` classes instead of composing large strings of low-level utilities.

## 3. Files and Components with the Highest-Impact Issues

Based on the code search, the following components exhibit heavy hardcoded colors and inappropriate glassmorphism configurations, severely affecting dark-mode readability:

- **Auth Screens:** `login/page.tsx`, `forgot-password/page.tsx`, `reset-password/page.tsx`, `accept-invite/page.tsx`
- **Feature Sections:** `GallerySection.tsx`, `EventSection.tsx`, `ContactSection.tsx`, `SpecializationSection.tsx`, `TechnologySection.tsx`, `CaseStudySection.tsx`, `AchievementSection.tsx`, `ClientSection.tsx`
- **Cards & UI Elements:** `GalleryCard.tsx`, `EventCard.tsx`, `CaseStudyCard.tsx`, `ProjectCard.tsx`
- **Preview & CTA Components:** `AboutPreviewSection.tsx`, `NewsletterPreviewSection.tsx`, `NewsletterCtaSection.tsx`, `ContactPreviewSection.tsx`, `ContactCtaSection.tsx`, `HeroPreviewSection.tsx`, `CaseStudyPreviewSection.tsx`, `FaqPreviewSection.tsx`
- **Forms & Overlays:** `TestimonialForm.tsx`, `MediaPickerDialog.tsx`, `EventDetail.tsx`, `GalleryDetail.tsx`
- **Shared Globals:** `Header.tsx`, `FloatingScrollButton.tsx`, `AdminSelect.tsx`, `FeaturePageBanner.tsx`, `AppStateScreen.tsx`, `LanguageSwitcher.tsx`

## 4. Repeated Hardcoded Color Patterns

The following direct-color patterns bypass the semantic token system and create visual inconsistencies:

- **Backgrounds:** `bg-white`, `bg-black`, `bg-gray-*`, `bg-slate-*`, `bg-zinc-*`
- **Text:** `text-white`, `text-black`, `text-gray-*`, `text-slate-*`, `text-zinc-*`
- **Borders & Dividers:** `border-gray-*`, `border-white/*`, `border-black/*`
- **Overlays:** `bg-white/*`, `bg-black/*` (These are often improperly used for glass effects instead of using semantic surface containers.)
- **Misused Glassmorphism:** Heavy `backdrop-blur` utilities applied to standard content cards. This washes out contrast in dark mode, making text nearly unreadable against dynamically colored backgrounds.

## 5. Recommended Semantic Token List

To unify the application, rely solely on these M3-aligned semantic tokens:

**Tailwind Utilities (General Structure):**

- **Surfaces:** `bg-background`, `bg-surface`, `bg-card`, `bg-popover`, `bg-muted`
- **Typography:** `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`
- **Borders:** `border-border`, `border-input`, `border-ring`
- **Accents:** `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-destructive`

**Custom Global `.ui-*` Component Classes (Preferred for complex components):**

- **Cards/Containers:** `.ui-card`, `.ui-card-muted`, `.ui-shell`, `.ui-panel`, `.ui-table-wrap`
- **Text Elements:** `.ui-text-title`, `.ui-text-body`, `.ui-text-muted`, `.ui-section-copy`
- **Forms:** `.ui-input`, `.ui-select`, `.ui-textarea`, `.ui-label`
- **Buttons:** `.ui-button-primary`, `.ui-button-secondary`, `.ui-button-danger`, `.ui-button-ghost`
- **Badges/Statuses:** `.ui-status-success`, `.ui-status-warning`, `.ui-status-neutral`, `.ui-kpi-chip`

## 6. Migration Order

1. **Shared Layouts & Overlays:** Migrate `Header.tsx`, `FeaturePageBanner.tsx`, `LanguageSwitcher.tsx`, and `AdminSelect.tsx`. These affect multiple pages simultaneously.
2. **Cards & Reusable Components:** Refactor base components like `ProjectCard.tsx`, `GalleryCard.tsx`, `EventCard.tsx`, and `CaseStudyCard.tsx`.
3. **Forms & Dialogs:** Update `TestimonialForm.tsx` and `MediaPickerDialog.tsx`.
4. **Preview & CTA Sections:** Transition all `*PreviewSection.tsx` and `*CtaSection.tsx` components to M3 architecture.
5. **Full Pages & Major Sections:** Address isolated layout logic in `login/page.tsx`, `EventDetail.tsx`, `GallerySection.tsx`, etc.
6. **Final Audit & Visual Verification:** Thoroughly toggle between light and dark modes, inspecting for any straggling contrast or shadow inconsistencies.

## 7. Risks or Compatibility Concerns

- **Image/Video Overlays:** Removing `text-white` or `bg-black/50` atop dynamic media could ruin contrast. Exceptions must be strictly validated; if a background is an image, forcing `text-white` might be necessary and correct.
- **Shadow/Blur Mismatches:** Blindly removing `backdrop-blur` from `.ui-*` component wrappers may alter visual elevation hierarchy. Ensure replacements properly utilize M3 `elevation-*` shadow utilities defined in `tailwind.config.ts` or the `.ui-card` classes.
- **Animation Artifacts:** Stripping hardcoded layout colors may inadvertently interfere with Framer Motion or Tailwind transitions that rely on specific opacity values or background renders.
- **Inconsistent Abstractions:** Accidentally mixing base Tailwind utilities (`bg-card border`) alongside the complex `.ui-card` abstraction could yield duplicate or overriding border/box-shadow rules. It is best to standardize on `.ui-card` where applicable.

## 8. Exact Files Planned for Modification

- `src/app/[locale]/login/page.tsx`
- `src/app/[locale]/forgot-password/page.tsx`
- `src/app/[locale]/reset-password/page.tsx`
- `src/app/[locale]/accept-invite/page.tsx`
- `src/app/[locale]/public/blogs/[slug]/page.tsx`
- `src/features/gallery/components/GallerySection.tsx`
- `src/features/gallery/components/GalleryCard.tsx`
- `src/features/gallery/components/GalleryDetail.tsx`
- `src/features/event/components/EventDetail.tsx`
- `src/features/event/components/EventSection.tsx`
- `src/features/event/components/EventCard.tsx`
- `src/features/contact/components/ContactSection.tsx`
- `src/features/contact/components/ContactPreviewSection.tsx`
- `src/features/contact/components/ContactCtaSection.tsx`
- `src/features/media/components/MediaPickerDialog.tsx`
- `src/features/specialization/components/SpecializationSection.tsx`
- `src/features/testimonial/components/TestimonialForm.tsx`
- `src/features/technology/components/TechnologySection.tsx`
- `src/features/case-study/components/CaseStudySection.tsx`
- `src/features/case-study/components/CaseStudyCard.tsx`
- `src/features/case-study/components/CaseStudyPreviewSection.tsx`
- `src/features/achievement/components/AchievementSection.tsx`
- `src/features/project/components/ProjectCard.tsx`
- `src/features/client/components/ClientSection.tsx`
- `src/features/about/components/AboutPreviewSection.tsx`
- `src/features/newsletter/components/NewsletterPreviewSection.tsx`
- `src/features/newsletter/components/NewsletterCtaSection.tsx`
- `src/features/team-member/components/TeamMemberSection.tsx`
- `src/features/faq/components/FaqPreviewSection.tsx`
- `src/features/hero/components/HeroPreviewSection.tsx`
- `src/shared/components/Header.tsx`
- `src/shared/components/FloatingScrollButton.tsx`
- `src/shared/components/AdminSelect.tsx`
- `src/shared/components/FeaturePageBanner.tsx`
- `src/shared/components/AppStateScreen.tsx`
- `src/shared/i18n/components/LanguageSwitcher.tsx`
