"use client"

import { Download } from "lucide-react"

interface ExportCSVButtonProps {
  data: any[]
  filename?: string
  className?: string
  label?: string
}

export function ExportCSVButton({ 
  data, 
  filename = "report.csv", 
  className = "", 
  label = "Export CSV" 
}: ExportCSVButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.")
      return
    }

    // Extract headers
    const headers = Object.keys(data[0])
    
    // Create CSV rows
    const csvRows = []
    
    // Add headers row
    csvRows.push(headers.join(","))
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        let val = row[header]
        if (val === null || val === undefined) {
          val = ""
        }
        // Escape quotes, double quotes, and commas
        let escaped = ('' + val).replace(/"/g, '""')
        if (escaped.includes(",") || escaped.includes("\n") || escaped.includes('"')) {
          escaped = `"${escaped}"`
        }
        return escaped
      })
      csvRows.push(values.join(","))
    }
    
    // Join all rows with newline
    const csvContent = "\uFEFF" + csvRows.join("\n") // UTF-8 BOM for Excel compatibility
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      type="button"
      onClick={exportToCSV}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm outline-none cursor-pointer ${className}`}
    >
      <Download className="w-4 h-4" /> {label}
    </button>
  )
}
