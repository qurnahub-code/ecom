import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApplicationForm } from "@/components/careers/ApplicationForm"
import { 
  MapPin, Clock, DollarSign, ArrowLeft, 
  Share2, Bookmark, CheckCircle2, Building2, Briefcase 
} from "lucide-react"
import Link from "next/link"

import { Metadata } from "next"

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const job = await prisma.job.findUnique({
    where: { id }
  })
  
  if (!job) {
    return {
      title: "Job Not Found"
    }
  }
  
  const title = `${job.title} | Careers at E-Com Platform`
  const description = job.description.slice(0, 160)
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website"
    },
    twitter: {
      card: "summary",
      title,
      description
    },
    alternates: {
      canonical: `/careers/${id}`
    }
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  // 1. Await Params
  const { id } = await params

  // 2. Fetch Real Data
  const rawJob = await prisma.job.findUnique({
    where: { id }
  })

  if (!rawJob) return notFound()

  // 3. SAFE PARSING: Convert DB String -> Array
  // This prevents the app from crashing if requirements are stored as text
  let requirements: string[] = []
  try {
    if (typeof rawJob.requirements === 'string') {
      requirements = JSON.parse(rawJob.requirements)
    } else if (Array.isArray(rawJob.requirements)) {
      requirements = rawJob.requirements
    }
  } catch (e) {
    requirements = ["Requirements not available."]
  }

  // 4. Dynamic Badge Colors
  const getDeptColor = (dept: string) => {
    switch(dept) {
      case 'Engineering': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
      case 'Marketing': return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/30'
      case 'Design': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30'
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30'
    }
  }

  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": rawJob.title,
    "description": rawJob.description,
    "datePosted": rawJob.createdAt.toISOString(),
    "validThrough": rawJob.deadline ? rawJob.deadline.toISOString() : undefined,
    "employmentType": rawJob.type === "Full-time" ? "FULL_TIME" : rawJob.type === "Part-time" ? "PART_TIME" : "CONTRACTOR",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "E-Com Platform",
      "sameAs": "https://voltsstore.vercel.app"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": rawJob.location,
        "addressCountry": "PK"
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
         <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-blue-200/40 dark:bg-blue-900/20 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- NAVIGATION --- */}
        <div className="flex justify-between items-center mb-8">
            <Link 
              href="/careers" 
              className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back to Careers
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: JOB INFO --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* HERO CARD */}
            <div className="relative overflow-hidden rounded-3xl p-8 border transition-all
              bg-white border-gray-100 shadow-sm
              dark:bg-white/5 dark:border-white/10 dark:shadow-none">
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDeptColor(rawJob.department)}`}>
                    {rawJob.department}
                  </span>
                  {rawJob.featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                      bg-amber-100 text-amber-700 border-amber-200
                      dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight text-gray-900 dark:text-white">
                  {rawJob.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 md:gap-8 text-sm font-medium">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-indigo-500" /> {rawJob.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-indigo-500" /> {rawJob.type}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <DollarSign className="w-4 h-4 text-indigo-500" /> {rawJob.salary}
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS CARD */}
            <div className="rounded-3xl p-8 border transition-all
              bg-white border-gray-100 shadow-sm
              dark:bg-white/5 dark:border-white/10 dark:shadow-none">
              
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <Briefcase className="w-5 h-5 text-indigo-500" /> About the Role
              </h2>
              <div className="prose prose-lg max-w-none leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">
                {rawJob.description}
              </div>

              <div className="h-px w-full bg-gray-100 dark:bg-white/10 my-8" />

              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Requirements
              </h2>
              
              <ul className="space-y-4">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- RIGHT: SIDEBAR (Where ApplicationForm Lives) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl p-6 border shadow-lg transition-colors
                bg-indigo-600 border-indigo-500 text-white
                dark:bg-indigo-900/50 dark:border-indigo-500/30">
                <h3 className="font-bold text-lg mb-2">Interested?</h3>
                <p className="text-indigo-100 text-sm">
                  Apply today. We review applications on a rolling basis.
                </p>
              </div>

              {/* CONTAINER FOR THE FORM */}
              <div className="rounded-3xl p-1 border shadow-2xl overflow-hidden
                bg-white border-gray-200 
                dark:bg-zinc-900 dark:border-white/10">
                 {/* ✅ THIS IS THE COMPONENT YOU JUST UPDATED */}
                 <ApplicationForm jobTitle={rawJob.title} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}