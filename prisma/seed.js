const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const projects = [
  {
    title: "Neon Horizon",
    category: "WebGL Experience",
    year: "2024",
    tag: "3D / Motion",
    shortDescription: "An immersive 3D automotive showcase with cinematic lighting, fluid transitions, and real-time reflections.",
    fullDescription: "An immersive 3D automotive showcase with cinematic lighting, fluid transitions, and real-time reflections. Developed using custom WebGL and three.js shader materials to optimize rendering performance across various mobile and desktop web browsers.",
    techStack: "WebGL, Three.js, React, Framer Motion, GLSL",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2564&auto=format&fit=crop"
    ]),
    accent: "139,92,246",
    accentHex: "#8b5cf6",
    gradFrom: "#7c3aed",
    gradTo: "#06b6d4",
    featured: true,
    published: true,
    displayOrder: 1,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "Aura FinTech",
    category: "Fintech Product",
    year: "2024",
    tag: "Dashboard / UX",
    shortDescription: "A premium dark-mode banking platform with elegant dashboards, motion systems, and frictionless UX.",
    fullDescription: "A premium dark-mode banking platform with elegant dashboards, motion systems, and frictionless UX. Designed with modular widgets, dynamic SVG charts, and interactive transaction flows to build trust and simplify data-dense visualization.",
    techStack: "React, Next.js, Chart.js, Tailwind CSS, Framer Motion",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
    ]),
    accent: "20,184,166",
    accentHex: "#14b8a6",
    gradFrom: "#0d9488",
    gradTo: "#818cf8",
    featured: true,
    published: true,
    displayOrder: 2,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "Lumina Studio",
    category: "Luxury Commerce",
    year: "2023",
    tag: "Commerce / Brand",
    shortDescription: "Headless commerce experience crafted for a premium lighting brand with immersive browsing journeys.",
    fullDescription: "Headless commerce experience crafted for a premium lighting brand with immersive browsing journeys. Built with micro-frontend architecture and edge delivery caching to ensure sub-100ms page transitions and flawless rendering of high-resolution design assets.",
    techStack: "Next.js, Shopify CLI, GraphQL, Tailwind CSS, Headless UI",
    image: "https://images.unsplash.com/photo-1507676184212-d0330a156f97?q=80&w=2670&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1507676184212-d0330a156f97?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565538810844-1e119d81a207?q=80&w=2574&auto=format&fit=crop"
    ]),
    accent: "251,146,60",
    accentHex: "#fb923c",
    gradFrom: "#f59e0b",
    gradTo: "#f472b6",
    featured: true,
    published: true,
    displayOrder: 3,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "Quantum UI",
    category: "Design System",
    year: "2023",
    tag: "Components / DX",
    shortDescription: "A scalable React component ecosystem focused on accessibility, consistency, and premium UI quality.",
    fullDescription: "A scalable React component ecosystem focused on accessibility, consistency, and premium UI quality. Developed in compliance with WAI-ARIA guidelines, incorporating keyboard navigation, screen reader compatibility, and atomic token styling.",
    techStack: "React, Radix UI, Stitches, TypeScript, Storybook",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
    ]),
    accent: "244,114,182",
    accentHex: "#f472b6",
    gradFrom: "#e879f9",
    gradTo: "#f43f5e",
    featured: true,
    published: true,
    displayOrder: 4,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  }
];

const reviews = [
  {
    name: "Sarah Jenkins",
    rating: 5,
    message: "Absolutely stunning work! The attention to detail and motion design is world-class. Highly recommend working with him.",
    approved: true,
    date: "Oct 2024",
  },
  {
    name: "David Chen",
    rating: 5,
    message: "Delivered our project ahead of schedule with code quality that exceeded our expectations. A true professional.",
    approved: true,
    date: "Sep 2024",
  },
];

async function main() {
  console.log("Seeding started...");
  await prisma.project.deleteMany();
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  
  await prisma.review.deleteMany();
  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
