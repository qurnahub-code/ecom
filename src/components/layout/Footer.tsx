import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 pt-16 pb-8 transition-colors duration-300 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-brand-purple rounded-md flex items-center justify-center text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                <span className="text-sm font-black leading-none">⚡</span>
              </div>
              <h3 className="font-heading font-black text-lg tracking-wider uppercase text-gray-900 dark:text-white">
                Volts Store
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Premium workspace and tech essentials designed to power your productivity. Curating mechanical keyboards, monitors, audio gear, and studio accessories.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>DHA Phase 5, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-indigo-500" />
                <span>+92 (326) 450-0909</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-indigo-500" />
                <Link href="mailto:support@voltsstore.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  support@voltsstore.com
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</Link></li>
              <li><Link href="/stores" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Store Locations</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Shop Categories */}
           <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-6">Shop</h3>
             <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/search?category=Audio" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Audio</Link></li>
              <li><Link href="/search?category=Keyboards" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Keyboards</Link></li>
              <li><Link href="/search?category=Mice" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Mice</Link></li>
              <li><Link href="/search?category=Monitors" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Monitors</Link></li>
              <li><Link href="/search?category=Accessories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 4: Services & Social */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-6">Services</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-8">
              {/* ✅ FIXED: Points to /tracking now */}
              <li><Link href="/tracking" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Order Tracking</Link></li>
              <li><Link href="/wishlist" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Wishlist</Link></li>
              <li><Link href="/returns" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Returns</Link></li>
            </ul>

            <h4 className="text-gray-900 dark:text-white text-sm font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://facebook.com/voltsstore" },
                { icon: Twitter, href: "https://twitter.com/voltsstore" },
                { icon: Instagram, href: "https://instagram.com/voltsstore" },
                { icon: Linkedin, href: "https://linkedin.com/company/voltsstore" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 dark:bg-white/5 p-2.5 rounded-full text-gray-500 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-indigo-500/20 hover:shadow-lg"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Volts Store. All rights reserved.</p>
          
          <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}