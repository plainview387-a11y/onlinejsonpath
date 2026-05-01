import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: {
    default: '在线工具集 | OnlineJsonPath',
    template: '%s | OnlineJsonPath',
  },
  description: '在线工具集 - JSONPath解析、Base64加解密、时间戳转换、JSON转义、文本统计、图片Base64互转',
  keywords: [
    '在线工具',
    'JSONPath解析',
    'Base64加解密',
    '时间戳转换',
    'JSON转义',
    '文本统计',
    '图片Base64',
  ],
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
        <AuthProvider>
          {isDev && <Inspector />}
          <Navigation />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
