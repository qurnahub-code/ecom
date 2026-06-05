import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import PageAnimation from "@/components/PageAnimation"
import { Calendar, User, ArrowLeft, BookOpen, Share2 } from "lucide-react"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  })

  if (!post) {
    return {
      title: "Article Not Found"
    }
  }

  const title = `${post.title} | E-Com Platform Blog`
  const description = post.excerpt.slice(0, 160)
  const imageUrl = post.coverImage || "https://voltsstore.vercel.app/icon.png"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    alternates: {
      canonical: `/blog/${slug}`
    }
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  })

  if (!post) notFound()

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage || "https://voltsstore.vercel.app/icon.png",
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "E-Com Platform",
      "logo": {
        "@type": "ImageObject",
        "url": "https://voltsstore.vercel.app/icon.png"
      }
    },
    "description": post.excerpt,
    "articleBody": post.content
  }

  return (
    <main className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 overflow-hidden font-sans py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/30 dark:bg-indigo-900/10 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6">
        
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Articles
          </Link>
        </div>

        {/* Article Container */}
        <PageAnimation>
          <article className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-12">
            
            {/* Header Content */}
            <header className="mb-8 space-y-6">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium py-4 border-y border-gray-100 dark:border-white/5">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" />{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4 text-indigo-500" />{post.author}</span>
              </div>
            </header>

            {/* Teaser Cover Image */}
            {post.coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-8 bg-gray-100 dark:bg-zinc-800">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            {/* Markdown/Article Teaser content */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 whitespace-pre-line text-lg font-normal">
              {post.content}
            </div>

          </article>
        </PageAnimation>

      </div>
    </main>
  )
}
