import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. CLEANUP
  await prisma.review.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.coupon.deleteMany()
  // await prisma.job.deleteMany() // Uncomment if you have the Job table

  console.log('🧹 Database cleaned.')

  // 2. CREATE ADMIN USER
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@store.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN', // ✅ Using String Literal avoids TS errors
    },
  })

  console.log(`👤 Admin created: ${admin.email}`)

  // 3. CREATE PRODUCTS
  
  // Mice
  const p1 = await prisma.product.create({
    data: {
      name: 'Volts Precision Ergonomic Mouse',
      description: 'Ergonomic wireless mouse designed to reduce wrist strain, featuring a high-precision sensor and silent click switches.',
      price: 5500.00,
      stock: 45,
      category: 'Mice',
      vendor: 'Volts Workspace',
      origin: 'Local',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop', altText: 'Precision Mouse' },
        ],
      },
    },
  })

  const p2 = await prisma.product.create({
    data: {
      name: 'Volts Swift Gaming Mouse',
      description: 'Ultralight 58g gaming mouse with optical switches, flexible paracord cable, and an ultra-precise 26K DPI sensor.',
      price: 9500.00,
      stock: 30,
      category: 'Mice',
      vendor: 'Logitech Distributor',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1625842268584-8f3290446976?q=80&w=600&auto=format&fit=crop', altText: 'Swift Mouse' },
        ],
      },
    },
  })

  // Keyboards
  const p3 = await prisma.product.create({
    data: {
      name: 'Volts Mechanical Keyboard K87',
      description: 'Tenkeyless layout with hot-swappable custom tactile switches, sound-dampening foam, and solid aluminum chassis.',
      price: 12500.00,
      stock: 25,
      category: 'Keyboards',
      vendor: 'Volts Workspace',
      origin: 'Local',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop', altText: 'K87 Keyboard' },
        ],
      },
    },
  })

  const p4 = await prisma.product.create({
    data: {
      name: 'Volts Lite Tactile Keyboard',
      description: 'Compact 60% layout with brown tactile switches, double-shot PBT keycaps, and warm amber backlighting.',
      price: 8500.00,
      stock: 40,
      category: 'Keyboards',
      vendor: 'Volts Workspace',
      origin: 'Local',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop', altText: 'Lite Keyboard' },
        ],
      },
    },
  })

  const p5 = await prisma.product.create({
    data: {
      name: 'Volts Custom RGB Pro Keyboard',
      description: 'Full-sized keyboard featuring ultra-smooth linear switches, dynamic per-key RGB backlighting, and a multi-function rotary knob.',
      price: 16500.00,
      stock: 15,
      category: 'Keyboards',
      vendor: 'CustomKey Labs',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop', altText: 'RGB Pro Keyboard' },
        ],
      },
    },
  })

  // Audio
  const p6 = await prisma.product.create({
    data: {
      name: 'VoltSonic ANC Wireless Headphones',
      description: 'High-fidelity active noise-cancelling headphones with 40-hour battery life and plush memory foam earcups for ultimate comfort.',
      price: 18500.00,
      stock: 35,
      category: 'Audio',
      vendor: 'VoltSonic Global',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', altText: 'ANC Headphones' },
        ],
      },
    },
  })

  const p7 = await prisma.product.create({
    data: {
      name: 'VoltAudio Studio Condenser Mic',
      description: 'Professional cardioid USB microphone with built-in pop filter and desktop stand, perfect for streaming, podcasting, and voiceovers.',
      price: 14000.00,
      stock: 20,
      category: 'Audio',
      vendor: 'VoltSonic Global',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop', altText: 'Condenser Microphone' },
        ],
      },
    },
  })

  const p8 = await prisma.product.create({
    data: {
      name: 'VoltBuds Pro Hi-Fi IEMs',
      description: 'Dual-driver in-ear monitors with detachable braided cables and custom sound tuning tips for audio professionals.',
      price: 6500.00,
      stock: 50,
      category: 'Audio',
      vendor: 'SoundWave Labs',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop', altText: 'Hi-Fi IEMs' },
        ],
      },
    },
  })

  // Monitors
  const p9 = await prisma.product.create({
    data: {
      name: 'Volts View 27" QHD Monitor',
      description: '27-inch IPS panel with Quad HD resolution, 144Hz refresh rate, and 99% sRGB color gamut coverage for stunning accuracy.',
      price: 45000.00,
      stock: 15,
      category: 'Monitors',
      vendor: 'VisualTech Distributors',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop', altText: '27" QHD Monitor' },
        ],
      },
    },
  })

  const p10 = await prisma.product.create({
    data: {
      name: 'Volts View 34" Ultrawide',
      description: '34-inch curved ultra-wide productivity monitor featuring HDR400, USB-C Power Delivery, and dual-source picture-by-picture mode.',
      price: 75000.00,
      stock: 10,
      category: 'Monitors',
      vendor: 'VisualTech Distributors',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop', altText: '34" Curved Monitor' },
        ],
      },
    },
  })

  // Accessories
  const p11 = await prisma.product.create({
    data: {
      name: 'Volts Premium Felt Desk Mat',
      description: 'Extra-large premium desk organizer mat crafted from 100% natural wool felt with a non-slip backing.',
      price: 2500.00,
      stock: 60,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1632292224971-0d45778b3617?q=80&w=600&auto=format&fit=crop', altText: 'Premium Felt Desk Mat' },
        ],
      },
    },
  })

  const p12 = await prisma.product.create({
    data: {
      name: 'Volts LED Monitor Screenbar',
      description: 'Monitor-mounted reading light with auto-dimming, asymmetrical optical design to eliminate screen glare, and color temperature control.',
      price: 4800.00,
      stock: 30,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600&auto=format&fit=crop', altText: 'LED Screenbar' },
        ],
      },
    },
  })

  console.log(`📦 Seeded 12 premium tech products successfully.`)

  const additionalProducts = [
    {
      name: 'Volts Aerolite Wireless Mouse',
      description: 'Ultralight honeycomb gaming mouse weighing only 53g. Features a flawless 3395 optical sensor, 80 million click Kailh switches, and lag-free 2.4GHz wireless connectivity.',
      price: 11500.00,
      stock: 35,
      category: 'Mice',
      vendor: 'Volts Workspace',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Precision Travel Mouse',
      description: 'Compact and silent Bluetooth mouse designed for productivity on the go. Dual-device pairing, 12-month battery life, and comfortable rubber side grips.',
      price: 3800.00,
      stock: 55,
      category: 'Mice',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Pro Trackball Mouse',
      description: 'Ergonomic trackball mouse with adjustable hinge to customize angle. Reduces muscle strain, features precision tracking mode, and rechargeable battery.',
      price: 14500.00,
      stock: 15,
      category: 'Mice',
      vendor: 'ErgoDesign Co.',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Swift Mini Gaming Mouse',
      description: 'Compact ultralight gaming mouse tailored for claw and fingertip grip styles. 20K DPI optical sensor and tactile clicks for rapid-fire inputs.',
      price: 7500.00,
      stock: 40,
      category: 'Mice',
      vendor: 'Logitech Distributor',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3290446976?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Duo Silent Mouse',
      description: 'Silent wireless mouse with both USB receiver and Bluetooth options. Perfect for shared offices and quiet study spaces.',
      price: 4500.00,
      stock: 60,
      category: 'Mice',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Air Slim Mechanical Keyboard',
      description: 'Ultra-thin wireless mechanical keyboard with low-profile tactile switches, white backlight, and premium sandblasted aluminum plate.',
      price: 14800.00,
      stock: 20,
      category: 'Keyboards',
      vendor: 'CustomKey Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Retro Typewriter Keyboard',
      description: 'Retro-inspired mechanical keyboard with round typewriter-style keycaps, clicky blue switches, and dynamic white LED animations.',
      price: 11000.00,
      stock: 18,
      category: 'Keyboards',
      vendor: 'RetroTech',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Split Ergonomic K88',
      description: 'Ergonomic split mechanical keyboard designed to prevent typing fatigue. Features custom linear switches, tenting feet, and comfortable wrist rests.',
      price: 22500.00,
      stock: 12,
      category: 'Keyboards',
      vendor: 'ErgoDesign Co.',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Streamer Elite Keyboard',
      description: 'Custom mechanical keyboard with a built-in customizable macro pad. Features hot-swappable sockets and programmable rotary dials for quick shortcuts.',
      price: 19500.00,
      stock: 15,
      category: 'Keyboards',
      vendor: 'CustomKey Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Silent Office K100',
      description: 'Chiclet-style keyboard with whisper-quiet keys, scissor-switch action, and integrated number pad. Perfect for professional office environments.',
      price: 5200.00,
      stock: 50,
      category: 'Keyboards',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts K68 Compact Wireless',
      description: 'Compact 65% mechanical keyboard featuring dual-mode wireless, pre-lubed stabilizers, and durable double-shot PBT keycaps.',
      price: 9800.00,
      stock: 30,
      category: 'Keyboards',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'VoltSonic Studio Monitor Headphones',
      description: 'Professional-grade closed-back headphones for mixing and monitoring. Accurate flat response, 50mm dynamic drivers, and robust build.',
      price: 24500.00,
      stock: 25,
      category: 'Audio',
      vendor: 'VoltSonic Global',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'VoltSonic Pocket Buds',
      description: 'Ultra-compact wireless earbuds with custom charging case. Features rich signature sound, IPX5 water resistance, and smart touch controls.',
      price: 5800.00,
      stock: 70,
      category: 'Audio',
      vendor: 'VoltSonic Global',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'VoltSonic Gaming Headset H7',
      description: 'High-fidelity gaming headset featuring virtual 7.1 surround sound, noise-canceling detachable microphone, and breathable ear cups.',
      price: 11500.00,
      stock: 45,
      category: 'Audio',
      vendor: 'SoundWave Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'VoltAudio Soundbar Solo',
      description: 'Compact 40W Bluetooth soundbar for clean desk setups. Delivering deep bass and crystal clear dialogue for movies and gaming.',
      price: 16800.00,
      stock: 20,
      category: 'Audio',
      vendor: 'VoltSonic Global',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'VoltAudio Podcaster Kit',
      description: 'Complete recording kit featuring a studio USB microphone, adjustable boom arm, metal shock mount, and high-performance pop filter.',
      price: 28500.00,
      stock: 10,
      category: 'Audio',
      vendor: 'SoundWave Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'VoltBuds Classic USB-C',
      description: 'Premium wired USB-C earphones featuring an in-line DAC chip, deep bass profile, and microphone with volume buttons.',
      price: 2900.00,
      stock: 100,
      category: 'Audio',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'VoltSonic Air ANC Headband',
      description: 'Premium active noise-cancelling headphones featuring hybrid ANC, premium leather cushions, and 45-hour battery life.',
      price: 34500.00,
      stock: 15,
      category: 'Audio',
      vendor: 'VoltSonic Global',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts View 24" FHD Monitor',
      description: '24-inch 1080p IPS gaming monitor with 165Hz refresh rate, 1ms response time, and AMD FreeSync Premium support.',
      price: 28500.00,
      stock: 25,
      category: 'Monitors',
      vendor: 'VisualTech Distributors',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts View 27" 4K Creator',
      description: '27-inch Ultra HD monitor with 100% sRGB color accuracy, factory-calibrated Delta E < 2, and sleek borderless design.',
      price: 68000.00,
      stock: 12,
      category: 'Monitors',
      vendor: 'VisualTech Distributors',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1551645121-d1034da75057?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts View 49" Super Ultrawide',
      description: 'Massive 49-inch curved gaming and productivity monitor with 32:9 aspect ratio, 240Hz refresh rate, and Dual QHD resolution.',
      price: 185000.00,
      stock: 5,
      category: 'Monitors',
      vendor: 'VisualTech Distributors',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts View Portable 15.6"',
      description: 'Ultra-thin 15.6-inch portable monitor featuring a bright Full HD IPS panel, dual USB-C inputs, and a protective smart cover stand.',
      price: 26500.00,
      stock: 20,
      category: 'Monitors',
      vendor: 'VisualTech Distributors',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Premium Leather Desk Mat',
      description: 'Crafted from sustainable full-grain leather, this desk mat protects your desk while providing an elegant writing surface.',
      price: 5500.00,
      stock: 40,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1632292224971-0d45778b3617?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Dual-Device Wireless Charger',
      description: 'Sleek aluminum charging stand that simultaneously powers your smartphone and wireless earbuds at optimal speeds.',
      price: 4200.00,
      stock: 50,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Aluminium Laptop Stand',
      description: 'Premium brushed aluminum stand that raises your laptop screen to eye level. Promotes better posture and enhances laptop cooling.',
      price: 3900.00,
      stock: 60,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts RGB Desk Ambient Light Strips',
      description: 'Smart Wi-Fi enabled LED light strips that sync with your system audio or screen content for an immersive workspace.',
      price: 2800.00,
      stock: 80,
      category: 'Accessories',
      vendor: 'LightFlow Co.',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Under-Desk Cable Management Tray',
      description: 'Heavy-duty steel wire tray that mounts under your desk to organize power bricks, extension leads, and messy cables.',
      price: 2400.00,
      stock: 45,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1632292224971-0d45778b3617?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Premium Wooden Desk Shelf',
      description: 'Dual-monitor wooden riser crafted from solid walnut wood. Features integrated accessory slots and anodized aluminum legs.',
      price: 9500.00,
      stock: 20,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts USB-C 8-in-1 Multiport Hub',
      description: 'Compact hub offering 4K HDMI, Gigabit Ethernet, SD card slots, and dual USB-A ports, with 100W Power Delivery passthrough.',
      price: 6500.00,
      stock: 55,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Headphone Stand Pro',
      description: 'Aluminium headphone stand with a solid wooden base. Built-in USB-A and USB-C hub ports to charge devices directly.',
      price: 5200.00,
      stock: 35,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Mechanical Switch Tester',
      description: 'A 12-key switch testing block featuring various linear, tactile, and clicky switches. Perfect tool for choosing keyboard switches.',
      price: 1800.00,
      stock: 100,
      category: 'Accessories',
      vendor: 'CustomKey Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Artisan Keycap Set',
      description: 'Hand-crafted resin keycap set featuring custom details. Specially designed for MX mechanical keyboard switches.',
      price: 4800.00,
      stock: 40,
      category: 'Accessories',
      vendor: 'CustomKey Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Premium Coiled Aviator Cable',
      description: 'Custom coiled cable featuring high-quality paracord, double-sleeved techflex, and a durable GX16 aviator connector.',
      price: 3500.00,
      stock: 50,
      category: 'Accessories',
      vendor: 'CustomKey Labs',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Rechargeable Electric Duster',
      description: 'Cordless high-velocity air blower to safely dust computers, keyboards, and delicate electronic devices without residue.',
      price: 4500.00,
      stock: 30,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Anti-Glare Screen Protector (27")',
      description: 'Matte screen film designed for 27-inch widescreen monitors. Shields against blue light glare and oily fingerprints.',
      price: 1500.00,
      stock: 120,
      category: 'Accessories',
      vendor: 'VisualTech Distributors',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Precision Screwdriver Set',
      description: 'Precision magnetic toolkit with 48 steel bits. Designed specifically for repairing phones, laptops, and keyboards.',
      price: 2900.00,
      stock: 80,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Tech Organizer Pouch',
      description: 'Travel pouch with specialized elastic loops and mesh pockets to secure power bricks, cables, SSDs, and adapters.',
      price: 3200.00,
      stock: 70,
      category: 'Accessories',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1632292224971-0d45778b3617?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Smart Clamp Desk Lamp',
      description: 'Space-saving desk lamp that clamps to the side of the table. Offers adjustable color temperatures and smart app control.',
      price: 6800.00,
      stock: 30,
      category: 'Smart Lighting & Power',
      vendor: 'LightFlow Co.',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Ambient Smart Light Bars (Pair)',
      description: 'Dual vertical light bars with millions of dynamic RGB color combinations. Works with Amazon Alexa and Google Assistant.',
      price: 8500.00,
      stock: 25,
      category: 'Smart Lighting & Power',
      vendor: 'LightFlow Co.',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Power Strip Pro (65W PD)',
      description: 'Premium surge protector with 4 standard AC outlets and dedicated USB-C ports supplying up to 65W direct fast charging.',
      price: 5800.00,
      stock: 40,
      category: 'Smart Lighting & Power',
      vendor: 'VoltCharge Co.',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts GaN 100W Travel Charger',
      description: 'Compact 4-port wall adapter using GaN technology. Provides 100W split power charging for laptops, tablets, and phones.',
      price: 7900.00,
      stock: 50,
      category: 'Smart Lighting & Power',
      vendor: 'VoltCharge Co.',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Magnetic Cable Clips (5-Pack)',
      description: 'Premium silicone organizers with magnetic closures. Keeps desktop cables neat and stops them slipping behind tables.',
      price: 1200.00,
      stock: 150,
      category: 'Smart Lighting & Power',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1632292224971-0d45778b3617?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts USB Rechargeable Quiet Desk Fan',
      description: 'Quiet desktop cooling fan with aerodynamic blades and a multi-angle tilt head. USB-C rechargeable with 8-hour battery.',
      price: 2500.00,
      stock: 65,
      category: 'Smart Lighting & Power',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Speed M.2 NVMe SSD Enclosure',
      description: 'Solid aluminum enclosure supporting tool-free installation of M.2 NVMe SSDs. Transfers data at speeds up to 10 Gbps.',
      price: 4800.00,
      stock: 45,
      category: 'Storage',
      vendor: 'VoltStorage Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Portable Rugged SSD (1TB)',
      description: 'Pocket-sized portable SSD with 1050 MB/s transfer speeds. Shock-resistant up to 2 meters and dust/water protected.',
      price: 18500.00,
      stock: 30,
      category: 'Storage',
      vendor: 'VoltStorage Labs',
      origin: 'Imported',
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Secure Dual-Drive (128GB)',
      description: 'High-speed metal flash drive with dual connectors (USB-C and USB-A) for quick transfers between phones and computers.',
      price: 3500.00,
      stock: 90,
      category: 'Storage',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Ergonomic Mesh Chair C100',
      description: 'Fully adjustable mesh office chair with adaptive lumbar support, 3D armrests, and dynamic tilt-lock tension control.',
      price: 38000.00,
      stock: 10,
      category: 'Furniture',
      vendor: 'ErgoDesign Co.',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Active Standing Desk D120',
      description: 'Motorized standing desk with dual motors and memory controller. Transitions smoothly from sitting to standing heights.',
      price: 65000.00,
      stock: 8,
      category: 'Furniture',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Ergonomic Under-Desk Footrest',
      description: 'Premium teardrop-shaped foam footrest providing maximum comfort and support under your office desk.',
      price: 3200.00,
      stock: 40,
      category: 'Furniture',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Volts Premium CPU Stand Roller',
      description: 'Mobile desktop tower stand with lockable caster wheels, width adjustable to fit various CPU sizes and elevate off floors.',
      price: 2800.00,
      stock: 50,
      category: 'Furniture',
      vendor: 'Volts Workspace',
      origin: 'Local',
      imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=600&auto=format&fit=crop'
    }
  ]

  for (const productData of additionalProducts) {
    await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        vendor: productData.vendor,
        origin: productData.origin,
        images: {
          create: [
            { url: productData.imageUrl, altText: productData.name },
          ],
        },
      },
    })
  }

  console.log(`📦 Seeded 50 additional tech products successfully.`)

  // 4. CREATE A COUPON
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discount: 10,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  })

  console.log('🎟️ Coupon created')

  // 5. CREATE A SAMPLE ORDER
  await prisma.order.create({
    data: {
      guestName: 'Ali Khan',
      guestEmail: 'ali@test.com',
      address: 'House 12, Street 4, DHA',
      city: 'Lahore',
      postalCode: '54000',
      phone: '03001234567',
      totalAmount: 12500.00,
      status: 'PROCESSING',       // ✅ String Literal
      paymentMethod: 'JAZZCASH',  // ✅ String Literal
      isPaid: true,
      transactionId: 'TXN-99887766',
      items: {
        create: [
          {
            productId: p3.id,
            quantity: 1,
            price: 12500.00,
          },
        ],
      },
    },
  })

  console.log('🛒 Sample order created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })