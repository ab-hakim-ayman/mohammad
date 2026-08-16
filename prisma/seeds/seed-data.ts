import {
  Status,
  ContactStatus,
} from "@prisma/client";

export const TOTAL = 15;

export const PEOPLE = [
  {
    name: "A2ICoders Owner",
    email: "admin@example.com",
    role: "OWNER",
    designation: "Founder & CEO",
    headline: "Guiding the company strategy and product vision.",
    bio: "Company owner and primary admin account for the A2ICoders CMS.",
    skillTitles: ["Leadership", "Strategy", "Product"],
    avatar: "/seed/people/owner.jpg",
    coverImage: "/seed/people/cover-owner.jpg",
    isPublic: false,
  },
  {
    name: "Nadia Rahman",
    email: "staff02@a2icoders.com",
    role: "ADMIN",
    designation: "Operations Director",
    headline: "Keeps delivery, process, and team flow on track.",
    bio: "Operations lead for client coordination, delivery rituals, and team support.",
    skillTitles: ["Operations", "Planning", "Communication"],
    avatar: "/seed/people/nadia-rahman.jpg",
    coverImage: "/seed/people/cover-02.jpg",
    isPublic: true,
  },
  {
    name: "Tanvir Hossain",
    email: "staff03@a2icoders.com",
    role: "MANAGER",
    designation: "Engineering Manager",
    headline: "Leads architecture, code quality, and technical delivery.",
    bio: "Manages backend and frontend delivery with a strong focus on quality.",
    skillTitles: ["Architecture", "Backend", "Quality"],
    avatar: "/seed/people/tanvir-hossain.jpg",
    coverImage: "/seed/people/cover-03.jpg",
    isPublic: true,
  },
  {
    name: "Farhana Akter",
    email: "staff04@a2icoders.com",
    role: "HR",
    designation: "People Partner",
    headline: "Supports hiring, onboarding, and team wellness.",
    bio: "Handles people operations, culture, and onboarding experience.",
    skillTitles: ["People Ops", "Hiring", "Culture"],
    avatar: "/seed/people/farhana-akter.jpg",
    coverImage: "/seed/people/cover-04.jpg",
    isPublic: true,
  },
  {
    name: "Rakib Uddin",
    email: "staff05@a2icoders.com",
    role: "CONTENT_MANAGER",
    designation: "Content Strategist",
    headline: "Shapes messaging across site copy and case studies.",
    bio: "Manages content structure, editorial flow, and campaign copy.",
    skillTitles: ["Writing", "SEO", "Storytelling"],
    avatar: "/seed/people/rakib-uddin.jpg",
    coverImage: "/seed/people/cover-05.jpg",
    isPublic: true,
  },
  {
    name: "Samin Ahmed",
    email: "staff06@a2icoders.com",
    role: "EMPLOYEE",
    designation: "Full Stack Engineer",
    headline: "Builds end-to-end product features and APIs.",
    bio: "Works on product features, API integration, and polished interfaces.",
    skillTitles: ["Next.js", "Prisma", "TypeScript"],
    avatar: "/seed/people/samin-ahmed.jpg",
    coverImage: "/seed/people/cover-06.jpg",
    isPublic: true,
  },
  {
    name: "Nusrat Jahan",
    email: "staff07@a2icoders.com",
    role: "EMPLOYEE",
    designation: "Product Designer",
    headline: "Crafts user journeys, UI systems, and product polish.",
    bio: "Designs interfaces, design systems, and user-friendly interactions.",
    skillTitles: ["UX", "UI Systems", "Prototyping"],
    avatar: "/seed/people/nusrat-jahan.jpg",
    coverImage: "/seed/people/cover-07.jpg",
    isPublic: true,
  },
  {
    name: "Arif Khan",
    email: "staff08@a2icoders.com",
    role: "EMPLOYEE",
    designation: "QA Engineer",
    headline: "Protects releases with checks and structured testing.",
    bio: "Supports release confidence with manual and automated test coverage.",
    skillTitles: ["Testing", "Automation", "Bug Triage"],
    avatar: "/seed/people/arif-khan.jpg",
    coverImage: "/seed/people/cover-08.jpg",
    isPublic: true,
  },
  {
    name: "Tania Akter",
    email: "staff09@a2icoders.com",
    role: "ADMIN",
    designation: "Delivery Manager",
    headline: "Coordinates timelines, milestones, and project health.",
    bio: "Keeps projects organized from discovery through delivery and support.",
    skillTitles: ["Delivery", "Scheduling", "Client Care"],
    avatar: "/seed/people/tania-akter.jpg",
    coverImage: "/seed/people/cover-09.jpg",
    isPublic: true,
  },
  {
    name: "Mehedi Hasan",
    email: "staff10@a2icoders.com",
    role: "EMPLOYEE",
    designation: "DevOps Engineer",
    headline: "Automates deployments, environments, and observability.",
    bio: "Maintains CI/CD pipelines, infrastructure, and deployment workflows.",
    skillTitles: ["Docker", "CI/CD", "AWS"],
    avatar: "/seed/people/mehedi-hasan.jpg",
    coverImage: "/seed/people/cover-10.jpg",
    isPublic: true,
  },
  {
    name: "Rafiul Islam",
    email: "staff11@a2icoders.com",
    role: "CONTENT_MANAGER",
    designation: "Brand Writer",
    headline: "Writes company stories, product copy, and launch content.",
    bio: "Creates clear marketing and product copy for the website and campaigns.",
    skillTitles: ["Copywriting", "Brand Voice", "Editing"],
    avatar: "/seed/people/rafiul-islam.jpg",
    coverImage: "/seed/people/cover-11.jpg",
    isPublic: true,
  },
  {
    name: "Sumiya Khatun",
    email: "staff12@a2icoders.com",
    role: "HR",
    designation: "Recruitment Specialist",
    headline: "Finds and supports new talent for the team.",
    bio: "Leads hiring coordination, interviews, and candidate follow-up.",
    skillTitles: ["Recruiting", "Interviewing", "Coordination"],
    avatar: "/seed/people/sumiya-khatun.jpg",
    coverImage: "/seed/people/cover-12.jpg",
    isPublic: true,
  },
  {
    name: "Imran Hossain",
    email: "staff13@a2icoders.com",
    role: "EMPLOYEE",
    designation: "Mobile Engineer",
    headline: "Builds mobile experiences and app flows.",
    bio: "Works on mobile product delivery and cross-platform implementation.",
    skillTitles: ["Mobile", "Performance", "Integration"],
    avatar: "/seed/people/imran-hossain.jpg",
    coverImage: "/seed/people/cover-13.jpg",
    isPublic: true,
  },
  {
    name: "Iftekhar Rahman",
    email: "staff14@a2icoders.com",
    role: "MANAGER",
    designation: "Solutions Architect",
    headline: "Designs reliable systems and scalable service boundaries.",
    bio: "Guides technical architecture, integrations, and long-term platform choices.",
    skillTitles: ["Architecture", "API Design", "Scalability"],
    avatar: "/seed/people/iftekhar-rahman.jpg",
    coverImage: "/seed/people/cover-14.jpg",
    isPublic: true,
  },
  {
    name: "Sharmin Sultana",
    email: "staff15@a2icoders.com",
    role: "EMPLOYEE",
    designation: "Support Specialist",
    headline: "Helps clients after launch with clear support loops.",
    bio: "Monitors support tickets, client questions, and release follow-ups.",
    skillTitles: ["Support", "Client Success", "Documentation"],
    avatar: "/seed/people/sharmin-sultana.jpg",
    coverImage: "/seed/people/cover-15.jpg",
    isPublic: true,
  },
] as const;

