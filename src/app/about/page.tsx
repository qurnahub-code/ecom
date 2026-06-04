import { Users, Truck, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-primary text-primary-foreground py-24 px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Crafting Quality for You</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
            We started with a simple mission: to make premium lifestyle products accessible to everyone in Pakistan.
          </p>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-background rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-background rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Happy Customers", value: "10k+", icon: Users },
            { label: "Products Sold", value: "50k+", icon: Truck },
            { label: "Years Active", value: "3", icon: Award },
            { label: "Cities Covered", value: "120+", icon: Globe },
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <div className="flex justify-center mb-3 text-primary">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2024, our journey began in a small garage with a passion for technology and design.
              What started as a side project has grown into one of the most trusted e-commerce platforms in the region.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that shopping should be simple, reliable, and enjoyable. That's why we meticulously curate 
              our inventory and obsess over customer experience.
            </p>
          </div>
          {/* Placeholder for Image */}
          <div className="bg-muted h-64 rounded-2xl w-full border border-border"></div> 
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <div className="md:order-2">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Promise</h2>
            <ul className="space-y-3">
              {["100% Authentic Products", "24/7 Customer Support", "Secure Payment Gateways", "Fast Shipping Nationwide"].map((item, i) => (
                <li key={i} className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Placeholder for Image */}
          <div className="md:order-1 bg-muted h-64 rounded-2xl w-full border border-border"></div> 
        </section>
      </div>
    </div>
  )
}