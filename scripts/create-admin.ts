import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const password = 'admin123' // The password you will use to login
  
  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 2. Upsert (Create if new, Update if exists)
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword, // Update password just in case
    },
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Admin User Ready: ${user.email}`)
  console.log(`🔑 Password: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })