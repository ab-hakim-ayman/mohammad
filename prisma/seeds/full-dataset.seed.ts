import {
  AccountStatus,
  Status,
  ContactStatus,
  AuditAction,
  GalleryType,
  PartnerType,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import { hash } from "bcryptjs";
import { bumpPublicCacheVersion } from "../../src/core/server/cache";
import { createSiteInfoSeedData } from "./site-infos.seed";
import seedCategories from "./categories.seed";
import seedTags from "./tags.seed";
import seedSkills from "./skills.seed";
import seedTechnologies from "./technologies.seed";
import seedSpecializations from "./specializations.seed";
import seedAbouts from "./abouts.seed";
import seedHeroes from "./heroes.seed";
import seedTestimonials from "./testimonials.seed";
import seedContacts from "./contacts.seed";
import seedServices from "./services.seed";
import seedClients from "./clients.seed";
import seedAchievements from "./achievements.seed";
import seedIndustries from "./industries.seed";
import seedPartners from "./partners.seed";
import seedGalleries from "./galleries.seed";
import seedEvents from "./events.seed";
import seedFaqs from "./faqs.seed";
import seedProjects from "./projects.seed";
import seedBlogs from "./blogs.seed";
import seedExperiences from "./experiences.seed";
import seedEducations from "./educations.seed";

import {
  TOTAL,
  PEOPLE,
  TOPICS,
  TECH_STACK,
  CLIENTS,
  ACHIEVEMENTS,
  INDUSTRIES,
  PARTNERS,
  GALLERY_TITLES,
  FAQ_QUESTIONS,
  TESTIMONIALS,
  buildDate,
  buildImage,
  cycle,
  slugify,
  addDays,
  uniqueSlice,
} from "./seed-data";

async function clearExistingData(prisma: PrismaClient) {
  await prisma.auditLog.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.userInvitation.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.event.deleteMany();
  await prisma.client.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.siteInfo.deleteMany();
  await prisma.about.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsersAndProfiles(prisma: PrismaClient, hashedPassword: string) {
  await prisma.user.createMany({
    data: PEOPLE.map((person, index) => ({
      email: person.email,
      passwordHash: hashedPassword,
      name: person.name,
      avatar: person.avatar,
      phone: `+880170000${String(index + 1).padStart(2, "0")}`,
      role: person.role,
      status: AccountStatus.ACTIVE,
      isVerified: true,
      lastLoginAt: addDays(new Date("2024-01-01T12:00:00.000Z"), index),
    })),
  });

  const users = await prisma.user.findMany({ orderBy: { email: "asc" } });

  const skills = await prisma.skill.findMany({ orderBy: { title: "asc" } });

  for (const [index, user] of users.entries()) {
    const person = PEOPLE[index];
    await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: person.name,
        headline: person.headline,
        bio: person.bio,
        avatar: person.avatar,
        coverImage: person.coverImage,
        designation: person.designation,
        experienceYears: 3 + index,
        githubUrl: `https://github.com/a2icoders/${slugify(person.name)}`,
        linkedinUrl: `https://www.linkedin.com/in/${slugify(person.name)}`,
        portfolioUrl: `https://a2icoders.com/people/${slugify(person.name)}`,
        isPublic: person.isPublic,
        skills: {
          connect: skills
            .filter((skill) => (person.skillTitles as readonly string[]).includes(skill.title))
            .map((skill) => ({ id: skill.id })),
        },
      },
    });
  }

  const profiles = await prisma.profile.findMany({ orderBy: { userId: "asc" } });

  return { users, profiles };
}

async function seedReferenceData(
  prisma: PrismaClient,
  users: Awaited<ReturnType<typeof seedUsersAndProfiles>>["users"]
) {
  await seedCategories(prisma);
  await seedTags(prisma);
  await seedSkills(prisma);
  await seedTechnologies(prisma);
  await seedSpecializations(prisma);
  await seedAbouts(prisma, users);

  await prisma.siteInfo.create({
    data: createSiteInfoSeedData({
      createdByIds: users.map((user) => user.id),
      updatedByIds: users
        .slice()
        .reverse()
        .map((user) => user.id),
    })[0], // SiteInfo is now a singleton
  });

  await seedHeroes(prisma, users);
  await seedTestimonials(prisma);
  await seedContacts(prisma);
  await seedServices(prisma, users);
  await seedClients(prisma);
  await seedAchievements(prisma);
  await seedIndustries(prisma);
  await seedPartners(prisma);
  await seedGalleries(prisma);
  await seedEvents(prisma);
  await seedFaqs(prisma);
  await seedExperiences(prisma, users);
  await seedEducations(prisma, users);

  const categories = await prisma.category.findMany({ orderBy: { slug: "asc" } });
  const tags = await prisma.tag.findMany({ orderBy: { slug: "asc" } });
  const technologies = await prisma.technology.findMany({ orderBy: { title: "asc" } });
  const galleries = await prisma.gallery.findMany({ orderBy: { slug: "asc" } });
  const profiles = await prisma.profile.findMany({ orderBy: { userId: "asc" } });
  const clientsDb = await prisma.client.findMany({ orderBy: { title: "asc" } });

  await seedProjects(prisma, users, clientsDb);

  const projects = await prisma.project.findMany({ orderBy: { slug: "asc" } });

  await seedBlogs(prisma, users);

  return { categories, tags, technologies, projects, galleries, profiles };
}