export const TOPICS = [
  {
    title: "Digital Transformation",
    slug: "digital-transformation",
    shortDesc: "Modernize legacy workflows and build digital operations.",
  },
  {
    title: "Product Engineering",
    slug: "product-engineering",
    shortDesc: "Ship product features with strong architecture and care.",
  },
  {
    title: "AI Automation",
    slug: "ai-automation",
    shortDesc: "Reduce repetitive work with AI assisted systems.",
  },
  {
    title: "Cloud Modernization",
    slug: "cloud-modernization",
    shortDesc: "Move infrastructure and delivery into a scalable cloud setup.",
  },
  {
    title: "Design Systems",
    slug: "design-systems",
    shortDesc: "Create reusable UI foundations for consistency.",
  },
  {
    title: "Customer Portals",
    slug: "customer-portals",
    shortDesc: "Build secure self-service experiences for clients.",
  },
  {
    title: "Internal Tools",
    slug: "internal-tools",
    shortDesc: "Simplify operations with purpose-built software.",
  },
  {
    title: "E-commerce",
    slug: "e-commerce",
    shortDesc: "Create conversion-focused shopping experiences.",
  },
  {
    title: "Data Platforms",
    slug: "data-platforms",
    shortDesc: "Organize and expose data for better decisions.",
  },
  {
    title: "Security & Compliance",
    slug: "security-compliance",
    shortDesc: "Put governance and secure defaults into the product.",
  },
  {
    title: "Support Operations",
    slug: "support-operations",
    shortDesc: "Support teams with clearer workflows and dashboards.",
  },
  {
    title: "Growth Marketing",
    slug: "growth-marketing",
    shortDesc: "Support acquisition with better pages and content.",
  },
  {
    title: "Mobile Experiences",
    slug: "mobile-experiences",
    shortDesc: "Deliver polished interfaces for smaller screens.",
  },
  {
    title: "Workflow Automation",
    slug: "workflow-automation",
    shortDesc: "Automate approval, routing, and handoff steps.",
  },
  {
    title: "Reliability Engineering",
    slug: "reliability-engineering",
    shortDesc: "Make platforms easier to observe and maintain.",
  },
] as const;

