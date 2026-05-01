'use client';

import { Button } from '@/components/ui/button';
import { Copy, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: string;
  readOnly?: boolean;
}

export function EditorPanel({ 
  value, 
  onChange, 
  placeholder = '在此输入内容...', 
  language,
  readOnly = false 
}: EditorPanelProps) {
  return (
    <div className="relative h-full min-h-[300px]">
      {language && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
          {language}
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full h-full min-h-[300px] p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
      />
    </div>
  );
}

interface ActionButtonsProps {
  onCopy?: () => void;
  onClear?: () => void;
  onSwap?: () => void;
  value?: string;
}

export function ActionButtons({ onCopy, onClear, onSwap, value }: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    }
    onCopy?.();
  };

  return (
    <div className="flex gap-2">
      {onCopy !== undefined && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!value}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              复制
            </>
          )}
        </Button>
      )}
      {onClear && (
        <Button variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-1" />
          清空
        </Button>
      )}
      {onSwap && (
        <Button variant="outline" size="sm" onClick={onSwap}>
          一键交换
        </Button>
      )}
    </div>
  );
}