async function seedRelations(
  prisma: PrismaClient,
  users: Array<{ id: string; email: string; role: UserRole }>,
  relations: Awaited<ReturnType<typeof seedReferenceData>>
) {
  const blogs = await prisma.blog.findMany({ orderBy: { slug: "asc" } });

  for (const [index, blog] of blogs.entries()) {
    await prisma.blog.update({
      where: { id: blog.id },
      data: {
        categories: {
          connect: [
            {
              id:
                relations.categories[index % relations.categories.length]?.id ??
                relations.categories[0].id,
            },
            {
              id:
                relations.categories[(index + 1) % relations.categories.length]?.id ??
                relations.categories[0].id,
            },
          ],
        },
        tags: {
          connect: uniqueSlice(relations.tags, index, 3).map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  // Connect technologies and projects to experiences
  const experiences = await prisma.experience.findMany();
  for (const [index, exp] of experiences.entries()) {
    await prisma.experience.update({
      where: { id: exp.id },
      data: {
        projects: {
          connect: uniqueSlice(relations.projects, index, 2).map((project) => ({ id: project.id })),
        },
        technologies: {
          connect: uniqueSlice(relations.technologies, index, 3).map((tech) => ({ id: tech.id })),
        },
      },
    });
  }

  for (const [index, project] of relations.projects.entries()) {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        technologies: {
          connect: uniqueSlice(relations.technologies, index, 3).map((technology) => ({
            id: technology.id,
          })),
        },
      },
    });
  }

  for (const [index, project] of relations.projects.entries()) {
    await prisma.caseStudy.upsert({
      where: { slug: `${project.slug}-case-study` },
      update: {
        title: `${project.title} Case Study`,
        shortDesc: project.shortDesc,
        heroImage: project.heroImage,
        galleryImages: [
          buildImage("case-studies", `${project.slug}-1`),
          buildImage("case-studies", `${project.slug}-2`),
        ],
        ogImage: project.ogImage,
        status: index % 3 !== 2 ? Status.PUBLISHED : Status.DRAFT,
        isFeatured: index < 5,
        project: { connect: { id: project.id } },
        createdBy: { connect: { id: users[index % users.length].id } },
        updatedBy: { connect: { id: users[(index + 1) % users.length].id } },
      },
      create: {
        title: `${project.title} Case Study`,
        slug: `${project.slug}-case-study`,
        shortDesc: project.shortDesc,
        heroImage: project.heroImage,
        galleryImages: [
          buildImage("case-studies", `${project.slug}-1`),
          buildImage("case-studies", `${project.slug}-2`),
        ],
        ogImage: project.ogImage,
        status: index % 3 !== 2 ? Status.PUBLISHED : Status.DRAFT,
        isFeatured: index < 5,
        project: { connect: { id: project.id } },
        createdBy: { connect: { id: users[index % users.length].id } },
        updatedBy: { connect: { id: users[(index + 1) % users.length].id } },
      },
    });
  }

  await prisma.galleryItem.createMany({
    data: relations.galleries.map((gallery, index) => ({
      title: `${gallery.title} Item`,
      shortDesc: `Gallery showcase for ${gallery.title.toLowerCase()}.`,
      image: buildImage("gallery-items", gallery.slug),
      type: index % 4 === 3 ? GalleryType.VIDEO : GalleryType.IMAGE,
      videoUrl: index % 4 === 3 ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : null,
      thumbnail: buildImage("gallery-items", `${gallery.slug}-thumb`),
      order: 1,
      status: Status.PUBLISHED,
      galleryId: gallery.id,
    })),
  });

  await prisma.userInvitation.createMany({
    data: users.map((user, index) => ({
      email: `invite${String(index + 1).padStart(2, "0")}@example.com`,
      tokenHash: `invite-token-${String(index + 1).padStart(2, "0")}`,
      role: user.role,
      invitedById: users[0].id,
      expiresAt: addDays(new Date("2024-01-01T12:00:00.000Z"), 30 + index),
      acceptedAt:
        index % 4 === 0 ? addDays(new Date("2024-01-01T12:00:00.000Z"), 35 + index) : null,
    })),
  });

  await prisma.passwordResetToken.createMany({
    data: users.map((user, index) => ({
      userId: user.id,
      tokenHash: `reset-token-${String(index + 1).padStart(2, "0")}`,
      expiresAt: addDays(new Date("2024-01-01T12:00:00.000Z"), 7 + index),
      usedAt: index % 3 === 0 ? addDays(new Date("2024-01-01T12:00:00.000Z"), 8 + index) : null,
    })),
  });

  await prisma.auditLog.createMany({
    data: users.map((user, index) => ({
      actorId: user.id,
      action: cycle(
        [
          AuditAction.CREATE,
          AuditAction.UPDATE,
          AuditAction.DELETE,
          AuditAction.PUBLISH,
          AuditAction.UNPUBLISH,
          AuditAction.ARCHIVE,
          AuditAction.RESTORE,
          AuditAction.FEATURE,
          AuditAction.UNFEATURE,
          AuditAction.LOGIN,
          AuditAction.LOGOUT,
          AuditAction.ROLE_CHANGE,
          AuditAction.STATUS_CHANGE,
          AuditAction.PASSWORD_CHANGE,
          AuditAction.INVITE,
        ],
        index
      ),
      entityType: cycle(
        [
          "user",
          "profile",
          "blog",
          "project",
          "service",
          "case_study",
          "gallery",
          "contact",
          "partner",
          "achievement",
          "faq",
        ],
        index
      ),
      entityId: cycle(
        [
          user.id,
          relations.profiles[index % relations.profiles.length]?.id ?? relations.profiles[0].id,
          relations.projects[index % relations.projects.length]?.id ?? user.id,
          relations.projects[index % relations.projects.length]?.id ?? user.id,
          relations.projects[index % relations.projects.length]?.id ?? user.id,
          relations.projects[index % relations.projects.length]?.id ?? user.id,
          relations.galleries[index % relations.galleries.length]?.id ?? user.id,
          user.id,
          user.id,
          relations.categories[index % relations.categories.length]?.id ??
          relations.categories[0].id,
          relations.categories[(index + 1) % relations.categories.length]?.id ??
          relations.categories[0].id,
        ],
        index
      ),
      oldValues: { seed: true, index, before: user.email },
      newValues: { seed: true, index, after: user.email },
      ipAddress: `127.0.0.${index + 1}`,
      userAgent: `SeedBot/${index + 1}`,
    })),
  });
}

async function syncCaseStudiesFromProjects(prisma: PrismaClient) {
  const projects = await prisma.project.findMany({
    where: { status: Status.PUBLISHED },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      clientId: true,
      heroImage: true,
      ogImage: true,
      shortDesc: true,
    },
  });

  await prisma.caseStudy.deleteMany();

  for (const [index, project] of projects.entries()) {
    await prisma.caseStudy.create({
      data: {
        title: `${project.title} Case Study`,
        slug: `${project.slug}-case-study`,
        shortDesc: project.shortDesc,
        heroImage: project.heroImage,
        galleryImages: project.heroImage ? [project.heroImage] : [],
        ogImage: project.ogImage,
        status: Status.PUBLISHED,
        isFeatured: index < 3,
        project: { connect: { id: project.id } },
      },
    });
  }
}

export async function seedAllModels(prisma: PrismaClient) {
  console.log("🌱 Seeding full 15-entry dataset...");
  const hashedPassword = await hash("admin123", 12);

  await clearExistingData(prisma);

  const usersAndProfiles = await seedUsersAndProfiles(prisma, hashedPassword);
  const relations = await seedReferenceData(prisma, usersAndProfiles.users);
  await seedRelations(prisma, usersAndProfiles.users, relations);
  await syncCaseStudiesFromProjects(prisma);
  await Promise.all([
    bumpPublicCacheVersion("case-studies"),
    bumpPublicCacheVersion("projects"),
    bumpPublicCacheVersion("services"),
    bumpPublicCacheVersion("blogs"),
    bumpPublicCacheVersion("events"),
    bumpPublicCacheVersion("achievements"),
    bumpPublicCacheVersion("galleries"),
    bumpPublicCacheVersion("clients"),
    bumpPublicCacheVersion("partners"),
    bumpPublicCacheVersion("faqs"),
    bumpPublicCacheVersion("heroes"),
    bumpPublicCacheVersion("technologies"),
    bumpPublicCacheVersion("specializations"),
    bumpPublicCacheVersion("categories"),
    bumpPublicCacheVersion("tags"),
    bumpPublicCacheVersion("site-info"),
    bumpPublicCacheVersion("industries"),
    bumpPublicCacheVersion("experiences"),
    bumpPublicCacheVersion("educations"),
  ]);

  console.log("✅ Full dataset seeded successfully");
}
