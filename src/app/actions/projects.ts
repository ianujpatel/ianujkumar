"use server";

import { prisma } from "@/lib/db";
import { isAdminAuthenticated, signJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/* ── AUTH ACTIONS ── */

export async function loginAction(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const envUsername = process.env.ADMIN_USERNAME || "admin";
    const envPassword = process.env.ADMIN_PASSWORD || "admin_secure_password_2026";

    if (username === envUsername && password === envPassword) {
      const token = await signJWT({ username });
      
      cookies().set({
        name: "admin_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 6, // 6 hours
        path: "/",
      });

      return { success: true };
    }

    return { success: false, error: "Invalid username or password" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

export async function logoutAction() {
  cookies().delete("admin_token");
  return { success: true };
}

export async function checkAuthAction() {
  const authenticated = await isAdminAuthenticated();
  return { authenticated };
}

/* ── CLOUDINARY UPLOAD ACTION ── */

export async function uploadImageAction(formData: FormData) {
  try {
    // Security check
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "portfolio-projects",
          transformation: [{ quality: "auto:good" }]
        },
        (error: unknown, result: unknown) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        }
      ).end(buffer);
    });

    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to upload image to Cloudinary" };
  }
}

/* ── PROJECT CRUD ACTIONS ── */

export async function getProjectsAction(includeUnpublished = false) {
  try {
    const projects = await prisma.project.findMany({
      where: includeUnpublished ? {} : { published: true },
      orderBy: { displayOrder: "asc" },
    });

    return {
      success: true,
      projects: projects.map((p) => ({
        ...p,
        images: JSON.parse(p.images) as string[],
      })),
    };
  } catch (error) {
    console.error("Get projects error:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function createProjectAction(data: {
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
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    // Get the highest displayOrder to append if displayOrder is not set or defaulted to 0
    let order = data.displayOrder;
    if (order === 0) {
      const highest = await prisma.project.findFirst({
        orderBy: { displayOrder: "desc" },
      });
      order = highest ? highest.displayOrder + 1 : 1;
    }

    const { safeCreateProject } = await import("@/lib/db-fallback");
    const project = await safeCreateProject({
      ...data,
      displayOrder: order,
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, project };
  } catch (error) {
    console.error("Create project error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create project" };
  }
}

export async function updateProjectAction(
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
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const { safeUpdateProject } = await import("@/lib/db-fallback");
    const project = await safeUpdateProject(id, data);

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, project };
  } catch (error) {
    console.error("Update project error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const { safeDeleteProject } = await import("@/lib/db-fallback");
    await safeDeleteProject(id);

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete project" };
  }
}

export async function reorderProjectsAction(projectIds: string[]) {
  try {
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const { safeUpdateProjectDisplayOrder } = await import("@/lib/db-fallback");
    
    // Update displayOrder sequentially to avoid transaction requirement
    for (let index = 0; index < projectIds.length; index++) {
      const id = projectIds[index];
      await safeUpdateProjectDisplayOrder(id, index + 1);
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Reorder projects error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to reorder projects" };
  }
}
