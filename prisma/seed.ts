import { PrismaClient, Role, PaymentMethod, OrderStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. CLEANUP: Remove old data to prevent errors on re-runs
  // (Deleting in specific order to handle foreign keys)
  await prisma.review.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.coupon.deleteMany()

  console.log('🧹 Database cleaned.')

  // 2. CREATE ADMIN USER
  // We hash the password so it works with your login logic later
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@store.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: Role.ADMIN, // Uses the strictly typed Enum
    },
  })

  console.log(`👤 Admin created: ${admin.email} (Password: admin123)`)

  // 3. CREATE PRODUCTS
  // Notice how we create multiple images using the relation
  const product1 = await prisma.product.create({
    data: {
      name: 'Wireless Gaming Mouse',
      description: 'High precision optical sensor with RGB lighting.',
      price: 4500.00,
      stock: 50,
      category: 'Electronics',
      vendor: 'Logitech Distributor',
      origin: 'Imported',
      images: {
        create: [
          { url: 'https://placehold.co/600x400/png?text=Mouse+Front', altText: 'Mouse Front View' },
          { url: 'https://placehold.co/600x400/png?text=Mouse+Side', altText: 'Mouse Side View' },
        ],
      },
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: 'Mechanical Keyboard',
      description: 'Blue switches, tactile feedback, compact layout.',
      price: 8500.00,
      stock: 20,
      category: 'Electronics',
      vendor: 'Local Tech Hub',
      barcode: 'KB-mech-2024',
      images: {
        create: [
          { url: 'https://placehold.co/600x400/png?text=Keyboard+Top', altText: 'Keyboard Top View' },
        ],
      },
    },
  })

  console.log(`📦 Added products: ${product1.name}, ${product2.name}`)

  // 4. CREATE A COUPON
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discount: 10, // 10% off
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires in 1 year
    },
  })

  console.log('🎟️ Coupon created: WELCOME10')

  // 5. CREATE A SAMPLE ORDER (JazzCash)
  // This helps you test the dashboard UI immediately
  await prisma.order.create({
    data: {
      guestName: 'Ali Khan',
      guestEmail: 'ali@test.com',
      address: 'House 12, Street 4, DHA',
      city: 'Lahore',
      postalCode: '54000',
      phone: '03001234567',
      totalAmount: 4500.00,
      status: OrderStatus.PROCESSING,
      paymentMethod: PaymentMethod.JAZZCASH,
      isPaid: true,
      transactionId: 'TXN-99887766',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: 4500.00,
          },
        ],
      },
    },
  })

  console.log('🛒 Sample JazzCash order created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })