import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects, { Project } from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Reviews, { Review } from "@/components/Reviews";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Skills from "@/components/Skills";
import { getProjectsAction } from "@/app/actions/projects";
import { getApprovedReviewsAction } from "@/app/actions/reviews";

export default async function Home() {
  const [projectsRes, reviewsRes] = await Promise.all([
    getProjectsAction(),
    getApprovedReviewsAction(),
  ]);

  const initialProjects = projectsRes.success ? projectsRes.projects : [];
  const initialReviews = reviewsRes.success && reviewsRes.reviews ? reviewsRes.reviews : [];

  return (
    <main id="home" className="relative min-h-screen bg-[#121212] selection:bg-white/20">
      <Navbar />
      {/* 500vh Scroll Sequence */}
      <ScrollyCanvas />

      {/* Skills Section */}
      <Skills />

      {/* Projects Grid beneath the Skills section */}
      <Projects initialProjects={initialProjects as Project[]} />

      {/* Additional Sections */}
      <Experience />
      <Education />
      <Reviews initialReviews={initialReviews as Review[]} />
      <Footer />
    </main>
  );
}
