'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JSONPath } from 'jsonpath-plus';
import { Copy, Trash2, Check, Braces } from 'lucide-react';
import { toast } from 'sonner';
import { JsonEditor, JsonViewer } from '@/components/JsonEditor';
import { CommentSection } from '@/components/CommentSection';
import { useLanguage } from '@/contexts/LanguageContext';

const defaultJson = {
  store: {
    book: [
      { category: 'reference', author: 'Nigel Rees', title: 'Sayings of the Century', price: 8.95 },
      { category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99 },
      { category: 'fiction', author: 'Herman Melville', title: 'Moby Dick', isbn: '0-553-21311-3', price: 8.99 },
      { category: 'fiction', author: 'J. R. R. Tolkien', title: 'The Lord of the Rings', isbn: '0-395-19395-8', price: 22.99 },
    ],
    bicycle: { color: 'red', price: 19.95 },
  },
};

function getDefaultJsonPathResult() {
  try {
    const queryResult = JSONPath({ path: '$.store.book[*].author', json: defaultJson });
    return JSON.stringify(queryResult, null, 2);
  } catch {
    return '';
  }
}

export default function JsonPathPage() {
  const { language } = useLanguage();
  const syntaxExamples = useMemo(() => [
    { symbol: '$', description: language === 'zh' ? '根对象' : 'Root object', example: '$', resultDescription: language === 'zh' ? '整个JSON对象' : 'Entire JSON object' },
    { symbol: '.', description: language === 'zh' ? '子节点' : 'Child node', example: '$.store.book', resultDescription: language === 'zh' ? 'book数组' : 'book array' },
    { symbol: '..', description: language === 'zh' ? '递归查找' : 'Recursive search', example: '$..author', resultDescription: language === 'zh' ? '所有author字段' : 'All author fields' },
    { symbol: '*', description: language === 'zh' ? '通配符' : 'Wildcard', example: '$.store.book[*].author', resultDescription: language === 'zh' ? '所有书的作者' : 'Authors of all books' },
    { symbol: '[]', description: language === 'zh' ? '数组索引' : 'Array index', example: '$.store.book[0]', resultDescription: language === 'zh' ? '第一本书' : 'First book' },
    { symbol: '[-1]', description: language === 'zh' ? '最后一个元素' : 'Last element', example: '$.store.book[-1]', resultDescription: language === 'zh' ? '最后一本书' : 'Last book' },
    { symbol: '[n:m]', description: language === 'zh' ? '数组切片' : 'Array slice', example: '$.store.book[0:2]', resultDescription: language === 'zh' ? '前两本书' : 'First two books' },
    { symbol: '[?()]', description: language === 'zh' ? '过滤表达式' : 'Filter expression', example: '$.store.book[?(@.price<10)]', resultDescription: language === 'zh' ? '价格小于10的书' : 'Books priced under 10' },
  ], [language]);

  const copy = {
    title: language === 'zh' ? 'JSONPath 解析工具' : 'JSONPath Tool',
    desc: language === 'zh' ? 'JSON 路径解析工具，支持 JSON 编辑、格式校验和 JSONPath 查询' : 'Parse JSON paths with JSON editing, validation, and JSONPath queries.',
    input: language === 'zh' ? 'JSON 输入' : 'JSON Input',
    result: language === 'zh' ? '解析结果' : 'Result',
    format: language === 'zh' ? '格式化' : 'Format',
    copy: language === 'zh' ? '复制' : 'Copy',
    copied: language === 'zh' ? '已复制' : 'Copied',
    copyResult: language === 'zh' ? '复制结果' : 'Copy Result',
    clear: language === 'zh' ? '清空' : 'Clear',
    expr: language === 'zh' ? 'JSONPath 表达式' : 'JSONPath Expression',
    exprPlaceholder: language === 'zh' ? '输入JSONPath...' : 'Enter JSONPath...',
    parse: language === 'zh' ? '解析' : 'Run',
    syntax: language === 'zh' ? 'JSONPath 常用语法' : 'Common JSONPath Syntax',
    toolDesc: language === 'zh' ? '工具说明' : 'About this tool',
    faq: language === 'zh' ? '常见问题' : 'FAQ',
    emptyJson: language === 'zh' ? '请输入JSON数据' : 'Please enter JSON data',
    emptyPath: language === 'zh' ? '请输入JSONPath表达式' : 'Please enter a JSONPath expression',
    parseFail: language === 'zh' ? 'JSONPath查询失败: ' : 'JSONPath query failed: ',
    jsonError: language === 'zh' ? 'JSON格式错误' : 'Invalid JSON',
    line: language === 'zh' ? '行' : 'Line',
    sizeLimit: language === 'zh' ? '大小限制：≤5MB' : 'Size limit: ≤5MB',
    inputPlaceholder: language === 'zh' ? '输入JSON数据...' : 'Enter JSON data...',
    copyToast: language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard',
    use: language === 'zh' ? '使用' : 'Use',
    symbol: language === 'zh' ? '符号' : 'Symbol',
    description: language === 'zh' ? '描述' : 'Description',
    example: language === 'zh' ? '示例' : 'Example',
    output: language === 'zh' ? '结果' : 'Result',
    action: language === 'zh' ? '操作' : 'Action',
    q1: language === 'zh' ? '为什么表达式没有结果？' : 'Why does the expression return no result?',
    a1: language === 'zh' ? '通常是路径写错、字段名不匹配，或者当前 JSON 结构与预期不一致。' : 'Usually the path is incorrect, field names do not match, or the JSON structure differs from expectation.',
    q2: language === 'zh' ? '适合什么场景？' : 'What is it useful for?',
    a2: language === 'zh' ? '接口联调、日志排查、Mock 数据验证、复杂 JSON 提取和自动化测试场景都很适合。' : 'It works well for API debugging, log inspection, mock data validation, complex JSON extraction, and automated testing.',
    t1: language === 'zh' ? 'JSONPath 适合从复杂 JSON 结构中快速定位字段、提取数组内容和做接口联调排查。这个工具支持在线输入 JSON、编写表达式并即时查看结果。' : 'JSONPath is useful for quickly locating fields in complex JSON, extracting array content, and debugging API responses. This tool lets you input JSON, write expressions, and inspect results instantly.',
    t2: language === 'zh' ? '你可以直接使用页面内置示例，也可以把接口返回值粘贴进来，结合常用语法表快速验证表达式写法。' : 'You can use the built-in sample data or paste API responses and verify expressions with the syntax reference table.',
    parseFailed: language === 'zh' ? '解析失败' : 'Parse failed',
    errorLine: language === 'zh' ? '错误: 行' : 'Error: line',
  };

  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultJson, null, 2));
  const [jsonPath, setJsonPath] = useState('$.store.book[*].author');
  const [result, setResult] = useState(() => getDefaultJsonPathResult());
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const exampleResults = useMemo(() => {
    const results: Record<string, string> = {};
    syntaxExamples.forEach((item) => {
      try {
        const queryResult = JSONPath({ path: item.example, json: defaultJson });
        const resultStr = JSON.stringify(queryResult, null, 2);
        results[item.example] = resultStr.length > 200 ? resultStr.substring(0, 200) + '...' : resultStr;
      } catch {
        results[item.example] = copy.parseFailed;
      }
    });
    return results;
  }, [syntaxExamples, copy.parseFailed]);

  const validateJson = (str: string): boolean => {
    try { JSON.parse(str); return true; } catch { return false; }
  };

  const currentParseError = (() => {
    if (!jsonInput) return null;
    try { JSON.parse(jsonInput); return null; } catch (err) {
      const message = (err as Error).message;
      const match = message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lines = jsonInput.substring(0, position).split('\n');
        return { line: lines.length, message };
      }
      return { line: 1, message };
    }
  })();

  const executeQuery = () => {
    setError('');
    setResult('');
    if (!jsonInput) return setError(copy.emptyJson);
    if (!jsonPath) return setError(copy.emptyPath);
    if (!validateJson(jsonInput)) return setError(`${copy.jsonError}（${copy.line} ${currentParseError?.line ?? 1}）`);
    try {
      const json = JSON.parse(jsonInput);
      const queryResult = JSONPath({ path: jsonPath, json });
      setResult(JSON.stringify(queryResult, null, 2));
    } catch (err) {
      setError(copy.parseFail + (err as Error).message);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch {}
  };

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(copy.copyToast);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyExample = (path: string) => setJsonPath(path);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold"><Braces className="h-8 w-8" />{copy.title}</h1>
        <p className="text-muted-foreground">{copy.desc}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{copy.input}{currentParseError && <span className="ml-2 text-sm font-normal text-red-500">({copy.errorLine} {currentParseError.line})</span>}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={formatJson}>{copy.format}</Button>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(jsonInput)} disabled={!jsonInput}><Copy className="mr-1 h-4 w-4" />{copy.copy}</Button>
                  <Button variant="outline" size="sm" onClick={() => setJsonInput('')} disabled={!jsonInput}><Trash2 className="mr-1 h-4 w-4" />{copy.clear}</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <JsonEditor value={jsonInput} onChange={setJsonInput} placeholder={copy.inputPlaceholder} height="400px" error={!!currentParseError} />
              <p className="mt-2 text-xs text-muted-foreground">{copy.sizeLimit}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{copy.result}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleCopy(result)} disabled={!result}>{copied ? <><Check className="mr-1 h-4 w-4" />{copy.copied}</> : <><Copy className="mr-1 h-4 w-4" />{copy.copyResult}</>}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jsonpath">{copy.expr}</Label>
                <div className="flex gap-2">
                  <Input id="jsonpath" value={jsonPath} onChange={(e) => setJsonPath(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && executeQuery()} placeholder={copy.exprPlaceholder} className="font-mono" />
                  <Button onClick={executeQuery}>{copy.parse}</Button>
                </div>
              </div>
              {error ? <div className="flex h-[320px] w-full items-center justify-center rounded-lg border bg-red-50 p-4 text-center text-red-600 dark:bg-red-950">{error}</div> : <JsonViewer value={result} height="320px" />}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">{copy.syntax}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="px-3 py-2 text-left font-medium">{copy.symbol}</th><th className="px-3 py-2 text-left font-medium">{copy.description}</th><th className="px-3 py-2 text-left font-medium">{copy.example}</th><th className="min-w-[200px] px-3 py-2 text-left font-medium">{copy.output}</th><th className="px-3 py-2 text-left font-medium">{copy.action}</th></tr></thead>
                <tbody>
                  {syntaxExamples.map((item) => <tr key={item.example} className="border-b hover:bg-muted/50"><td className="px-3 py-3 font-mono text-primary">{item.symbol}</td><td className="px-3 py-3">{item.description}</td><td className="px-3 py-3 font-mono text-xs">{item.example}</td><td className="px-3 py-3"><div className="flex flex-col gap-1.5"><span className="text-xs text-muted-foreground">{item.resultDescription}</span><pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded bg-muted/50 p-2 font-mono text-xs">{exampleResults[item.example]}</pre></div></td><td className="px-3 py-3"><Button size="sm" variant="ghost" onClick={() => applyExample(item.example)}>{copy.use}</Button></td></tr>)}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-lg">{copy.toolDesc}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p>{copy.t1}</p><p>{copy.t2}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">{copy.faq}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p><strong>Q:</strong> {copy.q1}<br /><strong>A:</strong> {copy.a1}</p><p><strong>Q:</strong> {copy.q2}<br /><strong>A:</strong> {copy.a2}</p></CardContent></Card>
      </div>

      <CommentSection pageKey="jsonpath" />
    </div>
  );
}
