import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://voltsstore.vercel.app'

  // 1. Fetch all products
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      select: { id: true, updatedAt: true }
    })
  } catch (e) {
    console.error("Sitemap Products Fetch Error:", e)
  }

  // 2. Fetch all active job listings
  let jobs: any[] = []
  try {
    jobs = await prisma.job.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true }
    })
  } catch (e) {
    console.error("Sitemap Jobs Fetch Error:", e)
  }

  // 2.5. Fetch all published blog posts
  let posts: any[] = []
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    })
  } catch (e) {
    console.error("Sitemap Blog Posts Fetch Error:", e)
  }

  // 3. Define Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/careers',
    '/products',
    '/blog',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 4. Map Dynamic Product URLs
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // 5. Map Dynamic Careers URLs
  const jobRoutes = jobs.map((job) => ({
    url: `${baseUrl}/careers/${job.id}`,
    lastModified: new Date(job.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 6. Map Dynamic Blog URLs
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...jobRoutes, ...blogRoutes]
}
