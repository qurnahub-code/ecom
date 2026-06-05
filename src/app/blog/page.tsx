import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PageAnimation from "@/components/PageAnimation"
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tech & Gear Blog | Volts Store Insights",
  description: "Explore tech reviews, custom mechanical keyboard build guides, performance setup logs, and modern gaming gadget articles compiled by our expert engineering team.",
  alternates: {
    canonical: "/blog"
  }
}

export default async function BlogListingPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <main className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full blur-[120px] bg-indigo-300/20 dark:bg-indigo-900/10 mix-blend-screen" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-purple-300/20 dark:bg-purple-900/10 mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Header */}
        <section className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider bg-white border-gray-200 text-indigo-600 dark:bg-white/5 dark:border-white/10 dark:text-indigo-400">
            <BookOpen className="w-3.5 h-3.5" />
            Insights & Guides
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
            THE TECH <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-cyan-400">
              LOG
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Mechanical keyboards, gaming configurations, and the science of setup optimization.
          </p>
        </section>

        {/* Blog Grid */}
        <PageAnimation>
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No articles published yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Check back later for tutorials and announcements!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Tease Cover Image */}
                  <div className="aspect-[16/10] bg-gray-100 dark:bg-zinc-800 relative overflow-hidden shrink-0">
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-zinc-600">
                        <BookOpen className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    {/* Metadata indicators */}
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{post.author}</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 group/link hover:opacity-85"
                      >
                        Read Full Story 
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </PageAnimation>

      </div>
    </main>
  )
}
