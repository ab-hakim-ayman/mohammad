import { PrismaClient, Status } from "@prisma/client";
import { buildImage, cycle } from "./seed-data";

export default async function seedEducations(
  prisma: PrismaClient,
  users?: Array<{ id: string }>
) {
  console.log("Seeding Educations...");

  if (!users?.length) return;

  const institutions = [
    { name: "Harvard University", url: "https://harvard.edu", degree: "Master of Science", field: "Computer Science" },
    { name: "Stanford University", url: "https://stanford.edu", degree: "Bachelor of Science", field: "Computer Science" },
    { name: "MIT", url: "https://mit.edu", degree: "PhD", field: "Artificial Intelligence" },
    { name: "UC Berkeley", url: "https://berkeley.edu", degree: "Bachelor of Science", field: "Electrical Engineering" },
    { name: "CMU", url: "https://cmu.edu", degree: "Master of Science", field: "Software Engineering" },
    { name: "BUET", url: "https://buet.ac.bd", degree: "Bachelor of Science", field: "Computer Science & Engineering" },
    { name: "Dhaka University", url: "https://du.ac.bd", degree: "Master of Science", field: "Information Technology" },
    { name: "Caltech", url: "https://caltech.edu", degree: "PhD", field: "Physics" },
    { name: "Oxford University", url: "https://ox.ac.uk", degree: "Master of Science", field: "Mathematical Finance" },
    { name: "Cambridge University", url: "https://cam.ac.uk", degree: "Bachelor of Science", field: "Computer Science" },
    { name: "University of Waterloo", url: "https://uwaterloo.ca", degree: "Bachelor of Applied Science", field: "Software Engineering" },
    { name: "Georgia Tech", url: "https://gatech.edu", degree: "Master of Science", field: "Computer Science" },
    { name: "UT Austin", url: "https://utexas.edu", degree: "Bachelor of Science", field: "Computer Science" },
    { name: "Cornell University", url: "https://cornell.edu", degree: "Master of Science", field: "Information Science" },
    { name: "Princeton University", url: "https://princeton.edu", degree: "Bachelor of Science", field: "Operations Research" },
  ];

  for (let index = 0; index < institutions.length; index++) {
    const inst = institutions[index];
    const user = users[index % users.length];

    await prisma.education.create({
      data: {
        institution: inst.name,
        institutionUrl: inst.url,
        degree: inst.degree,
        fieldOfStudy: inst.field,
        grade: cycle(["3.9 / 4.0", "4.0 / 4.0", "3.8 / 4.0", "A+", "First Class Honours"], index),
        startDate: new Date(2005 + index, 8, 1),
        endDate: index === 0 ? null : new Date(2009 + index, 5, 30),
        isCurrent: index === 0,
        shortDesc: `Completed coursework and research in ${inst.field} at ${inst.name}.`,
        contentJson: {
          blocks: [
            {
              type: "paragraph",
              content: `Underwent rigorous academic training in ${inst.field} at ${inst.name}. Participated in multiple research projects and technical societies.`,
            },
          ],
        },
        logo: buildImage("educations", `logo-${inst.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`),
        certificateUrl: `https://credentials.example.com/${inst.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        status: Status.PUBLISHED,
        isFeatured: index < 5,
        order: index + 1,
        createdById: user.id,
        updatedById: user.id,
      },
    });
  }
}
