import { PrismaClient, Status, EmploymentType } from "@prisma/client";
import { buildImage, cycle } from "./seed-data";

export default async function seedExperiences(
  prisma: PrismaClient,
  users?: Array<{ id: string }>
) {
  console.log("Seeding Experiences...");

  if (!users?.length) return;

  const companies = [
    { name: "Google", url: "https://google.com", pos: "Senior Software Engineer" },
    { name: "Microsoft", url: "https://microsoft.com", pos: "Software Engineer II" },
    { name: "Meta", url: "https://meta.com", pos: "Tech Lead" },
    { name: "Netflix", url: "https://netflix.com", pos: "Senior Frontend Engineer" },
    { name: "Amazon", url: "https://amazon.com", pos: "Software Development Engineer" },
    { name: "Stripe", url: "https://stripe.com", pos: "Full Stack Engineer" },
    { name: "Vercel", url: "https://vercel.com", pos: "Developer Advocate" },
    { name: "Supabase", url: "https://supabase.com", pos: "Backend Engineer" },
    { name: "Prisma", url: "https://prisma.io", pos: "Developer Relations Engineer" },
    { name: "Shopify", url: "https://shopify.com", pos: "Senior Rails Engineer" },
    { name: "Airbnb", url: "https://airbnb.com", pos: "UI Engineer" },
    { name: "Uber", url: "https://uber.com", pos: "Systems Engineer" },
    { name: "Slack", url: "https://slack.com", pos: "Desktop Engineer" },
    { name: "GitHub", url: "https://github.com", pos: "Platform Engineer" },
    { name: "Atlassian", url: "https://atlassian.com", pos: "Product Engineer" },
  ];

  const employmentTypes = [
    EmploymentType.FULL_TIME,
    EmploymentType.FULL_TIME,
    EmploymentType.FULL_TIME,
    EmploymentType.FULL_TIME,
    EmploymentType.FULL_TIME,
    EmploymentType.CONTRACT,
    EmploymentType.FREELANCE,
    EmploymentType.PART_TIME,
    EmploymentType.INTERNSHIP,
  ];

  for (let index = 0; index < companies.length; index++) {
    const company = companies[index];
    const user = users[index % users.length];

    await prisma.experience.create({
      data: {
        companyName: company.name,
        companyUrl: company.url,
        position: company.pos,
        employmentType: cycle(employmentTypes, index),
        location: cycle(["San Francisco, CA", "Seattle, WA", "New York, NY", "Remote", "Dhaka, Bangladesh"], index),
        locationType: cycle(["Onsite", "Hybrid", "Remote"], index),
        startDate: new Date(2010 + index, index % 12, 1),
        endDate: index === 0 ? null : new Date(2012 + index, index % 12, 1),
        isCurrent: index === 0,
        shortDesc: `Led key initiatives and managed high-impact services at ${company.name} as a ${company.pos}.`,
        contentJson: {
          blocks: [
            {
              type: "paragraph",
              content: `A detailed description of the roles and responsibilities undertaken at ${company.name} as a ${company.pos}. Developed scalable applications and improved developer workflows.`,
            },
          ],
        },
        logo: buildImage("experiences", `logo-${company.name.toLowerCase()}`),
        cardImage: buildImage("experiences", `card-${company.name.toLowerCase()}`),
        ogImage: buildImage("experiences", `og-${company.name.toLowerCase()}`),
        status: Status.PUBLISHED,
        isFeatured: index < 5,
        order: index + 1,
        createdById: user.id,
        updatedById: user.id,
      },
    });
  }
}
