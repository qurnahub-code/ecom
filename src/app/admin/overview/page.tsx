import PageAnimation from "@/components/PageAnimation"
import { Activity, Server, ShieldCheck, Clock } from "lucide-react"

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300">
      <PageAnimation>
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">System Overview</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Operational status and recent system logs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
                <Activity className="w-5 h-5 text-green-500" /> System Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Database</span>
                  <span className="text-green-600 font-bold bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded">Operational</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">API Gateway</span>
                  <span className="text-green-600 font-bold bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded">Operational</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">File Storage</span>
                  <span className="text-green-600 font-bold bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded">Operational</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
               <h3 className="font-bold flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
                <ShieldCheck className="w-5 h-5 text-blue-500" /> Security
              </h3>
              <p className="text-sm text-zinc-500 mb-4">Last security scan completed 2 hours ago. No vulnerabilities found.</p>
              <div className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg text-zinc-600 dark:text-zinc-400">
                Scan ID: #SCAN-9928-X<br/>
                Status: PASSED<br/>
                IP: 192.168.1.1
              </div>
            </div>
          </div>

        </div>
      </PageAnimation>
    </div>
  )
}