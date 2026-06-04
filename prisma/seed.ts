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
      totalAmount: 4500.00,
      status: 'PROCESSING',       // ✅ String Literal
      paymentMethod: 'JAZZCASH',  // ✅ String Literal
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