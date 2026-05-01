'use client';

import { useMemo, useState } from 'react';
import { ToolLayout, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { JsonEditor, JsonViewer } from '@/components/JsonEditor';
import { CommentSection } from '@/components/CommentSection';

const defaultJson = {
  name: "张三",
  age: 25,
  email: "zhangsan@example.com",
  address: {
    city: "北京",
    street: "朝阳路"
  }
};

const defaultEscaped = '{"name":"张三","age":25,"email":"zhangsan@example.com","address":{"city":"北京","street":"朝阳路"}}';

// 普通文本编辑器（用于转义文本输入）
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
    <div className="relative h-full min-h-[300px] rounded-lg border border-border bg-background overflow-hidden">
      {!value && (
        <div className="absolute inset-0 flex items-start justify-start p-4 pointer-events-none">
          <span className="text-muted-foreground/50 font-mono text-sm">{placeholder}</span>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder=""
        className="w-full h-full min-h-[300px] p-4 font-mono text-sm resize-none focus:outline-none bg-transparent"
      />
    </div>
  );
}

export default function JsonEscapePage() {
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const defaultInput = useMemo(
    () => (mode === 'escape' ? JSON.stringify(defaultJson, null, 2) : defaultEscaped),
    [mode]
  );

  const [input, setInput] = useState('');
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

  // JSON转义
  const escapeJson = () => {
    setError('');
    setInputError(false);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      // 先验证是否为有效JSON
      JSON.parse(input);
      // 转义：压缩JSON并转义特殊字符
      const escaped = JSON.stringify(JSON.stringify(JSON.parse(input)));
      setOutput(escaped.slice(1, -1)); // 去掉外层引号
    } catch (err) {
      setError('JSON格式错误：' + (err as Error).message);
      setInputError(true);
      setOutput('');
    }
  };

  // 转义文本转JSON
  const unescapeJson = () => {
    setError('');
    if (!input) {
      setOutput('');
      return;
    }

    try {
      // 尝试解析转义的JSON
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
      try {
        const formatted = formatJson(input);
        setInput(formatted);
        setInputError(false);
      } catch {
        // 格式化失败
      }
    } else {
      setOutput(formatJson(output));
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setInputError(false);
  };

  return (
    <ToolLayout
      title="JSON 转义 / 反转义工具"
      description="JSON转义与反转义，支持格式化和错误提示"
    >
      <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'escape' | 'unescape')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="escape">JSON转义</TabsTrigger>
          <TabsTrigger value="unescape">转义文本转JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="escape" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
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
                <JsonEditor
                  value={input}
                  onChange={setInput}
                  placeholder="输入JSON文本..."
                  error={inputError}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">转义结果</CardTitle>
                  <ActionButtons onCopy={() => {}} value={output} />
                </div>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="w-full h-[300px] flex items-center justify-center border rounded-lg bg-red-50 text-red-600 p-4 text-center">
                    {error}
                  </div>
                ) : (
                  <TextEditor
                    value={output}
                    placeholder="转义后的文本..."
                    readOnly
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={escapeJson} size="lg">
              执行转义
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="unescape" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">转义文本输入</CardTitle>
                  <ActionButtons onClear={handleClear} value={input} />
                </div>
              </CardHeader>
              <CardContent>
                <TextEditor
                  value={input || defaultInput}
                  onChange={setInput}
                  placeholder="输入转义后的文本..."
                />
              </CardContent>
            </Card>

            <Card>
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
                  <div className="w-full h-[300px] flex items-center justify-center border rounded-lg bg-red-50 text-red-600 p-4 text-center">
                    {error}
                  </div>
                ) : (
                  <JsonViewer value={output} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={unescapeJson} size="lg">
              执行反转义
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* 评论区 */}
      <CommentSection pageKey="json-escape" />
    </ToolLayout>
  );
}
