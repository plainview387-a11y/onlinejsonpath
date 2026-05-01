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
      <CommentSection pageKey="text-stats" />
    </ToolLayout>
  );
}
