'use client';

import { useMemo, useState } from 'react';
import { ToolLayout, EditorPanel, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommentSection } from '@/components/CommentSection';

export default function TextStatsPage() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const characters = text.length;
    const spaces = (text.match(/\s/g) || []).length;
    const charactersNoSpaces = characters - spaces;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    return {
      characters,
      charactersNoSpaces,
      spaces,
      lines,
      paragraphs,
      words,
    };
  }, [text]);

  const statItems = [
    { label: '总字符数', value: stats.characters, color: 'text-blue-500' },
    { label: '字符数(不含空格)', value: stats.charactersNoSpaces, color: 'text-green-500' },
    { label: '空格数', value: stats.spaces, color: 'text-purple-500' },
    { label: '行数', value: stats.lines, color: 'text-orange-500' },
    { label: '段落数', value: stats.paragraphs, color: 'text-pink-500' },
    { label: '单词数', value: stats.words, color: 'text-cyan-500' },
  ];

  return (
    <ToolLayout
      title="文本内容识别统计工具"
      description="实时统计文本的字符数、空格数、行数、段落数等"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 输入区域 */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">输入文本</CardTitle>
                <ActionButtons onClear={() => setText('')} value={text} />
              </div>
            </CardHeader>
            <CardContent>
              <EditorPanel
                value={text}
                onChange={setText}
                placeholder="在此输入或粘贴文本内容..."
              />
            </CardContent>
          </Card>
        </div>

        {/* 统计结果 */}
        <div className="space-y-4">
          {statItems.map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-2xl font-bold ${item.color}`}>
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 评论区 */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">工具说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>文本统计工具适合写作、排版、内容审核和开发场景下的快速字数计算，可以实时统计字符数、空格数、行数和段落数。</p>
            <p>相比手工复制到第三方编辑器，这个页面更适合你在当前工作流里快速判断文本长度和结构。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">常见问题</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p><strong>Q：</strong>字数和字符数为什么不一样？<br /><strong>A：</strong>字符数会把空格、换行等也统计进去，而字数更接近按词或内容单位计算。</p>
            <p><strong>Q：</strong>空行会算段落吗？<br /><strong>A：</strong>当前是按非空内容段落统计，纯空行不会单独算作段落。</p>
          </CardContent>
        </Card>
      </div>

      <CommentSection pageKey="text-stats" />
    </ToolLayout>
  );
}
