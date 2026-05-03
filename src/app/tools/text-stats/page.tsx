'use client';

import { useMemo, useState } from 'react';
import { ToolLayout, EditorPanel, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommentSection } from '@/components/CommentSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TextStatsPage() {
  const { language } = useLanguage();
  const copy = {
    title: language === 'zh' ? '文本内容识别统计工具' : 'Text Statistics Tool',
    desc: language === 'zh' ? '实时统计文本的字符数、空格数、行数、段落数等' : 'Count characters, spaces, lines, paragraphs, and more in realtime.',
    input: language === 'zh' ? '输入文本' : 'Input Text',
    placeholder: language === 'zh' ? '在此输入或粘贴文本内容...' : 'Type or paste text here...',
    chars: language === 'zh' ? '总字符数' : 'Characters',
    charsNoSpace: language === 'zh' ? '字符数(不含空格)' : 'Characters (no spaces)',
    spaces: language === 'zh' ? '空格数' : 'Spaces',
    lines: language === 'zh' ? '行数' : 'Lines',
    paragraphs: language === 'zh' ? '段落数' : 'Paragraphs',
    words: language === 'zh' ? '单词数' : 'Words',
    toolDesc: language === 'zh' ? '工具说明' : 'About this tool',
    faq: language === 'zh' ? '常见问题' : 'FAQ',
    t1: language === 'zh' ? '文本统计工具适合写作、排版、内容审核和开发场景下的快速字数计算，可以实时统计字符数、空格数、行数和段落数。' : 'This tool is useful for writing, layout, content review, and development scenarios where quick text counts are needed, including characters, spaces, lines, and paragraphs.',
    t2: language === 'zh' ? '相比手工复制到第三方编辑器，这个页面更适合你在当前工作流里快速判断文本长度和结构。' : 'Compared with copying text into a third-party editor, this page fits better into your current workflow for checking text length and structure quickly.',
    q1: language === 'zh' ? '字数和字符数为什么不一样？' : 'Why are word count and character count different?',
    a1: language === 'zh' ? '字符数会把空格、换行等也统计进去，而字数更接近按词或内容单位计算。' : 'Character count includes spaces and line breaks, while word count is closer to counting content units or words.',
    q2: language === 'zh' ? '空行会算段落吗？' : 'Do empty lines count as paragraphs?',
    a2: language === 'zh' ? '当前是按非空内容段落统计，纯空行不会单独算作段落。' : 'Paragraphs are counted from non-empty content blocks, so empty lines do not count as separate paragraphs.',
  };

  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const characters = text.length;
    const spaces = (text.match(/\s/g) || []).length;
    const charactersNoSpaces = characters - spaces;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { characters, charactersNoSpaces, spaces, lines, paragraphs, words };
  }, [text]);

  const statItems = [
    { label: copy.chars, value: stats.characters, color: 'text-blue-500' },
    { label: copy.charsNoSpace, value: stats.charactersNoSpaces, color: 'text-green-500' },
    { label: copy.spaces, value: stats.spaces, color: 'text-purple-500' },
    { label: copy.lines, value: stats.lines, color: 'text-orange-500' },
    { label: copy.paragraphs, value: stats.paragraphs, color: 'text-pink-500' },
    { label: copy.words, value: stats.words, color: 'text-cyan-500' },
  ];

  return (
    <ToolLayout title={copy.title} description={copy.desc}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{copy.input}</CardTitle><ActionButtons onClear={() => setText('')} value={text} /></div></CardHeader><CardContent><EditorPanel value={text} onChange={setText} placeholder={copy.placeholder} /></CardContent></Card>
        </div>
        <div className="space-y-4">{statItems.map((item) => <Card key={item.label}><CardContent className="pt-6"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{item.label}</span><span className={`text-2xl font-bold ${item.color}`}>{item.value.toLocaleString()}</span></div></CardContent></Card>)}</div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-lg">{copy.toolDesc}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p>{copy.t1}</p><p>{copy.t2}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">{copy.faq}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p><strong>Q：</strong>{copy.q1}<br /><strong>A：</strong>{copy.a1}</p><p><strong>Q：</strong>{copy.q2}<br /><strong>A：</strong>{copy.a2}</p></CardContent></Card>
      </div>

      <CommentSection pageKey="text-stats" />
    </ToolLayout>
  );
}
