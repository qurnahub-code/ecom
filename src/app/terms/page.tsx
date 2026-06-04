import Link from "next/link"
import { Scale, FileText, ShieldAlert, AlertCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
         <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-purple-200/40 dark:bg-purple-900/20 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        
        {/* --- HEADER --- */}
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
             <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Effective Date: <span className="font-semibold text-gray-900 dark:text-white">December 16, 2025</span>
          </p>
        </div>

        {/* --- CONTENT CARD --- */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl">
          
          <div className="space-y-12 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-gray-100 dark:bg-zinc-800 text-sm px-3 py-1 rounded-full font-mono">01</span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing and using our website ("Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. In addition, when using these particular services, you 
                shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <div className="h-px bg-gray-200 dark:bg-white/5 w-full" />

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-gray-100 dark:bg-zinc-800 text-sm px-3 py-1 rounded-full font-mono">02</span>
                Use of Service
              </h2>
              <p className="mb-6">
                You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. 
                You agree not to use the Service in any way that could damage the Site, the Services, or the general business of the company.
              </p>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10 p-6 rounded-2xl">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" /> Prohibited Activities:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Must be at least 18 years of age", "No harassment, abuse, or threats", "No intellectual property violations", "No uploading viruses or malicious code"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {item}
                        </li>
                    ))}
                </ul>
              </div>
            </section>

            <div className="h-px bg-gray-200 dark:bg-white/5 w-full" />

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-gray-100 dark:bg-zinc-800 text-sm px-3 py-1 rounded-full font-mono">03</span>
                Accounts & Security
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. 
                You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>

            <div className="h-px bg-gray-200 dark:bg-white/5 w-full" />

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-gray-100 dark:bg-zinc-800 text-sm px-3 py-1 rounded-full font-mono">04</span>
                Termination
              </h2>
              <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, 
                including without limitation if you breach the Terms.
              </p>
            </section>

            {/* Contact Box */}
            <section className="bg-zinc-900 dark:bg-white text-white dark:text-black p-8 rounded-2xl text-center shadow-lg transform translate-y-4">
              <div className="flex justify-center mb-4">
                  <AlertCircle className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="text-xl font-bold mb-2">Questions about these terms?</h3>
              <p className="opacity-80 mb-6 max-w-md mx-auto text-sm">
                  Our legal team is available to assist you with any clarifications regarding these documents.
              </p>
              <Link 
                href="/contact" 
                className="inline-block px-8 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Contact Legal Support
              </Link>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}