import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditJobForm from "./EditJobForm"

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params
  
  const job = await prisma.job.findUnique({
    where: { id }
  })
  
  if (!job) {
    notFound()
  }
  
  return <EditJobForm job={job} />
}
