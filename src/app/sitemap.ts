import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';

const siteUrl = 'https://onlinejsonpath.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/projects/ai-project`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...TOOLS.map((tool) => ({
      url: `${siteUrl}${tool.href}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: tool.priority ?? 0.85,
    })),
  ];
}
