'use client';

import { useState } from 'react';
import { ToolLayout, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { JsonEditor, JsonViewer } from '@/components/JsonEditor';
import { CommentSection } from '@/components/CommentSection';
import { useLanguage } from '@/contexts/LanguageContext';

const defaultJson = {
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  address: { city: '北京', street: '朝阳路' },
};

const defaultEscaped = '{"name":"张三","age":25,"email":"zhangsan@example.com","address":{"city":"北京","street":"朝阳路"}}';

function TextEditor({ value, onChange, placeholder, readOnly = false }: { value: string; onChange?: (value: string) => void; placeholder?: string; readOnly?: boolean }) {
  return (
    <div className="relative h-full min-h-[300px] overflow-hidden rounded-lg border border-border bg-background">
      {!value && <div className="pointer-events-none absolute inset-0 flex items-start justify-start p-4"><span className="font-mono text-sm text-muted-foreground/50">{placeholder}</span></div>}
      <textarea value={value} onChange={(e) => onChange?.(e.target.value)} readOnly={readOnly} placeholder="" className="h-full min-h-[300px] w-full resize-none bg-transparent p-4 font-mono text-sm focus:outline-none" />
    </div>
  );
}

export default function JsonEscapePage() {
  const { language } = useLanguage();
  const copy = {
    title: language === 'zh' ? 'JSON 转义 / 反转义工具' : 'JSON Escape / Unescape Tool',
    desc: language === 'zh' ? 'JSON 转义与反转义，支持格式化和错误提示' : 'Escape and unescape JSON with formatting and error hints.',
    tabEscape: language === 'zh' ? 'JSON转义' : 'Escape JSON',
    tabUnescape: language === 'zh' ? '转义文本转JSON' : 'Escaped Text to JSON',
    jsonInput: language === 'zh' ? 'JSON 输入' : 'JSON Input',
    escapeResult: language === 'zh' ? '转义结果' : 'Escaped Result',
    escapedInput: language === 'zh' ? '转义文本输入' : 'Escaped Text Input',
    jsonResult: language === 'zh' ? 'JSON 结果' : 'JSON Result',
    format: language === 'zh' ? '格式化' : 'Format',
    executeEscape: language === 'zh' ? '执行转义' : 'Escape',
    executeUnescape: language === 'zh' ? '执行反转义' : 'Unescape',
    jsonPlaceholder: language === 'zh' ? '输入JSON文本...' : 'Enter JSON text...',
    escapedPlaceholder: language === 'zh' ? '输入转义后的文本...' : 'Enter escaped text...',
    resultPlaceholder: language === 'zh' ? '转义后的文本...' : 'Escaped text...',
    jsonError: language === 'zh' ? 'JSON格式错误：' : 'Invalid JSON: ',
    textError: language === 'zh' ? '转义文本格式错误：' : 'Invalid escaped text: ',
    toolDesc: language === 'zh' ? '工具说明' : 'About this tool',
    faq: language === 'zh' ? '常见问题' : 'FAQ',
    t1: language === 'zh' ? 'JSON 转义工具适合处理接口字符串、日志内容和需要嵌入 JSON 的文本片段，支持转义与反转义双向操作。' : 'This tool is useful for API strings, log content, and text fragments where JSON needs to be embedded, with support for both escaping and unescaping.',
    t2: language === 'zh' ? '如果你在拼接请求体、排查转义字符异常或处理存量数据，这个工具会比手工替换更稳定也更直观。' : 'If you are building request bodies, debugging escaping issues, or processing existing data, this tool is more stable and intuitive than manual replacement.',
    q1: language === 'zh' ? '什么时候需要 JSON 转义？' : 'When do I need JSON escaping?',
    a1: language === 'zh' ? '当 JSON 要被嵌入字符串、脚本或其他 JSON 字段中时，通常需要先转义。' : 'When JSON needs to be embedded into a string, script, or another JSON field, escaping is usually required first.',
    q2: language === 'zh' ? '为什么反转义后还是报错？' : 'Why does unescaping still fail?',
    a2: language === 'zh' ? '可能原始内容本身就不是合法 JSON，建议结合格式化结果一起检查。' : 'The original content may not be valid JSON. It is best to inspect it together with the formatted result.',
  };

  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [input, setInput] = useState(JSON.stringify(defaultJson, null, 2));
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleModeChange = (nextMode: 'escape' | 'unescape') => {
    setMode(nextMode);
    setInput(nextMode === 'escape' ? JSON.stringify(defaultJson, null, 2) : defaultEscaped);
    setOutput('');
    setError('');
    setInputError(false);
  };

  const formatJson = (str: string): string => {
    try {
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return str;
    }
  };

  const escapeJson = () => {
    setError('');
    setInputError(false);
    if (!input) return setOutput('');
    try {
      JSON.parse(input);
      const escaped = JSON.stringify(JSON.stringify(JSON.parse(input)));
      setOutput(escaped.slice(1, -1));
    } catch (err) {
      setError(copy.jsonError + (err as Error).message);
      setInputError(true);
      setOutput('');
    }
  };

  const unescapeJson = () => {
    setError('');
    if (!input) return setOutput('');
    try {
      const unescaped = JSON.parse(`"${input}"`);
      const parsed = JSON.parse(unescaped);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError(copy.textError + (err as Error).message);
      setOutput('');
    }
  };

  const handleFormat = () => {
    if (mode === 'escape') {
      const formatted = formatJson(input);
      setInput(formatted);
      setInputError(false);
    } else {
      setOutput(formatJson(output));
    }
  };

  const handleClear = () => {
    setInput(mode === 'escape' ? JSON.stringify(defaultJson, null, 2) : defaultEscaped);
    setOutput('');
    setError('');
    setInputError(false);
  };

  return (
    <ToolLayout title={copy.title} description={copy.desc}>
      <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'escape' | 'unescape')}>
        <TabsList className="grid w-full grid-cols-2 rounded-2xl"><TabsTrigger value="escape">{copy.tabEscape}</TabsTrigger><TabsTrigger value="unescape">{copy.tabUnescape}</TabsTrigger></TabsList>
        <TabsContent value="escape" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="shadow-sm"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{copy.jsonInput}</CardTitle><div className="flex gap-2"><Button variant="outline" size="sm" onClick={handleFormat}>{copy.format}</Button><ActionButtons onClear={handleClear} value={input} /></div></div></CardHeader><CardContent><JsonEditor value={input} onChange={setInput} placeholder={copy.jsonPlaceholder} error={inputError} /></CardContent></Card>
            <Card className="shadow-sm"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{copy.escapeResult}</CardTitle><ActionButtons onCopy={() => {}} value={output} /></div></CardHeader><CardContent>{error ? <div className="flex h-[300px] w-full items-center justify-center rounded-lg border bg-red-50 p-4 text-center text-red-600">{error}</div> : <TextEditor value={output} placeholder={copy.resultPlaceholder} readOnly />}</CardContent></Card>
          </div>
          <div className="flex justify-center"><Button onClick={escapeJson} size="lg" className="rounded-full px-8">{copy.executeEscape}</Button></div>
        </TabsContent>
        <TabsContent value="unescape" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="shadow-sm"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{copy.escapedInput}</CardTitle><ActionButtons onClear={handleClear} value={input} /></div></CardHeader><CardContent><TextEditor value={input} onChange={setInput} placeholder={copy.escapedPlaceholder} /></CardContent></Card>
            <Card className="shadow-sm"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{copy.jsonResult}</CardTitle><div className="flex gap-2"><Button variant="outline" size="sm" onClick={handleFormat}>{copy.format}</Button><ActionButtons onCopy={() => {}} value={output} /></div></div></CardHeader><CardContent>{error ? <div className="flex h-[300px] w-full items-center justify-center rounded-lg border bg-red-50 p-4 text-center text-red-600">{error}</div> : <JsonViewer value={output} />}</CardContent></Card>
          </div>
          <div className="flex justify-center"><Button onClick={unescapeJson} size="lg" className="rounded-full px-8">{copy.executeUnescape}</Button></div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-lg">{copy.toolDesc}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p>{copy.t1}</p><p>{copy.t2}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">{copy.faq}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p><strong>Q：</strong>{copy.q1}<br /><strong>A：</strong>{copy.a1}</p><p><strong>Q：</strong>{copy.q2}<br /><strong>A：</strong>{copy.a2}</p></CardContent></Card>
      </div>

      <CommentSection pageKey="json-escape" />
    </ToolLayout>
  );
}
