'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Braces, 
  Lock, 
  Clock, 
  FileJson, 
  FileText, 
  Image,
  Globe,
  Wrench,
  Search,
  X,
  Code
} from 'lucide-react';

const tools = [
  {
    href: '/tools/jsonpath',
    title: 'JSONPath 解析',
    description: 'JSON路径解析工具，支持JSON编辑、格式校验、JSONPath语法高亮',
    icon: Braces,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    keywords: ['json', 'jsonpath', '解析', '路径', '查询'],
  },
  {
    href: '/tools/base64',
    title: 'Base64 加解密',
    description: 'Base64编码解码工具，支持文本和文件的双向转换',
    icon: Lock,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
    keywords: ['base64', '编码', '解码', '加密', '解密'],
  },
  {
    href: '/tools/timestamp',
    title: '时间戳转换',
    description: 'Unix时间戳与日期时间互转，支持秒级和毫秒级',
    icon: Clock,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    keywords: ['时间戳', 'timestamp', '日期', '时间', '转换'],
  },
  {
    href: '/tools/json-escape',
    title: 'JSON 转义',
    description: 'JSON转义与反转义工具，支持格式化和错误提示',
    icon: FileJson,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    keywords: ['json', '转义', '反转义', '格式化', 'escape'],
  },
  {
    href: '/tools/text-stats',
    title: '文本统计',
    description: '实时统计文本字符数、空格数、行数、段落数',
    icon: FileText,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    keywords: ['文本', '统计', '字符数', '行数', '字数'],
  },
  {
    href: '/tools/image-base64',
    title: '图片 Base64',
    description: '图片与Base64互转，支持上传预览和下载',
    icon: Image,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950',
    keywords: ['图片', 'image', 'base64', '转换', '预览'],
  },
  {
    href: '/tools/ip-query',
    title: 'IP 查询',
    description: '查询当前IP地址信息，支持指定IP查询，显示地理位置',
    icon: Globe,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    keywords: ['ip', '地址', '查询', '位置', '地理'],
  },
  {
    href: '/tools/java-to-node',
    title: 'Java 转 Node.js',
    description: 'Java代码转换为Node.js代码，支持在线执行',
    icon: Code,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    keywords: ['java', 'nodejs', 'javascript', '转换', '代码'],
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // 实时搜索过滤
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }
    
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 顶部标题栏 + 搜索框 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">在线工具集</h1>
            <p className="text-sm text-muted-foreground">8大实用工具，助力您的开发工作</p>
          </div>
        </div>
        
        {/* 搜索框 */}
        <div className="w-full md:w-72 lg:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-1">
              找到 {filteredTools.length} 个相关工具
            </p>
          )}
        </div>
      </div>

      {/* 主推工具 */}
      <div className="grid grid-cols-1 items-start gap-4 mb-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Link href="/tools/jsonpath" className="self-start">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-blue-50 via-background to-cyan-50 hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-5 md:p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                    <Braces className="h-3.5 w-3.5" />
                    主推工具
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    在线 JSONPath 解析工具
                  </h2>
                  <p className="text-muted-foreground mt-3 leading-7">
                    直接粘贴 JSON，输入 JSONPath 表达式，即可查看解析结果。适合接口调试、字段定位、测试联调和日常开发排查。
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {['默认示例', '语法参考', '结果复制', '在线解析'].map((tag) => (
                      <span key={tag} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Braces className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="self-start border-dashed">
          <CardContent className="p-5 md:p-6">
            <h3 className="font-semibold text-lg">快速入口</h3>
            <p className="mt-2 text-sm text-muted-foreground">如果你是第一次来，建议优先体验这些高频工具。</p>
            <div className="mt-4 space-y-3">
              {tools.slice(0, 3).map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href} className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition-colors">
                    <div className={`p-2 rounded-lg ${tool.bgColor}`}>
                      <Icon className={`h-4 w-4 ${tool.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tool.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具列表卡片 */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                工具箱
              </CardTitle>
              <CardDescription>
                {searchQuery ? '搜索结果' : '点击使用工具，下拉查看更多'}
              </CardDescription>
            </div>
            {!searchQuery && (
              <span className="text-sm text-muted-foreground">
                共 {tools.length} 个工具
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="max-h-[340px] overflow-y-auto">
          {filteredTools.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>未找到相关工具</p>
              <p className="text-sm mt-2">尝试其他关键词</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href}>
                    <Card className={`h-full hover:shadow-md transition-all cursor-pointer group border hover:border-primary/50 hover:bg-muted/50 ${tool.bgColor}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className={`p-2 rounded-lg bg-background ${tool.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground mt-4">
        <p>所有工具均支持一键复制、一键清空，操作简单高效</p>
      </div>
    </div>
  );
}
