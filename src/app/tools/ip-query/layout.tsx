import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线 IP 查询工具',
  description:
    '在线 IP 查询工具，支持查询当前 IP 和指定 IP 的地理位置、运营商与归属地信息，适合网络排查和安全分析。',
  keywords: ['IP 查询', 'IP 地址查询', 'IP 归属地', '在线 IP 工具'],
  alternates: {
    canonical: '/tools/ip-query',
  },
};

export default function IPQueryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
