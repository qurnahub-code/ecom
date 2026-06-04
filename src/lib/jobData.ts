export const JOBS = [
  { 
    id: "frontend-engineer", 
    title: "Senior Frontend Engineer", 
    dept: "Engineering", 
    type: "Full-time", 
    location: "Remote", 
    salary: "$90k - $120k",
    description: "We are looking for an expert in React and Next.js to lead our storefront team. You will be responsible for architecting the frontend of our high-traffic e-commerce platform.",
    requirements: [
      "5+ years experience with React and TypeScript",
      "Deep understanding of Next.js App Router",
      "Experience with Tailwind CSS",
      "Strong communication skills"
    ]
  },
  { 
    id: "product-designer", 
    title: "Product Designer", 
    dept: "Design", 
    type: "Full-time", 
    location: "New York, USA", 
    salary: "$85k - $110k",
    description: "Design beautiful, intuitive interfaces for our millions of users. You will work closely with product managers and engineers to deliver seamless UX.",
    requirements: [
      "Portfolio demonstrating UI/UX skills",
      "Proficiency in Figma",
      "Experience in e-commerce design",
      "User research experience"
    ]
  },
  { 
    id: "marketing-manager", 
    title: "Marketing Manager", 
    dept: "Marketing", 
    type: "Full-time", 
    location: "London, UK", 
    salary: "£60k - £80k",
    description: "Lead our global campaigns and brand strategy. We need someone who can tell compelling stories and drive user acquisition.",
    requirements: [
      "Experience in digital marketing",
      "SEO and Content Marketing knowledge",
      "Data-driven mindset",
      "Leadership experience"
    ]
  },
]

export function getJobById(id: string) {
  return JOBS.find(job => job.id === id)
}