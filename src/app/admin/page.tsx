import { isAdminAuthenticated } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard, { Project } from "@/components/AdminDashboard";
import { getProjectsAction } from "@/app/actions/projects";
import { getAdminReviewsAction } from "@/app/actions/reviews";
import { Review } from "@/components/Reviews";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  
  if (!authenticated) {
    return <AdminLogin />;
  }

  // Fetch all projects (including unpublished ones) and all reviews for the admin dashboard
  const [projectsRes, reviewsRes] = await Promise.all([
    getProjectsAction(true),
    getAdminReviewsAction(),
  ]);

  const initialProjects = projectsRes.success ? projectsRes.projects : [];
  const initialReviews = reviewsRes.success && reviewsRes.reviews ? reviewsRes.reviews : [];
  
  return (
    <AdminDashboard 
      initialProjects={initialProjects as Project[]} 
      initialReviews={initialReviews as Review[]} 
    />
  );
}
