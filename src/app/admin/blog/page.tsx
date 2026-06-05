import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PageAnimation from "@/components/PageAnimation"
import { BookOpen, Calendar, Plus, MoreHorizontal, Users, Edit, Trash2 } from "lucide-react"
import DeleteBlogPostButton from "./DeleteBlogPostButton" // We'll make this client button

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300">
      <PageAnimation>
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Blog Manager</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage articles, news, and setup guides.</p>
            </div>
            
            {/* RGB Border "Write New Post" Button */}
            <Link 
              href="/admin/blog/new" 
              className="group relative inline-flex items-center justify-center p-[2px] rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-[spin_4s_linear_infinite]" />
              <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold transition-all group-hover:bg-gray-50 dark:group-hover:bg-zinc-800">
                <Plus className="w-4 h-4" /> Write New Post
              </span>
            </Link>
          </div>

          {/* Blog List Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
                  <BookOpen className="w-10 h-10 text-gray-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No articles created yet</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
                  Start sharing your insights and tutorials with your audience today.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-zinc-800/50 text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Article Title</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {posts.map((post) => (
                      <tr key={post.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                        
                        {/* Title */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-white text-base">{post.title}</span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">/blog/{post.slug}</span>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
                            <Users className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            <span>{post.author}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            post.published 
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                              : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${post.published ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                              href={`/admin/blog/${post.id}`} 
                              className="p-2 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 rounded-lg transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-sm"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <DeleteBlogPostButton postId={post.id} postTitle={post.title} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </PageAnimation>
    </div>
  )
}
