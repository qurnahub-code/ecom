import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditBlogPostForm from "./EditBlogPostForm"

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminEditBlogPostPage({ params }: Props) {
  const { id } = await params
  
  const post = await prisma.blogPost.findUnique({
    where: { id }
  })
  
  if (!post) {
    notFound()
  }
  
  return <EditBlogPostForm post={post} />
}
