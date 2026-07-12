"use server";

import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface ReviewInput {
  name: string;
  rating: number;
  message: string;
}

/* ── PUBLIC ACTIONS ── */

// Get only approved reviews for rendering on the frontpage
export async function getApprovedReviewsAction() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, reviews };
  } catch (error) {
    console.error("Get approved reviews error:", error);
    return { success: false, error: "Failed to fetch reviews" };
  }
}

// Guest user submits a review (defaults to approved: false for moderation)
export async function submitReviewAction(data: ReviewInput) {
  try {
    const { name, rating, message } = data;
    if (!name || !message || rating < 1 || rating > 5) {
      throw new Error("Invalid review details provided");
    }

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    const { safeCreateReview } = await import("@/lib/db-fallback");
    const newReview = await safeCreateReview({
      name,
      rating,
      message,
      approved: false, // Moderated by default
      date: dateStr,
    });

    // Revalidate paths to update pages if necessary
    revalidatePath("/");

    return { success: true, review: newReview };
  } catch (error) {
    console.error("Submit review error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit review" };
  }
}

/* ── ADMIN PROTECTED ACTIONS ── */

// Fetch all reviews (approved & unapproved) for dashboard moderation
export async function getAdminReviewsAction() {
  try {
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, reviews };
  } catch (error) {
    console.error("Get admin reviews error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch reviews" };
  }
}

// Approve a review
export async function approveReviewAction(id: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const { safeUpdateReview } = await import("@/lib/db-fallback");
    await safeUpdateReview(id, { approved: true });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Approve review error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to approve review" };
  }
}

// Unapprove/Reject a review
export async function unapproveReviewAction(id: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const { safeUpdateReview } = await import("@/lib/db-fallback");
    await safeUpdateReview(id, { approved: false });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Unapprove review error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to unapprove review" };
  }
}

// Update/Edit a review details
export async function updateReviewAction(id: string, data: Partial<ReviewInput> & { approved?: boolean }) {
  try {
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const { name, rating, message, approved } = data;

    const { safeUpdateReview } = await import("@/lib/db-fallback");
    await safeUpdateReview(id, {
      ...(name && { name }),
      ...(rating !== undefined && { rating }),
      ...(message && { message }),
      ...(approved !== undefined && { approved }),
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update review error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update review" };
  }
}

// Delete a review
export async function deleteReviewAction(id: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      throw new Error("Unauthorized");
    }

    const { safeDeleteReview } = await import("@/lib/db-fallback");
    await safeDeleteReview(id);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete review error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete review" };
  }
}
