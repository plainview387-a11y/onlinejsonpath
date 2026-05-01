'use client';

import { Highlight, themes } from 'prism-react-renderer';
import Editor from 'react-simple-code-editor';
import { cn } from '@/lib/utils';

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  height?: string;
  error?: boolean;
}

// JSON 语法高亮函数
const highlightJson = (code: string) => {
  return (
    <Highlight theme={themes.vsDark} code={code} language="json">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export function JsonEditor({
  value,
  onChange,
  placeholder = '在此输入 JSON...',
  readOnly = false,
  className,
  height = '300px',
  error = false,
}: JsonEditorProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border bg-[#1e1e1e] overflow-hidden',
        error ? 'border-red-500' : 'border-border',
        className
      )}
      style={{ height }}
    >
      {!value && (
        <div className="absolute inset-0 flex items-start justify-start p-4 pointer-events-none">
          <span className="text-muted-foreground/50 font-mono text-sm">{placeholder}</span>
        </div>
      )}
      <div className="h-full overflow-auto">
        <Editor
          value={value}
          onValueChange={onChange || (() => {})}
          highlight={highlightJson}
          disabled={readOnly}
          padding={16}
          className="font-mono text-sm"
          textareaClassName={cn(
            'outline-none !bg-transparent resize-none',
            readOnly && 'cursor-default'
          )}
          style={{
            backgroundColor: 'transparent',
            minHeight: height,
            fontFamily: '"Fira Code", "Fira Mono", Consolas, Monaco, monospace',
          }}
        />
      </div>
    </div>
  );
}

// 只读的 JSON 显示组件
export function JsonViewer({
  value,
  className,
  height = '300px',
}: {
  value: string;
  className?: string;
  height?: string;
}) {
  return (
    <JsonEditor
      value={value}
      readOnly
      className={className}
      height={height}
      placeholder="结果将在此显示..."
    />
  );
}
