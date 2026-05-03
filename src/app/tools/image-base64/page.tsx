'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { ToolLayout, EditorPanel, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { CommentSection } from '@/components/CommentSection';

function inferMimeFromBase64(value: string) {
  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  return match?.[1] || 'image/png';
}

function inferExtension(mime: string) {
  const mapping: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };
  return mapping[mime] || 'png';
}

function normalizeBase64Image(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false as const, error: '请输入 Base64 内容' };
  }

  if (trimmed.startsWith('data:image')) {
    return { valid: true as const, dataUrl: trimmed, mime: inferMimeFromBase64(trimmed) };
  }

  const normalized = trimmed.replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/=]+$/.test(normalized)) {
    return { valid: false as const, error: 'Base64 内容格式不正确' };
  }

  return {
    valid: true as const,
    dataUrl: `data:image/png;base64,${normalized}`,
    mime: 'image/png',
  };
}

export default function ImageBase64Page() {
  const [mode, setMode] = useState<'image-to-base64' | 'base64-to-image'>('image-to-base64');
  const [base64, setBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('image.png');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageMeta = useMemo(() => {
    if (!base64) return null;
    const mime = inferMimeFromBase64(base64);
    const pure = base64.includes(',') ? base64.split(',')[1] : base64.replace(/\s+/g, '');
    const sizeBytes = Math.floor((pure.length * 3) / 4);
    return { mime, sizeBytes };
  }, [base64]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64Convert = () => {
    const result = normalizeBase64Image(base64);
    if (!result.valid) {
      setError(result.error);
      setPreviewUrl('');
      return;
    }

    setError('');
    setPreviewUrl(result.dataUrl);
    if (!fileName.trim() || fileName === 'image.png') {
      setFileName(`image.${inferExtension(result.mime)}`);
    }
    toast.success('图片解析成功');
  };

  const handleDownload = () => {
    if (!previewUrl) return;

    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setBase64('');
    setPreviewUrl('');
    setFileName('image.png');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolLayout title="图片 Base64 互转工具" description="图片与 Base64 互转，支持上传预览、格式识别和下载">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'image-to-base64' | 'base64-to-image')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image-to-base64">图片转Base64</TabsTrigger>
          <TabsTrigger value="base64-to-image">Base64转图片</TabsTrigger>
        </TabsList>

        <TabsContent value="image-to-base64" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">上传图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex w-full items-center justify-center">
                  <label
                    htmlFor="image-upload"
                    className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="mb-3 h-10 w-10 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">点击上传</span> 或拖拽文件
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, WEBP</p>
                    </div>
                    <input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-muted-foreground">预览：</p>
                    <div className="relative mx-auto h-48 w-full overflow-hidden rounded border bg-muted/20">
                      <Image src={previewUrl} alt="Preview" fill className="object-contain" unoptimized />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Base64 结果</CardTitle>
                  <ActionButtons onClear={handleClear} onCopy={() => {}} value={base64} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <EditorPanel value={base64} onChange={() => {}} placeholder="Base64编码结果..." readOnly />
                {imageMeta && (
                  <div className="text-xs text-muted-foreground">
                    MIME：{imageMeta.mime} · 约 {(imageMeta.sizeBytes / 1024).toFixed(1)} KB
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="base64-to-image" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Base64 输入</CardTitle>
                  <ActionButtons onClear={handleClear} value={base64} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditorPanel value={base64} onChange={setBase64} placeholder="输入 Base64 编码..." />
                <div className="flex gap-2">
                  <Label htmlFor="filename">文件名：</Label>
                  <input
                    id="filename"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 rounded border px-3 py-1 text-sm"
                  />
                </div>
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
                <Button onClick={handleBase64Convert} className="w-full">
                  转换为图片
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">图片预览</CardTitle>
                  {previewUrl && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="mr-1 h-4 w-4" />
                      下载图片
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {previewUrl ? (
                  <div className="relative min-h-[300px] overflow-hidden rounded-lg border bg-gray-50 dark:bg-gray-800">
                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-3" unoptimized />
                  </div>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-gray-50 dark:bg-gray-800">
                    <ImageIcon className="mb-2 h-16 w-16 text-gray-300" />
                    <p className="text-sm text-gray-400">图片预览区域</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">工具说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>图片 Base64 工具适合前端开发、接口联调和数据内联场景，支持图片上传转 Base64，也支持把 Base64 内容重新还原成图片预览。</p>
            <p>当你需要快速验证图片字符串是否可用、或者生成临时 data URL 时，这个工具会比手工处理方便很多。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">常见问题</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p><strong>Q：</strong>为什么图片无法预览？<br /><strong>A：</strong>通常是 Base64 内容不完整，或者缺少正确的 MIME 前缀。</p>
            <p><strong>Q：</strong>适合什么场景？<br /><strong>A：</strong>前端调试、接口联调、邮件模板、临时内联图片和快速验图都很适合。</p>
          </CardContent>
        </Card>
      </div>

      <CommentSection pageKey="image-base64" />
    </ToolLayout>
  );
}
