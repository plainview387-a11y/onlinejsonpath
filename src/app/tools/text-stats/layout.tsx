import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线文本统计工具',
  description:
    '在线文本统计工具，支持统计字符数、字数、空格数、行数和段落数，适合写作、排版、内容审核与数据处理。',
  keywords: ['文本统计工具', '字数统计', '字符统计', '行数统计'],
  alternates: {
    canonical: '/tools/text-stats',
  },
};

export default function TextStatsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
