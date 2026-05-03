'use client';

import { RefreshCw } from 'lucide-react';

export function CaptchaPreview({
  svg,
  loading,
  onRefresh,
}: {
  svg: string;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <button
      type="button"
      className="flex h-10 w-[120px] items-center justify-center overflow-hidden rounded-md border bg-gray-50 transition-colors hover:bg-gray-100"
      onClick={onRefresh}
      title="点击刷新验证码"
    >
      {loading ? (
        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : svg ? (
        <span dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <span className="text-xs text-muted-foreground">加载中...</span>
      )}
    </button>
  );
}
