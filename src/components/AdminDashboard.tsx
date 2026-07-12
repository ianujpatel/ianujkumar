"use client";

import { useState } from "react";
import {
  logoutAction,
  uploadImageAction,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  reorderProjectsAction,
} from "@/app/actions/projects";
import {
  approveReviewAction,
  unapproveReviewAction,
  updateReviewAction,
  deleteReviewAction,
} from "@/app/actions/reviews";
import { Review } from "@/components/Reviews";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  Upload,
  LogOut,
  Globe,
  Loader2,
  X,
  Palette,
  Image as ImageIcon,
  Search,
} from "lucide-react";

// Inline Github Icon Component for maximum build stability
function Github({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
import { motion, AnimatePresence } from "framer-motion";

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  tag: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string;
  liveUrl: string | null;
  githubUrl: string | null;
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

const COLOR_PRESETS = [
  {
    name: "Violet (Default)",
    accent: "139,92,246",
    accentHex: "#8b5cf6",
    gradFrom: "#7c3aed",
    gradTo: "#06b6d4",
  },
  {
    name: "Teal",
    accent: "20,184,166",
    accentHex: "#14b8a6",
    gradFrom: "#0d9488",
    gradTo: "#818cf8",
  },
  {
    name: "Amber-Orange",
    accent: "251,146,60",
    accentHex: "#fb923c",
    gradFrom: "#f59e0b",
    gradTo: "#f472b6",
  },
  {
    name: "Pink-Rose",
    accent: "244,114,182",
    accentHex: "#f472b6",
    gradFrom: "#e879f9",
    gradTo: "#f43f5e",
  },
];

const DEFAULT_FORM_STATE = {
  title: "",
  category: "",
  year: new Date().getFullYear().toString(),
  tag: "",
  shortDescription: "",
  fullDescription: "",
  techStack: "",
  liveUrl: "",
  githubUrl: "",
  accent: "139,92,246",
  accentHex: "#8b5cf6",
  gradFrom: "#7c3aed",
  gradTo: "#06b6d4",
  featured: false,
  published: true,
  displayOrder: 0,
  image: "",
  images: [] as string[],
};

export default function AdminDashboard({ 
  initialProjects,
  initialReviews = [],
}: { 
  initialProjects: Project[];
  initialReviews?: Review[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formVal, setFormVal] = useState(DEFAULT_FORM_STATE);
  
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [reviewFormError, setReviewFormError] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"projects" | "reviews">("projects");

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewSearchQuery, setReviewSearchQuery] = useState("");
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewFormVal, setReviewFormVal] = useState({ name: "", rating: 5, message: "", approved: false });
  const [reviewSaving, setReviewSaving] = useState(false);

  // Toggle Review Approval
  const toggleReviewApproval = async (review: Review) => {
    const isApproved = !!review.approved;
    const updated = { ...review, approved: !isApproved };
    setReviews(reviews.map((r) => (r.id === review.id ? updated : r)));
    
    if (isApproved) {
      await unapproveReviewAction(review.id);
    } else {
      await approveReviewAction(review.id);
    }
  };

  // Open Edit Review Form
  const handleOpenEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setReviewFormVal({
      name: review.name,
      rating: review.rating,
      message: review.message,
      approved: !!review.approved,
    });
    setReviewFormError(null);
    setReviewFormOpen(true);
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const result = await deleteReviewAction(id);
    if (result.success) {
      setReviews(reviews.filter((r) => r.id !== id));
    } else {
      alert(result.error || "Failed to delete review");
    }
  };

  // Submit Review Form (Edit)
  const handleReviewFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReviewId) return;
    setReviewSaving(true);
    setReviewFormError(null);
    try {
      const result = await updateReviewAction(editingReviewId, reviewFormVal);
      if (result.success) {
        setReviews(
          reviews.map((r) =>
            r.id === editingReviewId
              ? { ...r, ...reviewFormVal }
              : r
          )
        );
        setReviewFormOpen(false);
      } else {
        setReviewFormError(result.error || "Failed to update review");
      }
    } catch (err) {
      console.error(err);
      setReviewFormError("An error occurred while saving the review");
    } finally {
      setReviewSaving(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logoutAction();
    window.location.reload();
  };

  // Reorder projects in DB
  const updateOrderInDb = async (newProjects: Project[]) => {
    setReordering(true);
    const ids = newProjects.map((p) => p.id);
    const result = await reorderProjectsAction(ids);
    if (!result.success) {
      alert("Failed to save new project order in database.");
    }
    setReordering(false);
  };

  // Move Project Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[index - 1];
    newProjects[index - 1] = temp;
    setProjects(newProjects);
    updateOrderInDb(newProjects);
  };

  // Move Project Down
  const moveDown = (index: number) => {
    if (index === projects.length - 1) return;
    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[index + 1];
    newProjects[index + 1] = temp;
    setProjects(newProjects);
    updateOrderInDb(newProjects);
  };

  // Toggle Publish Status
  const togglePublish = async (project: Project) => {
    const updated = { ...project, published: !project.published };
    const list = projects.map((p) => (p.id === project.id ? updated : p));
    setProjects(list);
    await updateProjectAction(project.id, updated);
  };

  // Toggle Featured Status
  const toggleFeatured = async (project: Project) => {
    const updated = { ...project, featured: !project.featured };
    const list = projects.map((p) => (p.id === project.id ? updated : p));
    setProjects(list);
    await updateProjectAction(project.id, updated);
  };

  // Delete Project
  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this project? This action cannot be undone.")) return;
    
    const result = await deleteProjectAction(id);
    if (result.success) {
      setProjects(projects.filter((p) => p.id !== id));
    } else {
      alert(result.error || "Failed to delete project");
    }
  };

  // Open Form for Create
  const handleOpenCreate = () => {
    setFormVal({
      ...DEFAULT_FORM_STATE,
      displayOrder: projects.length + 1,
    });
    setFormError(null);
    setIsEdit(false);
    setEditingId(null);
    setFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (project: Project) => {
    setFormVal({
      title: project.title,
      category: project.category,
      year: project.year,
      tag: project.tag,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      techStack: project.techStack,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      accent: project.accent,
      accentHex: project.accentHex,
      gradFrom: project.gradFrom,
      gradTo: project.gradTo,
      featured: project.featured,
      published: project.published,
      displayOrder: project.displayOrder,
      image: project.image,
      images: project.images,
    });
    setFormError(null);
    setIsEdit(true);
    setEditingId(project.id);
    setFormOpen(true);
  };

  // Image Upload handler for Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isThumbnail) setUploadingThumbnail(true);
    else setUploadingGallery(true);
    setFormError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImageAction(formData);
        if (result.success && result.url) {
          if (isThumbnail) {
            setFormVal((prev) => ({ ...prev, image: result.url }));
            break; // Thumbnail is single image
          } else {
            setFormVal((prev) => ({ ...prev, images: [...prev.images, result.url] }));
          }
        } else {
          setFormError(`Upload failed: ${result.error || "Unknown error"}`);
        }
      }
    } catch (err) {
      console.error(err);
      setFormError("Image upload failed.");
    } finally {
      setUploadingThumbnail(false);
      setUploadingGallery(false);
      // Reset input value to allow uploading same file again
      e.target.value = "";
    }
  };

  // Apply Theme Preset
  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setFormVal((prev) => ({
      ...prev,
      accent: preset.accent,
      accentHex: preset.accentHex,
      gradFrom: preset.gradFrom,
      gradTo: preset.gradTo,
    }));
  };

  // Form Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVal.image) {
      setFormError("Please upload or enter a thumbnail image URL.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (isEdit && editingId) {
        const result = await updateProjectAction(editingId, formVal);
        if (result.success && result.project) {
          const updatedProj: Project = {
            ...result.project,
            images: JSON.parse(result.project.images),
          };
          setProjects(projects.map((p) => (p.id === editingId ? updatedProj : p)));
          setFormOpen(false);
        } else {
          setFormError(`Error updating project: ${result.error}`);
        }
      } else {
        const result = await createProjectAction(formVal);
        if (result.success && result.project) {
          const newProj: Project = {
            ...result.project,
            images: JSON.parse(result.project.images),
          };
          setProjects([...projects, newProj]);
          setFormOpen(false);
        } else {
          setFormError(`Error creating project: ${result.error}`);
        }
      }
    } catch (err) {
      console.error(err);
      setFormError("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  // Filter projects by search query
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter reviews by search query
  const filteredReviews = reviews.filter(
    (r) =>
      r.name.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      r.message.toLowerCase().includes(reviewSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070707] text-white/95 font-sans p-6 md:p-10 select-none">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <span className="bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
                PORTFOLIO OS
              </span>
              <span className="text-white/20 text-lg">/</span>
              <span className="text-sm font-semibold text-white/50 uppercase tracking-widest">
                Admin Center
              </span>
            </h1>
            <p className="text-xs text-white/40 mt-1 font-light">
              Manage works, images, and client testimonials dynamically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "projects" && (
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest text-white/80 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Tabs Control */}
        <div className="flex gap-6 border-b border-white/5 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("projects")}
            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "projects"
                ? "border-violet-400 text-white font-black"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "reviews"
                ? "border-violet-400 text-white font-black"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Testimonials
          </button>
        </div>

        {activeTab === "projects" ? (
          <>
            {/* Search Panel */}
            <div className="flex items-center gap-3 mb-6 bg-white/[0.02] border border-white/[0.05] px-4 py-3 rounded-2xl max-w-md">
              <Search className="h-4 w-4 text-white/30" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white/80 placeholder-white/20 w-full"
              />
            </div>

            {/* Projects List Grid */}
            <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {reordering && (
                <div className="bg-violet-950/20 border-b border-violet-500/20 text-xs px-4 py-2.5 text-violet-300 flex items-center gap-2 animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving layout order...
                </div>
              )}

              <div className="overflow-x-auto">
                {filteredProjects.length > 0 ? (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-[10px] tracking-widest uppercase font-bold bg-white/[0.01]">
                        <th className="p-4 pl-6 w-16">Order</th>
                        <th className="p-4 w-20">Preview</th>
                        <th className="p-4">Project Details</th>
                        <th className="p-4 w-28 text-center">Featured</th>
                        <th className="p-4 w-28 text-center">Published</th>
                        <th className="p-4 pr-6 w-32 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.map((project, idx) => (
                        <tr key={project.id} className="hover:bg-white/[0.01] transition-colors">
                          {/* Drag Order Controls */}
                          <td className="p-4 pl-6">
                            <div className="flex flex-col items-center gap-1.5">
                              <button
                                onClick={() => moveUp(idx)}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-white/10 disabled:opacity-20 text-white/50 hover:text-white transition-all cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-xs font-mono font-bold text-white/45">{idx + 1}</span>
                              <button
                                onClick={() => moveDown(idx)}
                                disabled={idx === projects.length - 1}
                                className="p-1 rounded hover:bg-white/10 disabled:opacity-20 text-white/50 hover:text-white transition-all cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Thumbnail Preview */}
                          <td className="p-4">
                            <div className="h-12 w-16 rounded-md overflow-hidden bg-neutral-900 border border-white/10 relative">
                              {project.image ? (
                                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-white/20">
                                  <ImageIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Project Meta */}
                          <td className="p-4">
                            <div>
                              <div className="font-bold text-[15px] flex items-center gap-2">
                                {project.title}
                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.02] text-white/40 font-normal font-mono">
                                  {project.year}
                                </span>
                              </div>
                              <div className="text-xs text-white/40 mt-1 flex items-center gap-3">
                                <span className="text-violet-400 font-semibold">{project.category}</span>
                                <span>•</span>
                                <span>{project.tag}</span>
                                <span>•</span>
                                <span className="font-mono text-[10px] max-w-[200px] truncate bg-white/5 px-1.5 py-0.5 rounded text-white/55">
                                  {project.techStack}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Featured Star */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleFeatured(project)}
                              className={`p-2.5 rounded-full border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                project.featured
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                                  : "bg-white/[0.02] border-white/5 text-white/20 hover:text-white/40 hover:border-white/10"
                              }`}
                            >
                              <Star className={`h-4.5 w-4.5 ${project.featured ? "fill-amber-400" : ""}`} />
                            </button>
                          </td>

                          {/* Published Status Eye */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => togglePublish(project)}
                              className={`p-2.5 rounded-full border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                project.published
                                  ? "bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
                                  : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                              }`}
                            >
                              {project.published ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5" />}
                            </button>
                          </td>

                          {/* Action buttons */}
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(project)}
                                className="p-2 border border-white/10 bg-white/[0.02] hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all cursor-pointer"
                                title="Edit project"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="p-2 border border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition-all cursor-pointer"
                                title="Delete project"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-20 text-white/30 font-light text-sm">
                    No projects found. Click &quot;Add Project&quot; to add your first work!
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Reviews Search Panel */}
            <div className="flex items-center gap-3 mb-6 bg-white/[0.02] border border-white/[0.05] px-4 py-3 rounded-2xl max-w-md">
              <Search className="h-4 w-4 text-white/30" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={reviewSearchQuery}
                onChange={(e) => setReviewSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white/80 placeholder-white/20 w-full"
              />
            </div>

            {/* Reviews List Grid */}
            <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                {filteredReviews.length > 0 ? (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-[10px] tracking-widest uppercase font-bold bg-white/[0.01]">
                        <th className="p-4 pl-6">Client</th>
                        <th className="p-4 w-28 text-center">Rating</th>
                        <th className="p-4">Message</th>
                        <th className="p-4 w-28 text-center">Status</th>
                        <th className="p-4 pr-6 w-32 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredReviews.map((review) => (
                        <tr key={review.id} className="hover:bg-white/[0.01] transition-colors">
                          {/* Client Name & Date */}
                          <td className="p-4 pl-6">
                            <div>
                              <div className="font-bold text-[14px] text-white/90">{review.name}</div>
                              <div className="text-[10px] text-white/30 mt-0.5">{review.date}</div>
                            </div>
                          </td>

                          {/* Rating */}
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < review.rating ? "fill-amber-400 text-amber-400" : "text-white/10"
                                  }`}
                                />
                              ))}
                            </div>
                          </td>

                          {/* Message */}
                          <td className="p-4">
                            <p className="text-xs text-white/60 font-light leading-relaxed max-w-xl truncate" title={review.message}>
                              &ldquo;{review.message}&rdquo;
                            </p>
                          </td>

                          {/* Status (Approved Toggle Button) */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleReviewApproval(review)}
                              className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                review.approved
                                  ? "bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
                                  : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                              }`}
                            >
                              {review.approved ? "Approved" : "Pending"}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditReview(review)}
                                className="p-2 border border-white/10 bg-white/[0.02] hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all cursor-pointer"
                                title="Edit review"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="p-2 border border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition-all cursor-pointer"
                                title="Delete review"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-20 text-white/30 font-light text-sm">
                    No reviews found.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Slide-over Form Drawer/Modal */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Form Title */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-violet-500" />
                    {isEdit ? "Edit Project Details" : "Create New Project"}
                  </h2>
                  <p className="text-xs text-white/40 mt-1 font-light">
                    {isEdit ? "Modify settings for this case study." : "Add a new work to your portfolio database."}
                  </p>
                </div>
                <button
                  onClick={() => setFormOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Error Banner */}
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-xs flex flex-col gap-1.5 mb-6">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Operation Failed
                  </div>
                  <p className="font-light leading-relaxed">{formError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Project Title</label>
                    <input
                      type="text"
                      required
                      value={formVal.title}
                      onChange={(e) => setFormVal({ ...formVal, title: e.target.value })}
                      placeholder="e.g. Neon Horizon"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Category</label>
                    <input
                      type="text"
                      required
                      value={formVal.category}
                      onChange={(e) => setFormVal({ ...formVal, category: e.target.value })}
                      placeholder="e.g. WebGL Experience"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Tag */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Tag Pill</label>
                    <input
                      type="text"
                      required
                      value={formVal.tag}
                      onChange={(e) => setFormVal({ ...formVal, tag: e.target.value })}
                      placeholder="e.g. 3D / Motion"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Project Year</label>
                    <input
                      type="text"
                      required
                      value={formVal.year}
                      onChange={(e) => setFormVal({ ...formVal, year: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      required
                      value={formVal.techStack}
                      onChange={(e) => setFormVal({ ...formVal, techStack: e.target.value })}
                      placeholder="e.g. React, Three.js, Tailwind CSS, Framer Motion"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Short Description</label>
                    <input
                      type="text"
                      required
                      value={formVal.shortDescription}
                      onChange={(e) => setFormVal({ ...formVal, shortDescription: e.target.value })}
                      placeholder="Short 1-2 sentence hook summarizing the case study."
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Full Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Full Case Study Description</label>
                    <textarea
                      rows={5}
                      required
                      value={formVal.fullDescription}
                      onChange={(e) => setFormVal({ ...formVal, fullDescription: e.target.value })}
                      placeholder="Detailed explanation of the challenges, your role, and design architecture."
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 font-light leading-relaxed custom-scrollbar"
                    />
                  </div>

                  {/* Live Demo URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={formVal.liveUrl}
                      onChange={(e) => setFormVal({ ...formVal, liveUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Github Source URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold flex items-center gap-1.5">
                      <Github className="h-3 w-3" />
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formVal.githubUrl}
                      onChange={(e) => setFormVal({ ...formVal, githubUrl: e.target.value })}
                      placeholder="https://github.com/your-username/repo"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                {/* Color Schemes & Palette Presets */}
                <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.01] space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Palette className="h-4 w-4 text-violet-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/70">Project Visual Styling</span>
                  </div>

                  {/* Presets */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold block mb-2">Palette Presets</label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="flex items-center gap-2 text-xs px-3 py-1.5 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                        >
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ background: `linear-gradient(135deg, ${preset.gradFrom}, ${preset.gradTo})` }}
                          />
                          <span className="text-[11px] text-white/70">{preset.name.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Styling Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Accent (RGB) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Accent (RGB)</label>
                      <input
                        type="text"
                        required
                        value={formVal.accent}
                        onChange={(e) => setFormVal({ ...formVal, accent: e.target.value })}
                        placeholder="e.g. 139,92,246"
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                    {/* Accent Hex */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Accent Hex</label>
                      <input
                        type="text"
                        required
                        value={formVal.accentHex}
                        onChange={(e) => setFormVal({ ...formVal, accentHex: e.target.value })}
                        placeholder="e.g. #8b5cf6"
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                    {/* Grad From */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Grad From (Hex)</label>
                      <input
                        type="text"
                        required
                        value={formVal.gradFrom}
                        onChange={(e) => setFormVal({ ...formVal, gradFrom: e.target.value })}
                        placeholder="e.g. #7c3aed"
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                    {/* Grad To */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Grad To (Hex)</label>
                      <input
                        type="text"
                        required
                        value={formVal.gradTo}
                        onChange={(e) => setFormVal({ ...formVal, gradTo: e.target.value })}
                        placeholder="e.g. #06b6d4"
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Cloudinary Image Manager */}
                <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.01] space-y-5">
                  
                  {/* Thumbnail Manager */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold block">
                      Thumbnail Image (Aspect ratio ~16:9 recommended)
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      <div className="h-28 w-44 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden relative">
                        {formVal.image ? (
                          <>
                            <img src={formVal.image} alt="Thumbnail preview" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFormVal({ ...formVal, image: "" })}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center text-white/20 p-2">
                            <ImageIcon className="h-7 w-7 mx-auto mb-1 stroke-1" />
                            <span className="text-[10px]">No Thumbnail Selected</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors">
                            {uploadingThumbnail ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingThumbnail}
                              onChange={(e) => handleImageUpload(e, true)}
                              className="hidden"
                            />
                          </label>

                          <span className="text-[10px] text-white/20">or paste URL:</span>
                        </div>

                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... or Cloudinary URL"
                          value={formVal.image}
                          onChange={(e) => setFormVal({ ...formVal, image: e.target.value })}
                          className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images Manager */}
                  <div className="space-y-3 border-t border-white/5 pt-4">
                    <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold block">
                      Additional Gallery Screenshots ({formVal.images.length} images added)
                    </label>

                    {/* Previews grid */}
                    {formVal.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {formVal.images.map((url, i) => (
                          <div key={i} className="h-16 rounded-lg bg-neutral-900 border border-white/10 overflow-hidden relative group">
                            <img src={url} alt={`Screenshot ${i + 1}`} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFormVal({ ...formVal, images: formVal.images.filter((_, idx) => idx !== i) })}
                              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 duration-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors">
                        {uploadingGallery ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        Upload Screenshots
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingGallery}
                          onChange={(e) => handleImageUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-white/25">Supports multiple file selections. Saved to Cloudinary.</span>
                    </div>
                  </div>

                </div>

                {/* Status Toggles */}
                <div className="flex flex-wrap gap-6 pt-2">
                  {/* Featured status */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formVal.featured}
                      onChange={(e) => setFormVal({ ...formVal, featured: e.target.checked })}
                      className="rounded border-white/20 bg-white/[0.02] text-violet-500 focus:ring-violet-500/20"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-white/70">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
                      Featured Project (Displays highlighted on homepage)
                    </div>
                  </label>

                  {/* Published status */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formVal.published}
                      onChange={(e) => setFormVal({ ...formVal, published: e.target.checked })}
                      className="rounded border-white/20 bg-white/[0.02] text-violet-500 focus:ring-violet-500/20"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-white/70">
                      <Eye className="h-3.5 w-3.5 text-teal-400" />
                      Published (Visible in main grid)
                    </div>
                  </label>
                </div>

                {/* Submit Controls */}
                <div className="border-t border-white/10 pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-5 py-3 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingThumbnail || uploadingGallery}
                    className="px-6 py-3 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-white/5"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      "Save Project"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Edit Modal */}
      <AnimatePresence>
        {reviewFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-widest text-violet-400">
                    Edit Review
                  </h2>
                  <p className="text-[10px] text-white/40 mt-1 font-light">
                    Modify client name, rating, and feedback text.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewFormOpen(false)}
                  className="p-1.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Error Banner */}
              {reviewFormError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-xs flex flex-col gap-1.5 mb-5">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Operation Failed
                  </div>
                  <p className="font-light leading-relaxed">{reviewFormError}</p>
                </div>
              )}

              <form onSubmit={handleReviewFormSubmit} className="space-y-5">
                {/* Client Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold block">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewFormVal.name}
                    onChange={(e) => setReviewFormVal({ ...reviewFormVal, name: e.target.value })}
                    placeholder="Sarah Jenkins"
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold block">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewFormVal({ ...reviewFormVal, rating: star })}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors duration-200 ${
                            star <= reviewFormVal.rating ? "fill-amber-400 text-amber-400" : "text-white/20"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold block">
                    Feedback Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewFormVal.message}
                    onChange={(e) => setReviewFormVal({ ...reviewFormVal, message: e.target.value })}
                    placeholder="Absolutely stunning work..."
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                {/* Approved Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={reviewFormVal.approved}
                    onChange={(e) => setReviewFormVal({ ...reviewFormVal, approved: e.target.checked })}
                    className="rounded border-white/20 bg-white/[0.02] text-violet-500 focus:ring-violet-500/20"
                  />
                  <div className="text-xs text-white/70">
                    Approved (Visible on homepage)
                  </div>
                </label>

                {/* Submit Controls */}
                <div className="border-t border-white/10 pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewFormOpen(false)}
                    className="px-5 py-3 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSaving}
                    className="px-6 py-3 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-white/5"
                  >
                    {reviewSaving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      "Save Review"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