export const TECH_STACK = [
  { title: "Next.js", category: "Frontend", experience: 6, color: "#111827" },
  { title: "React", category: "Frontend", experience: 6, color: "#61dafb" },
  { title: "TypeScript", category: "Language", experience: 6, color: "#3178c6" },
  { title: "Prisma", category: "Database", experience: 5, color: "#0f172a" },
  { title: "PostgreSQL", category: "Database", experience: 5, color: "#336791" },
  { title: "Tailwind CSS", category: "UI", experience: 5, color: "#38bdf8" },
  { title: "TanStack Query", category: "State", experience: 4, color: "#ff4154" },
  { title: "Zustand", category: "State", experience: 4, color: "#f59e0b" },
  { title: "Node.js", category: "Backend", experience: 5, color: "#84cc16" },
  { title: "Docker", category: "Platform", experience: 4, color: "#2496ed" },
  { title: "AWS", category: "Platform", experience: 4, color: "#f59e0b" },
  { title: "Redis", category: "Cache", experience: 3, color: "#dc2626" },
  { title: "GitHub Actions", category: "Automation", experience: 4, color: "#1d4ed8" },
  { title: "Figma", category: "Design", experience: 5, color: "#a855f7" },
  { title: "Framer Motion", category: "Motion", experience: 4, color: "#8b5cf6" },
] as const;

export const ACHIEVEMENTS = Array.from({ length: TOTAL }, (_, index) => ({
  title: [
    "Delivered 100+ releases",
    "Reduced support turnaround by 60%",
    "Launched first AI workflow suite",
    "Cut deployment time by half",
    "Built a shared design system",
    "Improved onboarding completion",
    "Shipped 15 production apps",
    "Automated manual reporting",
    "Raised mobile task completion",
    "Established QA release checklist",
    "Standardized content operations",
    "Improved uptime and monitoring",
    "Built reusable admin modules",
    "Scaled partner integrations",
    "Created a hiring playbook",
  ][index],
  issuer: [
    "Internal Milestone",
    "Client Impact",
    "Innovation Award",
    "Process Upgrade",
    "Design Excellence",
    "People Ops",
    "Release Milestone",
    "Automation Win",
    "Mobile Success",
    "Quality Win",
    "Content Win",
    "Reliability Win",
    "Platform Win",
    "Partnership Win",
    "Talent Win",
  ][index],
  achievedAt: new Date(2024, index % 12, Math.min(28, 1 + index * 2)),
  shortDesc: `Achievement entry ${index + 1} for the A2ICoders knowledge base.`,
  icon: "/seed/achievements/icon.svg",
  image: `/seed/achievements/achievement-${String(index + 1).padStart(2, "0")}.jpg`,
}));

export const GALLERY_TITLES = [
  "Studio Showcase",
  "Product Screens",
  "Client Launches",
  "Workshops",
  "Events",
  "Design Systems",
  "Internal Tools",
  "Mobile Preview",
  "Engineering Notes",
  "Support Moments",
  "Growth Experiments",
  "Brand Assets",
  "Partner Collabs",
  "Team Retreat",
  "Future Concepts",
];

export const FAQ_QUESTIONS = [
  "How do you start a new project?",
  "What industries do you usually work with?",
  "Can you help with existing products?",
  "Do you provide design and development together?",
  "How do you handle project timelines?",
  "Can you support post-launch work?",
  "Do you build admin dashboards?",
  "Can you integrate AI into workflows?",
  "Do you work with startups and established teams?",
  "How do you estimate a project?",
  "Can you take over unfinished codebases?",
  "Do you offer long-term support plans?",
  "What technology stack do you prefer?",
  "Can you help with content and SEO?",
  "Do you sign NDAs and work confidentially?",
];

export const TESTIMONIALS = [
  { name: "Maya Karim", position: "Founder", company: "Aster Retail" },
  { name: "Shamim Hossain", position: "Director", company: "Nova Health" },
  { name: "Anika Sultana", position: "Product Lead", company: "Skyline Finance" },
  { name: "Rokon Uddin", position: "Head of Ops", company: "Orbit Logistics" },
  { name: "Tasnim Jahan", position: "CEO", company: "Luma Studio" },
  { name: "Saifur Rahman", position: "CTO", company: "Northstar Energy" },
  { name: "Nabila Islam", position: "Program Manager", company: "Summit Academy" },
  { name: "Hasan Mahmud", position: "Marketing Lead", company: "Riverbank Media" },
  { name: "Fatema Noor", position: "Operations Lead", company: "Pulse Commerce" },
  { name: "Jayed Ahmed", position: "Engineering Manager", company: "BluePeak SaaS" },
  { name: "Razia Khan", position: "Product Owner", company: "Vertex Travel" },
  { name: "Omar Faruq", position: "Founder", company: "BrightMart" },
  { name: "Mim Akter", position: "HR Manager", company: "Cloud Nine HR" },
  { name: "Rafid Hasan", position: "Solutions Lead", company: "Horizon Labs" },
  { name: "Tuhin Islam", position: "COO", company: "TrueNorth Homes" },
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildImage(folder: string, slug: string, suffix = "jpg") {
  return `/seed/${folder}/${slug}.${suffix}`;
}

export function buildDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

export function addDays(base: Date, days: number) {
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

export function cycle<T>(items: readonly T[], index: number) {
  return items[index % items.length];
}

export function uniqueSlice<T>(items: readonly T[], index: number, size: number) {
  return Array.from({ length: size }, (_, offset) => items[(index + offset) % items.length]);
}
