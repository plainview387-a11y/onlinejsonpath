'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Braces, Wrench, Search, X } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();

  const copy = {
    title: language === 'zh' ? 'ToolNest' : 'ToolNest',
    subtitle: language === 'zh' ? `${TOOLS.length} 个常用工具，覆盖开发中的高频处理场景` : `${TOOLS.length} practical tools for common development workflows`,
    searchPlaceholder: language === 'zh' ? '搜索工具...' : 'Search tools...',
    searchResult: language === 'zh' ? `找到 ${''} 个相关工具` : `${''} matching tools found`,
    featured: language === 'zh' ? '主推工具' : 'Featured',
    featuredTitle: language === 'zh' ? '在线 JSONPath 解析工具' : 'Online JSONPath Parser',
    featuredDesc: language === 'zh' ? '直接粘贴 JSON，输入 JSONPath 表达式，即可查看解析结果。适合接口调试、字段定位、测试联调和日常开发排查。'
      : 'Paste JSON and run JSONPath expressions instantly. Great for API debugging, field locating, test verification, and daily development troubleshooting.',
    quickAccess: language === 'zh' ? '快速入口' : 'Quick access',
    quickAccessDesc: language === 'zh' ? '如果你是第一次来，建议优先体验这些高频工具。' : 'If this is your first visit, start with these high-frequency tools.',
    curated: language === 'zh' ? '精选 3 个高频工具' : '3 curated high-frequency tools',
    toolbox: language === 'zh' ? '工具箱' : 'Toolbox',
    toolboxDesc: language === 'zh' ? '点击使用工具，下拉查看更多' : 'Open a tool and explore more below',
    searchDesc: language === 'zh' ? '搜索结果' : 'Search results',
    total: language === 'zh' ? `共 ${TOOLS.length} 个工具` : `${TOOLS.length} tools total`,
    empty: language === 'zh' ? '未找到相关工具' : 'No matching tools found',
    emptyHint: language === 'zh' ? '尝试其他关键词' : 'Try another keyword',
    footer: language === 'zh' ? '所有工具均支持一键复制、一键清空，操作简单高效' : 'All tools support quick copy and clear actions for fast, efficient use',
    tags: language === 'zh' ? ['默认示例', '语法参考', '结果复制', '在线解析'] : ['Example data', 'Syntax guide', 'Copy result', 'Online parser'],
  };

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS;
    const query = searchQuery.toLowerCase();
    return TOOLS.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((keyword) => keyword.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{copy.title}</h1>
            <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        <div className="w-full md:w-72 lg:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 pr-10"
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
            <p className="mt-1 text-xs text-muted-foreground">
              {language === 'zh' ? `找到 ${filteredTools.length} 个相关工具` : `${filteredTools.length} matching tools found`}
            </p>
          )}
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <Link href="/tools/jsonpath" className="block">
          <Card className="group cursor-pointer overflow-hidden border-primary/20 bg-gradient-to-br from-blue-50 via-background to-cyan-50 transition-all hover:shadow-lg">
            <CardContent className="p-5 md:p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Braces className="h-3.5 w-3.5" />
                    {copy.featured}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                    {copy.featuredTitle}
                  </h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{copy.featuredDesc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {copy.tags.map((tag) => (
                      <span key={tag} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm md:flex">
                  <Braces className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-dashed">
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{copy.quickAccess}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{copy.quickAccessDesc}</p>
              </div>
              <span className="text-xs text-muted-foreground">{copy.curated}</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {TOOLS.slice(0, 3).map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50">
                    <div className={`rounded-lg p-2 ${tool.bgColor}`}>
                      <Icon className={`h-4 w-4 ${tool.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{tool.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wrench className="h-5 w-5" />
                {copy.toolbox}
              </CardTitle>
              <CardDescription>{searchQuery ? copy.searchDesc : copy.toolboxDesc}</CardDescription>
            </div>
            {!searchQuery && <span className="text-sm text-muted-foreground">{copy.total}</span>}
          </div>
        </CardHeader>
        <CardContent className="max-h-[340px] overflow-y-auto">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="mx-auto mb-4 h-12 w-12 opacity-30" />
              <p>{copy.empty}</p>
              <p className="mt-2 text-sm">{copy.emptyHint}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href}>
                    <Card className={`group h-full cursor-pointer border transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-md ${tool.bgColor}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className={`rounded-lg bg-background p-2 ${tool.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium transition-colors group-hover:text-primary">{tool.title}</h3>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
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

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>{copy.footer}</p>
      </div>
    </div>
  );
}
