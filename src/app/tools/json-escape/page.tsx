'use client';

import { useState } from 'react';
import { ToolLayout, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { JsonEditor, JsonViewer } from '@/components/JsonEditor';
import { CommentSection } from '@/components/CommentSection';

const defaultJson = {
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  address: {
    city: '北京',
    street: '朝阳路',
  },
};

const defaultEscaped = '{"name":"张三","age":25,"email":"zhangsan@example.com","address":{"city":"北京","street":"朝阳路"}}';

function TextEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="relative h-full min-h-[300px] overflow-hidden rounded-lg border border-border bg-background">
      {!value && (
        <div className="absolute inset-0 flex items-start justify-start p-4 pointer-events-none">
          <span className="font-mono text-sm text-muted-foreground/50">{placeholder}</span>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder=""
        className="h-full min-h-[300px] w-full resize-none bg-transparent p-4 font-mono text-sm focus:outline-none"
      />
    </div>
  );
}

export default function JsonEscapePage() {
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
    if (!input) {
      setOutput('');
      return;
    }

    try {
      JSON.parse(input);
      const escaped = JSON.stringify(JSON.stringify(JSON.parse(input)));
      setOutput(escaped.slice(1, -1));
    } catch (err) {
      setError('JSON格式错误：' + (err as Error).message);
      setInputError(true);
      setOutput('');
    }
  };

  const unescapeJson = () => {
    setError('');
    if (!input) {
      setOutput('');
      return;
    }

    try {
      const unescaped = JSON.parse(`"${input}"`);
      const parsed = JSON.parse(unescaped);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError('转义文本格式错误：' + (err as Error).message);
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
    <ToolLayout title="JSON 转义 / 反转义工具" description="JSON 转义与反转义，支持格式化和错误提示">
      <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'escape' | 'unescape')}>
        <TabsList className="grid w-full grid-cols-2 rounded-2xl">
          <TabsTrigger value="escape">JSON转义</TabsTrigger>
          <TabsTrigger value="unescape">转义文本转JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="escape" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">JSON 输入</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleFormat}>
                      格式化
                    </Button>
                    <ActionButtons onClear={handleClear} value={input} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <JsonEditor value={input} onChange={setInput} placeholder="输入JSON文本..." error={inputError} />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">转义结果</CardTitle>
                  <ActionButtons onCopy={() => {}} value={output} />
                </div>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="flex h-[300px] w-full items-center justify-center rounded-lg border bg-red-50 p-4 text-center text-red-600">
                    {error}
                  </div>
                ) : (
                  <TextEditor value={output} placeholder="转义后的文本..." readOnly />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={escapeJson} size="lg" className="rounded-full px-8">
              执行转义
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="unescape" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">转义文本输入</CardTitle>
                  <ActionButtons onClear={handleClear} value={input} />
                </div>
              </CardHeader>
              <CardContent>
                <TextEditor value={input} onChange={setInput} placeholder="输入转义后的文本..." />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">JSON 结果</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleFormat}>
                      格式化
                    </Button>
                    <ActionButtons onCopy={() => {}} value={output} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="flex h-[300px] w-full items-center justify-center rounded-lg border bg-red-50 p-4 text-center text-red-600">
                    {error}
                  </div>
                ) : (
                  <JsonViewer value={output} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={unescapeJson} size="lg" className="rounded-full px-8">
              执行反转义
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <CommentSection pageKey="json-escape" />
    </ToolLayout>
  );
}
