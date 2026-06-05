"use client"

import { Trash2 } from "lucide-react"
import { deleteBlogPost } from "@/app/actions/blog"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteBlogPostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the article "${postTitle}"? This action is irreversible.`)
    if (!confirmDelete) return

    setLoading(true)
    try {
      const res = await deleteBlogPost(postId)
      if (res && res.success) {
        alert("Article deleted successfully!")
        router.refresh()
      } else {
        alert(res?.error || "Failed to delete article")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred while deleting the article.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 rounded-lg transition-colors text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
      title="Delete Article"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
