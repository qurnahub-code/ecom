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

  // Split the requirements text by "New Line" to create an array
  const requirementsArray = rawRequirements
    .split("\n")
    .map(req => req.trim())
    .filter(req => req.length > 0)

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