import {
  Terminal, Rss, Users, Images, Mail, FileText, Cpu,
  Trophy, Briefcase, Phone, Globe, Building2, UserRoundCheck,
  Settings, FolderGit2, HelpCircle, Code2, Award, ArrowRight, Layers
} from "lucide-react";
import React from "react";

// 🔧 Cloudinary Base URLs Configuration
const CLOUDINARY_IMAGE_BASE = "https://res.cloudinary.com/a2icoders/image/upload/f_auto,q_auto";
const CLOUDINARY_VIDEO_BASE = "https://res.cloudinary.com/a2icoders/video/upload/q_auto";

export const A2I_BANNER_MANIFEST = {
  about: {
    variant: "splitInline" as const,
    eyebrow: "Who We Are",
    icon: React.createElement(Users, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Engineering the Digital Tomorrow at A2ICoders",
    description: "We are a premier technology powerhouse dedicated to building resilient cloud systems, high-performance web solutions, and automated enterprise frameworks.",
    supportingCopy: "* Over 5 years of driving architectural excellence globally.",
    chips: ["Agile Culture", "Enterprise Scale", "Innovation First"],
    stats: [{ value: "100%", label: "Client Success" }, { value: "50+", label: "Engineers" }],
    actions: [{ label: "Meet the Team", href: "/team", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/about-mesh.jpg`,
    imageAlt: "A2ICoders global engineering headquarters and collaborative environment structure",
    imagePriority: true,
    imagePosition: "center"
  },

  blog: {
    variant: "splitInline" as const,
    eyebrow: "A2I Insights Engine",
    icon: React.createElement(Rss, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Deep Dives into Code, Cloud & Systems Architecture",
    description: "Technical telemetry, architectural blueprints, and engineering strategy straight from production environments handled by A2ICoders.",
    supportingCopy: "* Insights compiled weekly by core infrastructure leads.",
    chips: ["Cloud Native", "Backend Systems", "Frontend Architecture"],
    stats: [{ value: "120+", label: "Technical Logs" }, { value: "10k+", label: "Dev Readers" }],
    actions: [{ label: "Subscribe via RSS", href: "/feed.xml", variant: "primary" as const, icon: React.createElement(Rss, { className: "h-4 w-4" }) }],
    imageSrc: "https://res.cloudinary.com/davslv8dz/image/upload/v1785521406/a2icoders/site-info/og/thedigitalartist-banner-5185350-e77fac4e.jpg",
    imageAlt: "Cyberpunk dev console with real-time systems telemetry data logs",
    imagePriority: true,
    imagePosition: "center"
  },

  experience: {
    variant: "splitInline" as const,
    eyebrow: "Professional Timeline",
    icon: React.createElement(Briefcase, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Engineering Journey & Professional Milestones",
    description: "A chronological timeline of roles, technical leadership, and production-scale impacts driven across global projects.",
    supportingCopy: "* Building software that scales with absolute mathematical consistency.",
    chips: ["Tech Leadership", "Infrastructure Scaling", "Consulting Sprints"],
    stats: [{ value: "5+ Years", label: "Professional Span" }, { value: "100%", label: "System Uptime" }],
    actions: [{ label: "Contact Us", href: "/contact", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/projects-showcase.jpg`,
    imageAlt: "Professional engineering timeline workspace representation",
    imagePriority: true,
    imagePosition: "center"
  },

  education: {
    variant: "minimal" as const,
    eyebrow: "Academic Blueprint",
    icon: React.createElement(Award, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Formal Education & Technical Certification Pathways",
    description: "Academic degree details, continuous specialization pathways, and validated systems certifications.",
    supportingCopy: "* Grounded in computer science theory and practical systems architectures.",
    chips: ["Computer Science", "Systems Design", "Architectural Certifications"],
    stats: [{ value: "CS Degree", label: "Formal Base" }, { value: "Continuous", label: "Specialization" }],
    actions: [{ label: "View Technical Skills", href: "/technology", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/skills-blueprint.jpg`,
    imageAlt: "Academic certificate details and computer science systems layout blueprint",
    imagePriority: true,
    imagePosition: "center"
  },

  gallery: {
    variant: "minimal" as const,
    eyebrow: "Life at A2ICoders",
    icon: React.createElement(Images, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Inside the Labs of Modern Innovation",
    description: "A visual journey through our development sprints, tech symposiums, collaborative design workshops, and ecosystem culture.",
    supportingCopy: "* Where high performance meets a sustainable workspace dynamic.",
    chips: ["Hackathons", "Office Vibe", "Tech Talks"],
    stats: [{ value: "20+", label: "Culture Events" }, { value: "3", label: "Global Hubs" }],
    actions: [{ label: "Explore Careers", href: "/career", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/gallery-culture.jpg`,
    imageAlt: "A2ICoders engineers hacking together in a modern open lab space",
    imagePriority: false,
    imagePosition: "center"
  },


  specialization: {
    variant: "minimal" as const,
    eyebrow: "Core Competencies",
    icon: React.createElement(Cpu, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Advanced Capabilities for Complex Software Challenges",
    description: "From massive scale multi-tenant SaaS structures to complex real-time event streaming systems, our specializations drive predictable digital excellence.",
    supportingCopy: "* Engineered for safety, speed, and mathematical scaling efficiency.",
    chips: ["Distributed Ledgers", "AI/ML Integrations", "Sub-10ms Latency Tuning"],
    stats: [{ value: "99.99%", label: "Target Availability" }, { value: "100%", label: "CI/CD Covered" }],
    actions: [{ label: "View Services Matrix", href: "/service", variant: "secondary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/specialization-nodes.jpg`,
    imageAlt: "Futuristic hardware processor engine glowing with active neural matrix grids",
    imagePriority: false,
    imagePosition: "center"
  },

  technology: {
    variant: "splitInline" as const,
    eyebrow: "The A2I Stack",
    icon: React.createElement(Terminal, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Proven Frameworks, Modern Engines, Cloud Scale",
    description: "We orchestrate applications using highly reliable architectures, ensuring maximum security, maintainability, and fluid performance across platforms.",
    supportingCopy: "* Rigorously vetted against industry vulnerability lists annually.",
    chips: ["Next.js", "Django Core", "AWS Ecosystem", "PostgreSQL", "Redis"],
    stats: [{ value: "2026", label: "Core Specification" }, { value: "Zero", label: "Legacy Debt" }],
    actions: [{ label: "Inspect Standards", href: "/specialization", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/tech-matrix.jpg`,
    imageAlt: "Clean terminal running modern compiler processes smoothly",
    imagePriority: true,
    imagePosition: "center"
  },

  achievement: {
    variant: "minimal" as const,
    eyebrow: "Milestones Achieved",
    icon: React.createElement(Trophy, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Setting Industry Standards in Software Engineering",
    description: "A testament to our dedication to high code quality, security protocols, and revolutionary digital products built globally.",
    supportingCopy: "* Awarded for outstanding complex computing deliveries.",
    chips: ["ISO Standards", "Security Certified", "Top Tech Agency"],
    stats: [{ value: "15+", label: "Industry Awards" }, { value: "500M+", label: "API Loads Managed" }],
    actions: [{ label: "Read Case Studies", href: "/case-study", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/achievements-hall.jpg`,
    imageAlt: "Minimal futuristic digital trophies glowing in dark exhibition hall layout",
    imagePriority: false,
    imagePosition: "center"
  },


  contact: {
    variant: "minimal" as const,
    eyebrow: "Connect with Us",
    icon: React.createElement(Phone, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Let's Architect Your Next Technical Leap",
    description: "Reach out to A2ICoders' primary advisory desk for consulting, strategic engineering augmentation, or custom software delivery blueprints.",
    supportingCopy: "* Secure systems communication endpoints active 24/7.",
    chips: ["Enterprise Consulting", "General Enquiries", "Career Path Routing"],
    stats: [{ value: "Global", label: "Availability" }, { value: "< 2h", label: "Triage Pipeline" }],
    actions: [{ label: "Secure Gateway Link", href: "https://secure.a2icoders.com", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/contact-geo.jpg`,
    imageAlt: "Dark low-poly geometric layout representing communication matrices",
    imagePriority: true,
    imagePosition: "center"
  },

  service: {
    variant: "splitInline" as const,
    eyebrow: "Our Solutions Catalog",
    icon: React.createElement(Settings, { className: "h-3.5 w-3.5 text-primary" }),
    title: "End-to-End High-Fidelity Engineering Services",
    description: "From initial discovery and strict UX prototyping to cloud infrastructure scaling and multi-tenant security hardening.",
    supportingCopy: "* Supported by comprehensive devsecops compliance monitoring.",
    chips: ["Custom Web Apps", "Cloud Transformation", "API Integrations"],
    stats: [{ value: "100%", label: "Automated Testing" }, { value: "Continuous", label: "Delivery" }],
    actions: [{ label: "Initiate Discovery Sprint", href: "/quote", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/services-gears.jpg`,
    imageAlt: "Sleek abstract mathematical geometry elements aligning harmoniously",
    imagePriority: true,
    imagePosition: "center"
  },

  testimonial: {
    variant: "minimal" as const,
    eyebrow: "Client Advocacy",
    icon: React.createElement(Award, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Endorsements from Global Engineering Directors",
    description: "See why tech executives and product owners trust A2ICoders with their mission-critical platforms and complex data systems.",
    supportingCopy: "* Authenticated case studies and reference reviews verified via Clutch.",
    chips: ["Verified Reviews", "Executive Feedback", "Scale Validation"],
    stats: [{ value: "4.9/5", label: "Clutch Rating" }, { value: "95%", label: "NPS Score" }],
    actions: [{ label: "Read Customer Stories", href: "/case-study", variant: "secondary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/testimonials-mesh.jpg`,
    imageAlt: "Smooth modern corporate spatial background layout indicating enterprise credibility",
    imagePriority: false,
    imagePosition: "center"
  },

  "case-study": {
    variant: "splitInline" as const,
    eyebrow: "Engineering Deep Dives",
    icon: React.createElement(FileText, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Deconstructive Delivery Stories from Production",
    description: "Unfiltered access to the exact bottlenecks we encountered, architectural trade-offs made, and performance victories achieved by A2ICoders.",
    supportingCopy: "* Grounded strictly in telemetry, logs, and verifiable cluster metrics.",
    chips: ["Bottleneck Analysis", "Infrastructure Scale", "Refactoring Matrix"],
    stats: [{ value: "400%", label: "Speedups" }, { value: "60%", label: "Cloud Cost Cuts" }],
    actions: [{ label: "View Technical Repos", href: "/projects", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: "https://res.cloudinary.com/davslv8dz/image/upload/v1785588342/a2icoders/galleries/photo-1556761175-5973dc0f32e7-07431288.avif",
    imageAlt: "Detailed structural analytics chart dashboard plotting cluster optimization points",
    imagePriority: true,
    imagePosition: "center"
  },

  profile: {
    variant: "splitInline" as const,
    eyebrow: "Executive DNA",
    icon: React.createElement(UserRoundCheck, { className: "h-3.5 w-3.5 text-primary" }),
    title: "A2ICoders Organization Capability Overview",
    description: "A comprehensive look into our execution parameters, security protocols, talent engine, and corporate governance architectures.",
    supportingCopy: "* Maintained under active quality management audits.",
    chips: ["Capability Deck", "Security Protocols", "Compliance Standards"],
    stats: [{ value: "Tier-1", label: "Talent Engine" }, { value: "Zero-Trust", label: "Architecture" }],
    actions: [{ label: "Download Capability Deck", href: "/assets/deck.pdf", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/profile-dna.jpg`,
    imageAlt: "Abstract digital network strands weaving corporate identity matrix lines",
    imagePriority: false,
    imagePosition: "center"
  },

  "site-info": {
    variant: "minimal" as const,
    eyebrow: "System Metadata",
    icon: React.createElement(Terminal, { className: "h-3.5 w-3.5 text-primary" }),
    title: "System Telemetry and Site Specifications",
    description: "This portal is a high-performance interface deployed via Next.js Server Components, calculated dynamically with Tailwind CSS v4.",
    supportingCopy: "* Absolute optimized rendering framework with zero unnecessary tracking script bloat.",
    chips: ["Next.js 15", "Tailwind v4", "shadcn UI Core"],
    stats: [{ value: "100/100", label: "Lighthouse Score" }, { value: "Sub-50ms", label: "TTFB Velocity" }],
    actions: [{ label: "Inspect Source Manifest", href: "https://github.com/a2icoders/site", variant: "secondary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: "",
    imageAlt: ""
  },


  category: {
    variant: "minimal" as const,
    eyebrow: "Index System",
    icon: React.createElement(Layers, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Categorized Architectural Resource Clusters",
    description: "Filter our global capabilities, technical assets, and systems logs through logical functional buckets.",
    supportingCopy: "* Dynamically synchronized index pipelines.",
    chips: ["Backend Logic", "Cloud Automation", "UI Design System"],
    stats: [{ value: "12", label: "Global Categories" }],
    actions: [{ label: "Reset Directory Filter", href: "#reset", variant: "secondary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }]
  },

  faq: {
    variant: "minimal" as const,
    eyebrow: "Knowledge Base",
    icon: React.createElement(HelpCircle, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Frequently Asked Engineering and Engagement Questions",
    description: "Clear answers regarding A2ICoders' engagement pricing structures, project workflows, tech-stack policies, and onboarding sprints.",
    supportingCopy: "* Updated transparently for enterprise compliance mapping protocols.",
    chips: ["Pricing Matrix", "SLA Guarantees", "IP Ownership Details"],
    stats: [{ value: "100%", label: "IP Clearance" }, { value: "2-Week", label: "Onboarding Sprint" }],
    actions: [{ label: "Open Secure Support Desk", href: "/contact", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/faq-matrix.jpg`,
    imageAlt: "Clean geometric floating blocks forming a neat structural grid configuration",
    imagePriority: false,
    imagePosition: "center"
  },

  project: {
    variant: "splitInline" as const,
    eyebrow: "Systems Deployed",
    icon: React.createElement(FolderGit2, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Selected Delivery Work Across Enterprise Product Domains",
    description: "Explore a dynamic curated showcase of applications built, managed, and optimized by A2ICoders across the global market.",
    supportingCopy: "* Real-world metrics logged directly via verified cluster configurations.",
    chips: ["SaaS Suites", "E-Commerce Engines", "Automation Scripts"],
    stats: [{ value: "100+", label: "Systems Deployed" }, { value: "40M+", label: "Active Users" }],
    actions: [{ label: "Initiate Project Scoping", href: "/quote", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/projects-showcase.jpg`,
    imageAlt: "Multiple dark clean enterprise software dashboard layouts stacked elegantly",
    imagePriority: true,
    imagePosition: "center"
  },

  skill: {
    variant: "minimal" as const,
    eyebrow: "Technical Matrix",
    icon: React.createElement(Code2, { className: "h-3.5 w-3.5 text-primary" }),
    title: "Granular Capabilities Shaping Our Deliverables",
    description: "A comprehensive breakdown of our code execution paradigms, distributed clustering capabilities, and advanced software layers.",
    supportingCopy: "* Monitored under state-of-the-art static analysis protocols.",
    chips: ["Concurrency Controls", "Distributed Caching", "Schema Optimization"],
    stats: [{ value: "100%", label: "Strict Typing" }, { value: "Zero-Debt", label: "Code Policy" }],
    actions: [{ label: "Review Tech Stack", href: "/technology", variant: "secondary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/skills-blueprint.jpg`,
    imageAlt: "Detailed abstract blueprints with layered multi-tier software system blocks",
    imagePriority: false,
    imagePosition: "center"
  },

  tool: {
    variant: "splitInline" as const,
    eyebrow: "Developer Utilities",
    icon: React.createElement(Terminal, { className: "h-3.5 w-3.5 text-primary" }),
    title: "High-Performance Interactive Developer Tools",
    description: "Client-side developer utilities for instant formatting, encoding, JWT parsing, UUID generation, and system transformations with zero server latency.",
    supportingCopy: "* All computations execute strictly in-browser for complete privacy.",
    chips: ["Zero Server Load", "Privacy First", "Client-Side Executed", "Sub-1ms Latency"],
    stats: [{ value: "100%", label: "Client-Side" }, { value: "Sub-1ms", label: "Transformation Speed" }],
    actions: [{ label: "Browse All Tools", href: "/tools", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/tech-matrix.jpg`,
    imageAlt: "Developer workspace terminal executing interactive transformations",
    imagePriority: true,
    imagePosition: "center"
  },

  tools: {
    variant: "splitInline" as const,
    eyebrow: "Developer Utilities",
    icon: React.createElement(Terminal, { className: "h-3.5 w-3.5 text-primary" }),
    title: "High-Performance Interactive Developer Tools",
    description: "Client-side developer utilities for instant formatting, encoding, JWT parsing, UUID generation, and system transformations with zero server latency.",
    supportingCopy: "* All computations execute strictly in-browser for complete privacy.",
    chips: ["Zero Server Load", "Privacy First", "Client-Side Executed", "Sub-1ms Latency"],
    stats: [{ value: "100%", label: "Client-Side" }, { value: "Sub-1ms", label: "Transformation Speed" }],
    actions: [{ label: "Browse All Tools", href: "/tools", variant: "primary" as const, icon: React.createElement(ArrowRight, { className: "h-4 w-4" }) }],
    imageSrc: `${CLOUDINARY_IMAGE_BASE}/banners/tech-matrix.jpg`,
    imageAlt: "Developer workspace terminal executing interactive transformations",
    imagePriority: true,
    imagePosition: "center"
  }
};