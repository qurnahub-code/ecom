"use client"

import { useState } from "react"
import { MapPin, Clock } from "lucide-react"
import Link from "next/link"

// Define the shape of a Job based on your Prisma Model
interface Job {
  id: string
  title: string
  department: string
  type: string
  location: string
  description: string
  isActive: boolean
}

interface CareersListProps {
  initialJobs: Job[]
}

export function CareersList({ initialJobs }: CareersListProps) {
  const [filter, setFilter] = useState("All")

  // Filter logic
  const filteredJobs = filter === "All" 
    ? initialJobs 
    : initialJobs.filter(job => job.department === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        {["All", "Engineering", "Design", "Marketing", "Sales", "Support"].map((dept) => (
          <button
            key={dept}
            onClick={() => setFilter(dept)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              filter === dept 
                ? "bg-black text-white shadow-lg scale-105" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Job Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 py-12">
            No open positions found for {filter}.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              href={`/careers/${job.id}`} 
              className="border border-gray-100 p-6 rounded-2xl hover:shadow-lg transition bg-white group block h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{job.department}</p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-medium h-fit">
                  {job.type}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">
                {job.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</div>
                <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> Active Now</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}