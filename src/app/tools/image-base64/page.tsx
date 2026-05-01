'use client';

import { useState, useRef } from 'react';
import { ToolLayout, EditorPanel, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { CommentSection } from '@/components/CommentSection';

export default function ImageBase64Page() {
  const [mode, setMode] = useState<'image-to-base64' | 'base64-to-image'>('image-to-base64');
  const [base64, setBase64] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('image.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 图片转Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Base64转图片
  const handleBase64Convert = () => {
    if (!base64) return;

    // 如果没有data:image前缀，自动添加
    let dataUrl = base64;
    if (!base64.startsWith('data:image')) {
      dataUrl = `data:image/png;base64,${base64}`;
    }

    setPreviewUrl(dataUrl);
    setImageUrl(dataUrl);
  };

  // 下载图片
  const handleDownload = () => {
    if (!previewUrl) return;

    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 清空
  const handleClear = () => {
    setBase64('');
    setPreviewUrl('');
    setImageUrl('');
    setFileName('image.png');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolLayout
      title="图片 Base64 互转工具"
      description="图片与Base64互转，支持上传预览和下载"
    >
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'image-to-base64' | 'base64-to-image')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image-to-base64">图片转Base64</TabsTrigger>
          <TabsTrigger value="base64-to-image">Base64转图片</TabsTrigger>
        </TabsList>

        <TabsContent value="image-to-base64" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">上传图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">点击上传</span> 或拖拽文件
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF, WEBP
                      </p>
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
                    <p className="text-sm text-muted-foreground mb-2">预览：</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-auto max-h-48 mx-auto rounded border"
                    />
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
              <CardContent>
                <EditorPanel
                  value={base64}
                  onChange={() => {}}
                  placeholder="Base64编码结果..."
                  readOnly
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="base64-to-image" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Base64 输入</CardTitle>
                  <ActionButtons onClear={handleClear} value={base64} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditorPanel
                  value={base64}
                  onChange={setBase64}
                  placeholder="输入Base64编码..."
                />
                <div className="flex gap-2">
                  <Label htmlFor="filename">文件名：</Label>
                  <input
                    id="filename"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 px-3 py-1 text-sm border rounded"
                  />
                </div>
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
                      <Download className="h-4 w-4 mr-1" />
                      下载图片
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {previewUrl ? (
                  <div className="flex items-center justify-center min-h-[300px] border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-auto max-h-[400px] rounded"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[300px] border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <ImageIcon className="w-16 h-16 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">图片预览区域</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 评论区 */}
      <CommentSection pageKey="image-base64" />
    </ToolLayout>
  );
}
