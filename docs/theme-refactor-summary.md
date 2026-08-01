# Material Design 3 (M3) Theme Refactor Summary

## Overview

The codebase underwent a massive architectural and design system refactor to align with Material Design 3 (M3) principles. The goal was to eliminate fragmented styling, manual dark-mode implementations (like hardcoded hex codes and direct `bg-black`/`bg-white` classes), and inconsistent semantic hierarchy.

The refactor centralized all colors, radiuses, shadows, and layout primitives around a robust HSL-based Tailwind CSS variable architecture that automatically adapts to system or user-selected Light/Dark modes without manual class-flipping.

## Phased Execution

### Phase 1: Core Setup & Token Registry

- **`globals.css`**: Migrated all hardcoded variables to semantic HSL tokens (`--background`, `--foreground`, `--primary`, `--muted`, `--card`, `--border`, etc.). Added dedicated dark mode mapping (`.dark`).
- **`tailwind.config.ts`**: Updated color definitions to use the new HSL variables with native Tailwind opacity support.

### Phase 2: Core Components & Primitives

- **Shared UI**: Updated utility classes (`ui-button`, `ui-card`, `ui-input`) to rely entirely on semantic tokens.
- **Micro-interactions**: Standardized hover states, borders, and focus rings using `ring-primary/20` and `border-border`.

### Phase 3: Layouts & Scaffolding

- **Header & Footer**: Replaced heavy static backgrounds with fluid, translucent surfaces (`bg-background/80`, `backdrop-blur`).
- **Sidebar**: Standardized navigation highlight states and interactive element tokens.

### Phase 4: Showcase Modules

- **Projects & Case Studies**: Standardized card layouts. Replaced rogue color-mix gradients with clean semantic overlays.
- **Galleries**: Removed excessive `brand` color injections, standardizing on the global `primary` token.

### Phase 5: Information & Contact

- **Specializations & Technologies**: Updated container surfaces to use `bg-muted` and `bg-card` instead of hardcoded `bg-black` or generic gray scales.
- **Team Members & Clients**: Streamlined list views and avatars to ensure high contrast and readability.
- **FAQs**: Updated accordion surfaces and hover interactions.

### Phase 6: Overlays & Forms

- **Newsletters & CTAs**: Migrated inline form elements and call-to-action blocks to the `bg-card` token with `border-border` outlines.
- **Media Picker & Modals**: Ensured all overlay elements utilize correct structural tokens (`bg-card`, `bg-background/50` backdrops).

### Phase 7: Validation & Finalization

- **Sweeps**: Grepped the entire `src/` directory to strip remaining instances of `bg-white`, `text-black`, `text-white`, and `bg-black` outside of intentional image overlays.
- **Build Checks**: Fixed Typescript strictness errors (e.g., standardizing custom `tone` props to restricted M3 union types like `"blue" | "emerald" | "neutral"`).

## Key Design Improvements

1. **Dynamic Dark Mode**: All pages now dynamically shift between light and dark themes using CSS variables rather than hardcoded `dark:bg-slate-900` utility classes.
2. **Elevation & Depth**: Shadows and borders are now layered logically using `border-border`, `shadow-sm`, and `bg-card`/`bg-muted` to imply depth hierarchy.
3. **Typography Contrast**: The `text-foreground` and `text-muted-foreground` system ensures optimal reading contrast across all surfaces.

## Next Steps

- Implement end-to-end visual regression testing to capture future rogue color injections.
- Monitor component usage to further abstract repetitive patterns into shared UI components.
