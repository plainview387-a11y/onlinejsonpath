import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线时间戳转换工具',
  description:
    '在线时间戳转换工具，支持 Unix 时间戳与日期时间互转，支持秒级和毫秒级，适合开发调试、日志排查和数据处理。',
  keywords: ['时间戳转换', 'Unix 时间戳', '在线时间转换工具'],
  alternates: {
    canonical: '/tools/timestamp',
  },
};

export default function TimestampLayout({ children }: { children: React.ReactNode }) {
  return children;
}
