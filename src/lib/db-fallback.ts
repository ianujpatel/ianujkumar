import { prisma } from "./db";

function generateCuid() {
  return 'c' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
}

export async function safeCreateProject(data: {
  title: string;
  category: string;
  year: string;
  tag: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  accent: string;
  accentHex: string;
  gradFrom: string;
  gradTo: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  image: string;
  images: string[];
}) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        category: data.category,
        year: data.year,
        tag: data.tag,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        techStack: data.techStack,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        accent: data.accent,
        accentHex: data.accentHex,
        gradFrom: data.gradFrom,
        gradTo: data.gradTo,
        featured: data.featured,
        published: data.published,
        displayOrder: data.displayOrder,
        image: data.image,
        images: JSON.stringify(data.images),
      },
    });
    return project;
  } catch (error: unknown) {
    const err = error as Error;
    if (err?.message?.includes("Transactions are not supported") || err?.message?.includes("transaction")) {
      console.warn("Transactions not supported. Falling back to raw MongoDB insert for Project.");
      const id = generateCuid();
      await prisma.$runCommandRaw({
        insert: "Project",
        documents: [
          {
            _id: id,
            title: data.title,
            category: data.category,
            year: data.year,
            tag: data.tag,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            techStack: data.techStack,
            liveUrl: data.liveUrl || null,
            githubUrl: data.githubUrl || null,
            accent: data.accent,
            accentHex: data.accentHex,
            gradFrom: data.gradFrom,
            gradTo: data.gradTo,
            featured: data.featured,
            published: data.published,
            displayOrder: data.displayOrder,
            image: data.image,
            images: JSON.stringify(data.images),
            createdAt: { $date: new Date().toISOString() },
            updatedAt: { $date: new Date().toISOString() },
          },
        ],
      });
      const created = await prisma.project.findUnique({ where: { id } });
      if (!created) throw new Error("Failed to retrieve project after raw insert");
      return created;
    }
    throw error;
  }
}

export async function safeUpdateProject(
  id: string,
  data: {
    title: string;
    category: string;
    year: string;
    tag: string;
    shortDescription: string;
    fullDescription: string;
    techStack: string;
    liveUrl?: string | null;
    githubUrl?: string | null;
    accent: string;
    accentHex: string;
    gradFrom: string;
    gradTo: string;
    featured: boolean;
    published: boolean;
    displayOrder: number;
    image: string;
    images: string[];
  }
) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        year: data.year,
        tag: data.tag,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        techStack: data.techStack,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        accent: data.accent,
        accentHex: data.accentHex,
        gradFrom: data.gradFrom,
        gradTo: data.gradTo,
        featured: data.featured,
        published: data.published,
        displayOrder: data.displayOrder,
        image: data.image,
        images: JSON.stringify(data.images),
      },
    });
    return project;
  } catch (error: unknown) {
    const err = error as Error;
    if (err?.message?.includes("Transactions are not supported") || err?.message?.includes("transaction")) {
      console.warn("Transactions not supported. Falling back to raw MongoDB update for Project.");
      await prisma.$runCommandRaw({
        update: "Project",
        updates: [
          {
            q: { _id: id },
            u: {
              $set: {
                title: data.title,
                category: data.category,
                year: data.year,
                tag: data.tag,
                shortDescription: data.shortDescription,
                fullDescription: data.fullDescription,
                techStack: data.techStack,
                liveUrl: data.liveUrl || null,
                githubUrl: data.githubUrl || null,
                accent: data.accent,
                accentHex: data.accentHex,
                gradFrom: data.gradFrom,
                gradTo: data.gradTo,
                featured: data.featured,
                published: data.published,
                displayOrder: data.displayOrder,
                image: data.image,
                images: JSON.stringify(data.images),
                updatedAt: { $date: new Date().toISOString() },
              },
            },
            multi: false,
          },
        ],
      });
      const updated = await prisma.project.findUnique({ where: { id } });
      if (!updated) throw new Error("Failed to retrieve project after raw update");
      return updated;
    }
    throw error;
  }
}

