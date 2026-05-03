'use client';

import { useMemo, useState } from 'react';
import { ToolLayout, EditorPanel, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CommentSection } from '@/components/CommentSection';
import { useLanguage } from '@/contexts/LanguageContext';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function uint8ToBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToUint8(value: string) {
  const normalized = value.replace(/\s+/g, '');
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function runBase64Convert(input: string, isEncode: boolean, language: 'zh' | 'en') {
  if (!input) return { output: '', error: '' };
  try {
    if (isEncode) {
      return { output: uint8ToBase64(encoder.encode(input)), error: '' };
    }
    return { output: decoder.decode(base64ToUint8(input)), error: '' };
  } catch {
    return {
      output: '',
      error: isEncode ? (language === 'zh' ? '编码失败' : 'Encoding failed') : (language === 'zh' ? '解码失败：输入不是有效的 Base64 字符串' : 'Decoding failed: input is not a valid Base64 string'),
    };
  }
}

export default function Base64Page() {
  const { language } = useLanguage();
  const copy = {
    title: language === 'zh' ? 'Base64 加解密工具' : 'Base64 Encode / Decode Tool',
    desc: language === 'zh' ? '支持 UTF-8 文本的 Base64 编码和解码，可实时自动转换' : 'Encode and decode UTF-8 text in Base64 with optional realtime conversion.',
    settings: language === 'zh' ? '转换设置' : 'Conversion Settings',
    encode: language === 'zh' ? '编码模式' : 'Encode Mode',
    decode: language === 'zh' ? '解码模式' : 'Decode Mode',
    realtime: language === 'zh' ? '实时转换' : 'Realtime Convert',
    convertNow: language === 'zh' ? '立即转换' : 'Convert Now',
    sourceText: language === 'zh' ? '原始文本' : 'Source Text',
    base64Text: language === 'zh' ? 'Base64 文本' : 'Base64 Text',
    base64Result: language === 'zh' ? 'Base64 结果' : 'Base64 Result',
    decodeResult: language === 'zh' ? '解码结果' : 'Decoded Result',
    inputEncode: language === 'zh' ? '输入要编码的文本...' : 'Enter text to encode...',
    inputDecode: language === 'zh' ? '输入要解码的 Base64 文本...' : 'Enter Base64 text to decode...',
    output: language === 'zh' ? '转换结果...' : 'Conversion result...',
    toolDesc: language === 'zh' ? '工具说明' : 'About this tool',
    faq: language === 'zh' ? '常见问题' : 'FAQ',
    t1: language === 'zh' ? 'Base64 常用于接口传输、图片内联、签名串处理和调试排查。这个页面支持 UTF-8 文本内容的在线编码与解码。' : 'Base64 is commonly used for API transport, inline images, signature strings, and debugging. This page supports online encoding and decoding of UTF-8 text.',
    t2: language === 'zh' ? '如果输入的内容不是合法 Base64，页面会直接给出错误提示，避免误把无效内容当成结果继续使用。' : 'If the input is not valid Base64, the page shows a direct error so invalid content is not mistaken for a successful result.',
    q1: language === 'zh' ? 'Base64 是加密吗？' : 'Is Base64 encryption?',
    a1: language === 'zh' ? '不是，它只是编码方式，不能代替真正的加密。' : 'No. It is only an encoding format and cannot replace real encryption.',
    q2: language === 'zh' ? '为什么解码失败？' : 'Why does decoding fail?',
    a2: language === 'zh' ? '通常是输入内容不完整、夹带空白字符，或者本身就不是合法 Base64。' : 'Usually the input is incomplete, contains invalid whitespace/content, or is not valid Base64 at all.',
  };

  const [input, setInput] = useState('');
  const [manualOutput, setManualOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);
  const [autoConvert, setAutoConvert] = useState(true);

  const realtimeResult = useMemo(() => runBase64Convert(input, isEncode, language), [input, isEncode, language]);
  const output = autoConvert ? realtimeResult.output : manualOutput;
  const error = autoConvert ? realtimeResult.error : '';

  const handleConvert = () => {
    const result = runBase64Convert(input, isEncode, language);
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
    <ToolLayout title={copy.title} description={copy.desc}>
      <div className="space-y-4">
        <Card className="border-primary/10 shadow-sm">
          <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{copy.settings}</CardTitle></div></CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2"><Switch id="mode" checked={isEncode} onCheckedChange={setIsEncode} /><Label htmlFor="mode">{isEncode ? copy.encode : copy.decode}</Label></div>
              <div className="flex items-center space-x-2"><Switch id="auto" checked={autoConvert} onCheckedChange={setAutoConvert} /><Label htmlFor="auto">{copy.realtime}</Label></div>
              {!autoConvert && <button onClick={handleConvert} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">{copy.convertNow}</button>}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="shadow-sm"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{isEncode ? copy.sourceText : copy.base64Text}</CardTitle><ActionButtons onClear={handleClear} value={input} /></div></CardHeader><CardContent><EditorPanel value={input} onChange={setInput} placeholder={isEncode ? copy.inputEncode : copy.inputDecode} /></CardContent></Card>
          <Card className="shadow-sm"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{isEncode ? copy.base64Result : copy.decodeResult}</CardTitle><ActionButtons onSwap={handleSwap} onCopy={() => {}} value={output} /></div></CardHeader><CardContent>{error ? <div className="flex h-[300px] w-full items-center justify-center rounded-lg border bg-red-50 p-4 text-center text-red-600">{error}</div> : <EditorPanel value={output} onChange={() => {}} placeholder={copy.output} readOnly />}</CardContent></Card>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-lg">{copy.toolDesc}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p>{copy.t1}</p><p>{copy.t2}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">{copy.faq}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p><strong>Q：</strong>{copy.q1}<br /><strong>A：</strong>{copy.a1}</p><p><strong>Q：</strong>{copy.q2}<br /><strong>A：</strong>{copy.a2}</p></CardContent></Card>
      </div>

      <CommentSection pageKey="base64" />
    </ToolLayout>
  );
}
