import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PageAnimation from "@/components/PageAnimation" // ✅ Animation Wrapper
import { Briefcase, MapPin, Plus, MoreHorizontal, Calendar, Users, Building2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300">
      <PageAnimation>
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Job Postings</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage open positions and track applicants.</p>
            </div>
            
            {/* RGB Border "Post New Job" Button */}
            <Link 
              href="/admin/jobs/new" 
              className="group relative inline-flex items-center justify-center p-[2px] rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-[spin_4s_linear_infinite]" />
              <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold transition-all group-hover:bg-gray-50 dark:group-hover:bg-zinc-800">
                <Plus className="w-4 h-4" /> Post New Job
              </span>
            </Link>
          </div>

          {/* Jobs List Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
                  <Briefcase className="w-10 h-10 text-gray-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No jobs posted yet</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
                  Create your first job posting to start attracting talent to your team.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-zinc-800/50 text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Role Details</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Posted Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {jobs.map((job) => (
                      <tr key={job.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                        
                        {/* Role */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-white text-base">{job.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                                 <Users className="w-3.5 h-3.5" /> {job.department}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
                            <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            <span>{job.location}</span>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                            {job.type}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-mono">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            job.isActive 
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.isActive ? "bg-emerald-500" : "bg-zinc-400"}`}></span>
                            {job.isActive ? "Active" : "Closed"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                              href={`/admin/jobs/${job.id}`} 
                              className="p-2 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 rounded-lg transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-sm"
                              title="Edit Job"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Link>
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