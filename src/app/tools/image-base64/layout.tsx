import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线图片 Base64 转换工具',
  description:
    '在线图片 Base64 转换工具，支持图片转 Base64、Base64 转图片、上传预览和下载，适合前端开发与接口调试。',
  keywords: ['图片 Base64', 'Base64 转图片', '图片转 Base64', '在线图片转换工具'],
  alternates: {
    canonical: '/tools/image-base64',
  },
};

export default function ImageBase64Layout({ children }: { children: React.ReactNode }) {
  return children;
}
