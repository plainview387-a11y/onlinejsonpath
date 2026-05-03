import {
  Braces,
  Lock,
  Clock,
  FileJson,
  FileText,
  Image,
  Globe,
  Code,
  type LucideIcon,
} from 'lucide-react';

export interface ToolItem {
  href: string;
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  keywords: string[];
  priority?: number;
}

export const TOOLS: ToolItem[] = [
  {
    href: '/tools/jsonpath',
    slug: 'jsonpath',
    title: 'JSONPath 解析',
    navLabel: 'JSONPath解析',
    description: 'JSON 路径解析工具，支持 JSON 编辑、格式校验、JSONPath 语法高亮',
    icon: Braces,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    keywords: ['json', 'jsonpath', '解析', '路径', '查询'],
    priority: 0.95,
  },
  {
    href: '/tools/base64',
    slug: 'base64',
    title: 'Base64 加解密',
    navLabel: 'Base64加解密',
    description: 'Base64 编码解码工具，支持文本和文件内容的双向转换',
    icon: Lock,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
    keywords: ['base64', '编码', '解码', '加密', '解密'],
    priority: 0.85,
  },
  {
    href: '/tools/timestamp',
    slug: 'timestamp',
    title: '时间戳转换',
    navLabel: '时间戳转换',
    description: 'Unix 时间戳与日期时间互转，支持秒级、毫秒级、UTC 与本地时间',
    icon: Clock,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    keywords: ['时间戳', 'timestamp', '日期', '时间', '转换'],
    priority: 0.85,
  },
  {
    href: '/tools/json-escape',
    slug: 'json-escape',
    title: 'JSON 转义',
    navLabel: 'JSON转义',
    description: 'JSON 转义与反转义工具，支持格式化和错误提示',
    icon: FileJson,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    keywords: ['json', '转义', '反转义', '格式化', 'escape'],
    priority: 0.85,
  },
  {
    href: '/tools/text-stats',
    slug: 'text-stats',
    title: '文本统计',
    navLabel: '文本统计',
    description: '实时统计文本字符数、空格数、行数、段落数',
    icon: FileText,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    keywords: ['文本', '统计', '字符数', '行数', '字数'],
    priority: 0.85,
  },
  {
    href: '/tools/image-base64',
    slug: 'image-base64',
    title: '图片 Base64',
    navLabel: '图片Base64',
    description: '图片与 Base64 互转，支持上传预览和下载',
    icon: Image,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950',
    keywords: ['图片', 'image', 'base64', '转换', '预览'],
    priority: 0.85,
  },
  {
    href: '/tools/ip-query',
    slug: 'ip-query',
    title: 'IP 查询',
    navLabel: 'IP查询',
    description: '查询当前 IP 地址信息，支持指定 IP 查询，显示地理位置',
    icon: Globe,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    keywords: ['ip', '地址', '查询', '位置', '地理'],
    priority: 0.85,
  },
  {
    href: '/tools/java-to-node',
    slug: 'java-to-node',
    title: 'Java 转 Node.js',
    navLabel: 'Java转Node.js',
    description: 'Java 代码转换为 Node.js 代码，支持在线执行与结果查看',
    icon: Code,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    keywords: ['java', 'nodejs', 'javascript', '转换', '代码'],
    priority: 0.85,
  },
];

export const TOOL_PAGE_NAMES = Object.fromEntries(TOOLS.map((tool) => [tool.slug, tool.title]));
