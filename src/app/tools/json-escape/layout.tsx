import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线 JSON 转义工具',
  description:
    '在线 JSON 转义与反转义工具，支持 JSON 字符串处理、格式化和错误提示，适合接口调试、日志排查和数据清洗。',
  keywords: ['JSON 转义', 'JSON 反转义', 'JSON 格式化', '在线 JSON 工具'],
  alternates: {
    canonical: '/tools/json-escape',
  },
};

export default function JsonEscapeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
