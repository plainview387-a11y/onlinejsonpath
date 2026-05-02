import { MetadataRoute } from 'next';

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
    ...[
      'jsonpath',
      'base64',
      'timestamp',
      'json-escape',
      'text-stats',
      'image-base64',
      'ip-query',
      'java-to-node',
    ].map((slug) => ({
      url: `${siteUrl}/tools/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: slug === 'jsonpath' ? 0.95 : 0.85,
    })),
  ];
}
