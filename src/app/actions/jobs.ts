"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createJob(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  // Security Check: Only Admin can post
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const rawRequirements = formData.get("requirements") as string
  const requirementsArray = rawRequirements
    .split("\n")
    .map(req => req.trim())
    .filter(req => req.length > 0)

  const deadlineStr = formData.get("deadline") as string
  const deadline = deadlineStr ? new Date(deadlineStr) : null

  try {
    await prisma.job.create({
      data: {
        title: formData.get("title") as string,
        department: formData.get("department") as string,
        type: formData.get("type") as string,
        location: formData.get("location") as string,
        salary: formData.get("salary") as string,
        description: formData.get("description") as string,
        requirements: JSON.stringify(requirementsArray),
        experienceLevel: formData.get("experienceLevel") as string || null,
        workplaceType: formData.get("workplaceType") as string || null,
        contactEmail: formData.get("contactEmail") as string || null,
        deadline: deadline,
        skills: formData.get("skills") as string || null,
        isActive: true
      }
    })

    revalidatePath("/careers") // Update public page
    revalidatePath("/admin/jobs") // Update admin list
  } catch (error) {
    console.error("Job Post Error:", error)
    return { success: false, error: "Database Error" }
  }

  redirect("/admin/jobs")
}

export async function updateJob(jobId: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  
  // Security Check: Only Admin can edit
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const rawRequirements = formData.get("requirements") as string
  const requirementsArray = rawRequirements
    .split("\n")
    .map(req => req.trim())
    .filter(req => req.length > 0)

  const deadlineStr = formData.get("deadline") as string
  const deadline = deadlineStr ? new Date(deadlineStr) : null
  const isActive = formData.get("isActive") === "true"
  const featured = formData.get("featured") === "true"

  try {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        title: formData.get("title") as string,
        department: formData.get("department") as string,
        type: formData.get("type") as string,
        location: formData.get("location") as string,
        salary: formData.get("salary") as string,
        description: formData.get("description") as string,
        requirements: JSON.stringify(requirementsArray),
        experienceLevel: formData.get("experienceLevel") as string || null,
        workplaceType: formData.get("workplaceType") as string || null,
        contactEmail: formData.get("contactEmail") as string || null,
        deadline: deadline,
        skills: formData.get("skills") as string || null,
        isActive: isActive,
        featured: featured
      }
    })

    revalidatePath("/careers") // Update public page
    revalidatePath("/admin/jobs") // Update admin list
  } catch (error) {
    console.error("Job Update Error:", error)
    return { success: false, error: "Database Error" }
  }

  redirect("/admin/jobs")
}

export async function deleteJob(jobId: string) {
  const session = await getServerSession(authOptions)
  
  // Security Check: Only Admin can delete
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.job.delete({
      where: { id: jobId }
    })

    revalidatePath("/careers") // Update public page
    revalidatePath("/admin/jobs") // Update admin list
    return { success: true }
  } catch (error) {
    console.error("Job Delete Error:", error)
    return { success: false, error: "Database Error" }
  }
}