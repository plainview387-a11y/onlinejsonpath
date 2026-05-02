import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线 Base64 加解密工具',
  description:
    '在线 Base64 编码解码工具，支持文本内容快速转换，适合接口联调、数据处理、调试排查和日常开发使用。',
  keywords: ['Base64 在线编码', 'Base64 在线解码', 'Base64 加解密工具'],
  alternates: {
    canonical: '/tools/base64',
  },
};

export default function Base64Layout({ children }: { children: React.ReactNode }) {
  return children;
}
