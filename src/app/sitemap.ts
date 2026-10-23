import type { MetadataRoute } from 'next';
import { query } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tuhocai.top';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bai-viet`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    // Dynamic products
    const products = await query<any>(
      'SELECT slug, updated_at FROM products WHERE is_active = 1'
    );
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/san-pham/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Dynamic posts
    const posts = await query<any>(
      'SELECT slug, updated_at FROM posts WHERE is_published = 1'
    );
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/bai-viet/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes, ...postRoutes];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticRoutes;
  }
}
