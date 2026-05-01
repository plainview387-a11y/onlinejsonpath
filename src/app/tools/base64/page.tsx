'use client';

import { useState, useEffect } from 'react';
import { ToolLayout, EditorPanel, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CommentSection } from '@/components/CommentSection';

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);
  const [autoConvert, setAutoConvert] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (autoConvert) {
      convert();
    }
  }, [input, isEncode, autoConvert]);

  const convert = () => {
    setError('');
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (isEncode) {
        // 编码
        const result = btoa(unescape(encodeURIComponent(input)));
        setOutput(result);
      } else {
        // 解码
        const result = decodeURIComponent(escape(atob(input)));
        setOutput(result);
      }
    } catch (err) {
      setError(isEncode ? '编码失败' : '解码失败：输入不是有效的Base64字符串');
      setOutput('');
    }
  };

  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setIsEncode(!isEncode);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout
      title="Base64 加解密工具"
      description="支持文本的Base64编码和解码，可实时自动转换"
    >
      <div className="space-y-4">
        {/* 控制栏 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">转换设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="mode"
                  checked={isEncode}
                  onCheckedChange={setIsEncode}
                />
                <Label htmlFor="mode">
                  {isEncode ? '编码模式' : '解码模式'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto"
                  checked={autoConvert}
                  onCheckedChange={setAutoConvert}
                />
                <Label htmlFor="auto">实时转换</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 编辑器区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 输入 */}
          <Card>
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

          {/* 输出 */}
          <Card>
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
                <div className="w-full h-[300px] flex items-center justify-center border rounded-lg bg-red-50 text-red-600">
                  {error}
                </div>
              ) : (
                <EditorPanel
                  value={output}
                  onChange={() => {}}
                  placeholder="转换结果..."
                  readOnly
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 评论区 */}
      <CommentSection pageKey="base64" />
    </ToolLayout>
  );
}
