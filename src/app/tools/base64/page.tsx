'use client';

import { useMemo, useState } from 'react';
import { ToolLayout, EditorPanel, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CommentSection } from '@/components/CommentSection';

function runBase64Convert(input: string, isEncode: boolean) {
  if (!input) {
    return { output: '', error: '' };
  }

  try {
    if (isEncode) {
      return {
        output: btoa(unescape(encodeURIComponent(input))),
        error: '',
      };
    }

    return {
      output: decodeURIComponent(escape(atob(input))),
      error: '',
    };
  } catch {
    return {
      output: '',
      error: isEncode ? '编码失败' : '解码失败：输入不是有效的Base64字符串',
    };
  }
}

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [manualOutput, setManualOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);
  const [autoConvert, setAutoConvert] = useState(true);

  const realtimeResult = useMemo(() => runBase64Convert(input, isEncode), [input, isEncode]);
  const output = autoConvert ? realtimeResult.output : manualOutput;
  const error = autoConvert ? realtimeResult.error : '';

  const handleConvert = () => {
    const result = runBase64Convert(input, isEncode);
    setManualOutput(result.output);
  };

  const handleSwap = () => {
    const nextOutput = output;
    setInput(nextOutput);
    setManualOutput('');
    setIsEncode(!isEncode);
  };

  const handleClear = () => {
    setInput('');
    setManualOutput('');
  };

  return (
    <ToolLayout
      title="Base64 加解密工具"
      description="支持文本的 Base64 编码和解码，可实时自动转换"
    >
      <div className="space-y-4">
        <Card className="border-primary/10 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">转换设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch id="mode" checked={isEncode} onCheckedChange={setIsEncode} />
                <Label htmlFor="mode">{isEncode ? '编码模式' : '解码模式'}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto" checked={autoConvert} onCheckedChange={setAutoConvert} />
                <Label htmlFor="auto">实时转换</Label>
              </div>
              {!autoConvert && (
                <button
                  onClick={handleConvert}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  立即转换
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {isEncode ? '原始文本' : 'Base64 文本'}
                </CardTitle>
                <ActionButtons onClear={handleClear} value={input} />
              </div>
            </CardHeader>
            <CardContent>
              <EditorPanel
                value={input}
                onChange={setInput}
                placeholder={isEncode ? '输入要编码的文本...' : '输入要解码的Base64文本...'}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {isEncode ? 'Base64 结果' : '解码结果'}
                </CardTitle>
                <ActionButtons onSwap={handleSwap} onCopy={() => {}} value={output} />
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="w-full h-[300px] flex items-center justify-center rounded-lg border bg-red-50 p-4 text-center text-red-600">
                  {error}
                </div>
              ) : (
                <EditorPanel value={output} onChange={() => {}} placeholder="转换结果..." readOnly />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">工具说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Base64 常用于接口传输、图片内联、签名串处理和调试排查。这个页面支持文本内容的在线编码与解码。</p>
            <p>如果输入的内容不是合法 Base64，页面会直接给出错误提示，避免误把无效内容当成结果继续使用。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">常见问题</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p><strong>Q：</strong>Base64 是加密吗？<br /><strong>A：</strong>不是，它只是编码方式，不能代替真正的加密。</p>
            <p><strong>Q：</strong>为什么解码失败？<br /><strong>A：</strong>通常是输入内容不完整、夹带空白字符，或者本身就不是合法 Base64。</p>
          </CardContent>
        </Card>
      </div>

      <CommentSection pageKey="base64" />
    </ToolLayout>
  );
}
