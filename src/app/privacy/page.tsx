import Link from "next/link"
import { Shield, Lock, Eye, Cookie, Server } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
         <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-purple-200/40 dark:bg-purple-900/20 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Policy</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Last updated: <span className="font-semibold text-gray-700 dark:text-gray-300">December 2025</span>
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl">
          
          <div className="space-y-12 text-gray-600 dark:text-gray-300 leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
              </div>
              <p className="mb-6">
                We collect information you provide directly to us. For example, we collect information when you create an account, 
                subscribe, participate in any interactive features of our services, fill out a form, request customer support, 
                or otherwise communicate with us.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Personal Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name, Email, Phone Number, Shipping Address, Billing Information.</p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Usage Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">IP Address, Browser Type, Device Info, Pages Visited, Time Spent.</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-white/10" />

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
                  <Server className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. How We Use Information</h2>
              </div>
              <p>
                We use the information we collect to provide, maintain, and improve our services, such as to process transactions, 
                identify you as a user, send you administrative notifications, and respond to your comments and questions.
              </p>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm marker:text-indigo-500">
                <li>To process your payments and deliver your orders.</li>
                <li>To send you updates, security alerts, and support messages.</li>
                <li>To detect, investigate, and prevent fraudulent transactions.</li>
              </ul>
            </section>

            <hr className="border-gray-100 dark:border-white/10" />

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600 dark:text-orange-400">
                  <Cookie className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Cookies & Tracking</h2>
              </div>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, 
                you may not be able to use some portions of our Service.
              </p>
            </section>

            <hr className="border-gray-100 dark:border-white/10" />

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Data Protection</h2>
              </div>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet, 
                or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
                your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gray-50 dark:bg-white/5 rounded-full mb-4">
               <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By using our website, you hereby consent to our Privacy Policy and agree to its Terms. <br className="hidden md:block"/>
              If you need more information, feel free to <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">contact us</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}