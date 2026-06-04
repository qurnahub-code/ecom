"use client"

import { useState } from "react"
import { updateJob, deleteJob } from "@/app/actions/jobs"
import PageAnimation from "@/components/PageAnimation"
import { 
  ArrowLeft, Save, Briefcase, MapPin, DollarSign, 
  Calendar, Mail, Layers, Star, X, Trash2 
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditJobForm({ job }: { job: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Parse initial requirements
  let initialRequirements = ""
  try {
    const parsed = typeof job.requirements === "string" ? JSON.parse(job.requirements) : job.requirements
    if (Array.isArray(parsed)) {
      initialRequirements = parsed.join("\n")
    }
  } catch (e) {
    initialRequirements = job.requirements || ""
  }

  // Parse initial skills / tags
  let initialSkills: string[] = []
  try {
    if (job.skills) {
      initialSkills = typeof job.skills === "string" ? JSON.parse(job.skills) : job.skills
    }
  } catch (e) {
    initialSkills = []
  }

  // State for interactive Tags (Skills)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(initialSkills)

  const handleAction = async (formData: FormData) => {
    setLoading(true)
    try {
      // Add standard checkbox behavior values to FormData if they are not checked
      if (!formData.has("isActive")) {
        formData.append("isActive", "false")
      }
      if (!formData.has("featured")) {
        formData.append("featured", "false")
      }
      const res = await updateJob(job.id, formData)
      if (res && !res.success) {
        alert(res.error || "Failed to update job")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the job posting "${job.title}"? This action is irreversible.`)
    if (!confirmDelete) return

    setDeleteLoading(true)
    try {
      const res = await deleteJob(job.id)
      if (res && !res.success) {
        alert(res.error || "Failed to delete job")
      } else {
        alert("Job posting deleted successfully!")
        router.push("/admin/jobs")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      alert("An error occurred while deleting the job.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Common Input Styles for consistency
  const inputClass = "w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
  const labelClass = "block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
  const cardClass = "bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-8 relative overflow-hidden"

  const defaultDeadline = job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ""

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300">
      <PageAnimation>
        <div className="max-w-5xl mx-auto pb-12">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {/* Back Button */}
              <Link 
                href="/admin/jobs" 
                className="shrink-0 p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition shadow-sm z-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              {/* Title Container */}
              <div className="flex flex-col ml-6">
                 <h1 className="text-3xl font-black text-zinc-900 dark:text-white transition-colors">
                   Edit Job Posting
                 </h1>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                   Modify details for {job.title}
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
              {deleteLoading ? "Deleting..." : "Delete Job"}
            </button>
          </div>

          {/* Form Container */}
          <form action={handleAction} className="space-y-8">
            
            {/* SECTION 1: STATUS & VISIBILITY */}
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Status & Visibility
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    id="isActive" 
                    value="true" 
                    defaultChecked={job.isActive}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer" 
                  />
                  <div>
                    <label htmlFor="isActive" className="text-sm font-bold text-zinc-900 dark:text-white cursor-pointer">
                      Active Posting
                    </label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Determines if candidates can view and apply for this job.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                  <input 
                    type="checkbox" 
                    name="featured" 
                    id="featured" 
                    value="true" 
                    defaultChecked={job.featured}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer" 
                  />
                  <div>
                    <label htmlFor="featured" className="text-sm font-bold text-zinc-900 dark:text-white cursor-pointer">
                      Featured Position
                    </label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Highlights this posting and pushes it to the top of listings.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CORE DETAILS */}
            <div className={cardClass}>
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Briefcase className="w-32 h-32 text-zinc-900 dark:text-white" />
              </div>
              
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Core Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Job Title</label>
                  <input name="title" required defaultValue={job.title} placeholder="e.g. Senior Product Designer" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Department</label>
                  <div className="relative">
                    <select name="department" defaultValue={job.department} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product & Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales & RevOps</option>
                      <option value="Customer Success">Customer Success</option>
                      <option value="Finance">Finance & HR</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">▼</div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Experience Level</label>
                  <div className="relative">
                    <select name="experienceLevel" defaultValue={job.experienceLevel || "Mid Level"} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="Internship">Internship</option>
                        <option value="Entry Level">Entry Level (0-2 yrs)</option>
                        <option value="Mid Level">Mid Level (2-5 yrs)</option>
                        <option value="Senior">Senior (5+ yrs)</option>
                        <option value="Lead">Lead / Manager</option>
                        <option value="Executive">Executive / C-Suite</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">▼</div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Employment Type</label>
                  <div className="relative">
                    <select name="type" defaultValue={job.type} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">▼</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: LOGISTICS */}
            <div className={cardClass}>
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" /> Logistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className={labelClass}>Workplace Type</label>
                   <div className="relative">
                        <select name="workplaceType" defaultValue={job.workplaceType || "On-site"} className={`${inputClass} appearance-none cursor-pointer`}>
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Remote">Remote</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">▼</div>
                   </div>
                </div>

                <div>
                  <label className={labelClass}>Location</label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                     <input name="location" required defaultValue={job.location} placeholder="e.g. New York, NY" className={`${inputClass} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Salary Range</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                     <input name="salary" required defaultValue={job.salary} placeholder="e.g. 80k - 100k" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                
                <div>
                   <label className={labelClass}>Application Deadline</label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                     <input type="date" name="deadline" defaultValue={defaultDeadline} className={`${inputClass} pl-10`} />
                   </div>
                </div>

                 <div className="md:col-span-2">
                   <label className={labelClass}>Internal Contact Email</label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                     <input type="email" name="contactEmail" defaultValue={job.contactEmail || ""} placeholder="hr@company.com" className={`${inputClass} pl-10`} />
                   </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: DESCRIPTION */}
            <div className={cardClass}>
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" /> Role Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Job Description</label>
                  <textarea name="description" required rows={6} defaultValue={job.description} placeholder="Describe the role..." className={`${inputClass} resize-y min-h-[150px]`}></textarea>
                </div>

                <div>
                  <label className={labelClass}>Requirements</label>
                  <div className="bg-gray-50 dark:bg-zinc-800/30 border border-gray-200 dark:border-zinc-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <textarea 
                      name="requirements" 
                      required 
                      rows={6} 
                      defaultValue={initialRequirements}
                      placeholder="• Requirement 1&#10;• Requirement 2" 
                      className="w-full bg-transparent border-none outline-none p-2 text-zinc-900 dark:text-white placeholder:text-zinc-400 resize-y min-h-[150px]"
                    ></textarea>
                  </div>
                </div>

                <div>
                   <label className={labelClass}>Required Skills (Tags)</label>
                   <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-white border border-gray-200 dark:border-zinc-600 rounded-full text-sm font-bold animate-in zoom-in-50 duration-200 shadow-sm">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                          </span>
                        ))}
                      </div>
                      <input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder={tags.length > 0 ? "" : "Type a skill (e.g. React) and press Enter..."}
                        className="w-full bg-transparent outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400"
                      />
                      <input type="hidden" name="skills" value={JSON.stringify(tags)} />
                   </div>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link 
                href="/admin/jobs" 
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
                   {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Job Changes</>}
                </span>
              </button>
            </div>
          </form>
        </div>
      </PageAnimation>
    </div>
  )
}
