import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">E-Com Platform</h3>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Your one-stop destination for premium tech, fashion, and lifestyle products. Quality guaranteed.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>123 Commerce St, Tech City, USA</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@ecomplatform.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition">Careers</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition">Store Locations</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search?q=Electronics" className="hover:text-indigo-400 transition">Electronics</Link></li>
              <li><Link href="/search?q=Clothing" className="hover:text-indigo-400 transition">Clothing & Fashion</Link></li>
              <li><Link href="/search?q=Home" className="hover:text-indigo-400 transition">Home & Garden</Link></li>
              <li><Link href="/search?q=Sports" className="hover:text-indigo-400 transition">Sports & Outdoors</Link></li>
              <li><Link href="/search?q=Books" className="hover:text-indigo-400 transition">Books & Media</Link></li>
            </ul>
          </div>

          {/* Column 4: Services & Social */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li><Link href="#" className="hover:text-indigo-400 transition">Order Tracking</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition">Wishlist</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition">FAQs</Link></li>
            </ul>

            <h4 className="text-white text-sm font-bold mb-3">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-sky-500 hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-700 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Modern Ecommerce Platform. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-gray-400 cursor-pointer">Secure Payment</span>
            <span className="hover:text-gray-400 cursor-pointer">SSL Encrypted</span>
            <span className="hover:text-gray-400 cursor-pointer">24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  )
}