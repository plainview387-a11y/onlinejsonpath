import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  metadataBase: new URL('https://onlinejsonpath.vercel.app'),
  title: {
    default: '在线工具集 - JSONPath解析、Base64加解密、时间戳转换等开发工具',
    template: '%s | OnlineJsonPath',
  },
  description:
    '在线工具集提供 JSONPath 解析、Base64 加解密、时间戳转换、JSON 转义、文本统计、图片 Base64、IP 查询、Java 转 Node.js 等开发常用在线工具。',
  keywords: [
    '在线工具',
    'JSONPath解析',
    'JSONPath在线解析',
    'Base64加解密',
    '时间戳转换',
    'JSON转义',
    '文本统计',
    '图片Base64',
    'IP查询',
    'Java转Node.js',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '在线工具集 - JSONPath解析、Base64加解密、时间戳转换等开发工具',
    description:
      '提供 JSONPath 解析、Base64 加解密、时间戳转换、JSON 转义、文本统计、图片 Base64、IP 查询、Java 转 Node.js 等在线工具。',
    url: 'https://onlinejsonpath.vercel.app',
    siteName: 'OnlineJsonPath',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <LanguageProvider>
          <AuthProvider>
            {isDev && <Inspector />}
            <Navigation />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
