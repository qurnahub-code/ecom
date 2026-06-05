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