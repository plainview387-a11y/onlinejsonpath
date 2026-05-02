import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线 JSONPath 解析工具',
  description:
    '免费在线 JSONPath 解析工具，支持 JSON 输入、JSONPath 表达式查询、结果复制与常用语法示例，适合接口调试、字段定位、联调测试和开发排查。',
  keywords: ['JSONPath 在线解析', 'JSONPath 工具', 'JSON 路径查询', 'JSONPath 表达式'],
  alternates: {
    canonical: '/tools/jsonpath',
  },
};

export default function JsonPathLayout({ children }: { children: React.ReactNode }) {
  return children;
}