export async function safeUpdateProjectDisplayOrder(id: string, displayOrder: number) {
  try {
    return await prisma.project.update({
      where: { id },
      data: { displayOrder },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err?.message?.includes("Transactions are not supported") || err?.message?.includes("transaction")) {
      console.warn("Transactions not supported. Falling back to raw MongoDB update for Project displayOrder.");
      await prisma.$runCommandRaw({
        update: "Project",
        updates: [
          {
            q: { _id: id },
            u: {
              $set: {
                displayOrder,
                updatedAt: { $date: new Date().toISOString() },
              },
            },
            multi: false,
          },
        ],
      });
      return { id };
    }
    throw error;
  }
}

export async function safeDeleteProject(id: string) {
  try {
    return await prisma.project.delete({
      where: { id },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err?.message?.includes("Transactions are not supported") || err?.message?.includes("transaction")) {
      console.warn("Transactions not supported. Falling back to raw MongoDB delete for Project.");
      await prisma.$runCommandRaw({
        delete: "Project",
        deletes: [
          {
            q: { _id: id },
            limit: 1,
          },
        ],
      });
      return { id };
    }
    throw error;
  }
}

export async function safeCreateReview(data: {
  name: string;
  rating: number;
  message: string;
  approved: boolean;
  date: string;
}) {
  try {
    return await prisma.review.create({
      data: {
        name: data.name,
        rating: data.rating,
        message: data.message,
        approved: data.approved,
        date: data.date,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err?.message?.includes("Transactions are not supported") || err?.message?.includes("transaction")) {
      console.warn("Transactions not supported. Falling back to raw MongoDB insert for Review.");
      const id = generateCuid();
      await prisma.$runCommandRaw({
        insert: "Review",
        documents: [
          {
            _id: id,
            name: data.name,
            rating: data.rating,
            message: data.message,
            approved: data.approved,
            date: data.date,
            createdAt: { $date: new Date().toISOString() },
            updatedAt: { $date: new Date().toISOString() },
          },
        ],
      });
      const created = await prisma.review.findUnique({ where: { id } });
      if (!created) throw new Error("Failed to retrieve review after raw insert");
      return created;
    }
    throw error;
  }
}

export async function safeUpdateReview(
  id: string,
  data: {
    name?: string;
    rating?: number;
    message?: string;
    approved?: boolean;
  }
) {
  try {
    return await prisma.review.update({
      where: { id },
      data,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err?.message?.includes("Transactions are not supported") || err?.message?.includes("transaction")) {
      console.warn("Transactions not supported. Falling back to raw MongoDB update for Review.");
      const setFields: Record<
        string,
        string | number | boolean | null | undefined | Record<string, string>
      > = {};
      if (data.name !== undefined) setFields.name = data.name;
      if (data.rating !== undefined) setFields.rating = data.rating;
      if (data.message !== undefined) setFields.message = data.message;
      if (data.approved !== undefined) setFields.approved = data.approved;
      setFields.updatedAt = { $date: new Date().toISOString() };

      await prisma.$runCommandRaw({
        update: "Review",
        updates: [
          {
            q: { _id: id },
            u: {
              $set: setFields,
            },
            multi: false,
          },
        ],
      });
      const updated = await prisma.review.findUnique({ where: { id } });
      if (!updated) throw new Error("Failed to retrieve review after raw update");
      return updated;
    }
    throw error;
  }
}

export async function safeDeleteReview(id: string) {
  try {
    return await prisma.review.delete({
      where: { id },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err?.message?.includes("Transactions are not supported") || err?.message?.includes("transaction")) {
      console.warn("Transactions not supported. Falling back to raw MongoDB delete for Review.");
      await prisma.$runCommandRaw({
        delete: "Review",
        deletes: [
          {
            q: { _id: id },
            limit: 1,
          },
        ],
      });
      return { id };
    }
    throw error;
  }
}
