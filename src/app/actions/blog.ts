"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Helper: Slugify title
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '')             // Trim - from end
}

export async function createBlogPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  // Security Check: Only Admin can post
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const coverImage = formData.get("coverImage") as string || null
  const author = formData.get("author") as string || "E-Com Team"
  const published = formData.get("published") === "true"

  let slug = slugify(title)
  
  // Verify unique slug
  try {
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        author,
        published
      }
    })

    revalidatePath("/blog")
    revalidatePath("/admin/blog")
  } catch (error) {
    console.error("Create Blog Post Error:", error)
    return { success: false, error: "Database Error" }
  }

  redirect("/admin/blog")
}

export async function updateBlogPost(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  
  // Security Check: Only Admin can update
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const coverImage = formData.get("coverImage") as string || null
  const author = formData.get("author") as string || "E-Com Team"
  const published = formData.get("published") === "true"

  try {
    const originalPost = await prisma.blogPost.findUnique({ where: { id } })
    if (!originalPost) {
      return { success: false, error: "Blog post not found" }
    }

    let slug = originalPost.slug
    // If title has changed, update slug
    if (originalPost.title !== title) {
      slug = slugify(title)
      const existing = await prisma.blogPost.findUnique({ where: { slug } })
      if (existing && existing.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`
      }
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        author,
        published
      }
    })

    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)
    revalidatePath("/admin/blog")
  } catch (error) {
    console.error("Update Blog Post Error:", error)
    return { success: false, error: "Database Error" }
  }

  redirect("/admin/blog")
}

export async function deleteBlogPost(id: string) {
  const session = await getServerSession(authOptions)
  
  // Security Check: Only Admin can delete
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      return { success: false, error: "Blog post not found" }
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/admin/blog")
    return { success: true }
  } catch (error) {
    console.error("Delete Blog Post Error:", error)
    return { success: false, error: "Database Error" }
  }
}
