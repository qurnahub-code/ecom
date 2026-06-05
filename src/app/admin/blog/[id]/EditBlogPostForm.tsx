"use client"

import { useState } from "react"
import { updateBlogPost, deleteBlogPost } from "@/app/actions/blog"
import PageAnimation from "@/components/PageAnimation"
import { ArrowLeft, Save, BookOpen, Layers, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditBlogPostForm({ post }: { post: any }) {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const router = useRouter()

  const handleAction = async (formData: FormData) => {
    setLoading(true)
    try {
      const res = await updateBlogPost(post.id, formData)
      if (res && !res.success) {
        alert(res.error || "Failed to update article")
      }
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this article "${post.title}"? This action is irreversible.`)
    if (!confirmDelete) return

    setDeleteLoading(true)
    try {
      const res = await deleteBlogPost(post.id)
      if (res && res.success) {
        alert("Article deleted successfully!")
        router.push("/admin/blog")
        router.refresh()
      } else {
        alert(res?.error || "Failed to delete article")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred while deleting the article.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const inputClass = "w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
  const labelClass = "block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
  const cardClass = "bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-8 relative overflow-hidden"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300">
      <PageAnimation>
        <div className="max-w-4xl mx-auto pb-12">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link 
                href="/admin/blog" 
                className="shrink-0 p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition shadow-sm z-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div className="flex flex-col ml-6">
                 <h1 className="text-3xl font-black text-zinc-900 dark:text-white transition-colors">
                   Edit Article
                 </h1>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                   Modify content for {post.title}
                 </p>
              </div>
            </div>

            {/* Delete button next to header */}
            <button
              type="button"
              disabled={deleteLoading || loading}
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white shadow-lg shadow-red-600/20 rounded-xl font-bold text-sm transition-all hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
              {deleteLoading ? "Deleting..." : "Delete Article"}
            </button>
          </div>

          {/* Form */}
          <form action={handleAction} className="space-y-8">
            
            {/* Core Settings */}
            <div className={cardClass}>
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <BookOpen className="w-32 h-32 text-zinc-900 dark:text-white" />
              </div>

              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" /> Meta Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="md:col-span-2">
                  <label className={labelClass}>Article Title</label>
                  <input name="title" required defaultValue={post.title} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Author Name</label>
                  <input name="author" defaultValue={post.author} required className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <div className="relative">
                    <select name="published" defaultValue={post.published ? "true" : "false"} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">▼</div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Cover Image URL</label>
                  <input name="coverImage" defaultValue={post.coverImage || ""} placeholder="https://images.unsplash.com/... (optional)" className={inputClass} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Excerpt / Teaser Text</label>
                  <input name="excerpt" required defaultValue={post.excerpt} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" /> Article Content
              </h2>

              <div>
                <label className={labelClass}>Main Content Body</label>
                <textarea 
                  name="content" 
                  required 
                  rows={12} 
                  defaultValue={post.content}
                  className={`${inputClass} resize-y min-h-[250px] font-sans`}
                ></textarea>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link 
                href="/admin/blog" 
                className="px-6 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold transition-colors shadow-sm"
              >
                Cancel
              </Link>

              {/* RGB Borderline Button */}
              <button 
                type="submit" 
                disabled={loading || deleteLoading}
                className="group relative inline-flex items-center justify-center p-[2px] rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-[spin_4s_linear_infinite]" />
                <span className="relative flex items-center gap-2 px-8 py-3 rounded-[10px] bg-zinc-900 text-white font-bold transition-all group-hover:bg-zinc-800">
                   {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Article Changes</>}
                </span>
              </button>
            </div>

          </form>
        </div>
      </PageAnimation>
    </div>
  )
}
