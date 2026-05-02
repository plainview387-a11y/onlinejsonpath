import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线 Java 转 Node.js 工具',
  description:
    '在线 Java 转 Node.js 工具，支持将常见 Java 代码结构转换为 Node.js/JavaScript 代码，适合学习迁移、代码改写与原型验证。',
  keywords: ['Java 转 Node.js', 'Java 转 JavaScript', '代码转换工具', 'Node.js 在线工具'],
  alternates: {
    canonical: '/tools/java-to-node',
  },
};

export default function JavaToNodeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
