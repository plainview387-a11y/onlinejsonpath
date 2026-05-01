'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JSONPath } from 'jsonpath-plus';
import { Copy, Trash2, Check, Braces } from 'lucide-react';
import { toast } from 'sonner';
import { JsonEditor, JsonViewer } from '@/components/JsonEditor';
import { CommentSection } from '@/components/CommentSection';

const defaultJson = {
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
};

// JSONPath 语法示例配置
const syntaxExamples = [
  {
    symbol: '$',
    description: '根对象',
    example: '$',
    resultDescription: '整个JSON对象',
  },
  {
    symbol: '.',
    description: '子节点',
    example: '$.store.book',
    resultDescription: 'book数组',
  },
  {
    symbol: '..',
    description: '递归查找',
    example: '$..author',
    resultDescription: '所有author字段',
  },
  {
    symbol: '*',
    description: '通配符',
    example: '$.store.book[*].author',
    resultDescription: '所有书的作者',
  },
  {
    symbol: '[]',
    description: '数组索引',
    example: '$.store.book[0]',
    resultDescription: '第一本书',
  },
  {
    symbol: '[-1]',
    description: '最后一个元素',
    example: '$.store.book[-1]',
    resultDescription: '最后一本书',
  },
  {
    symbol: '[n:m]',
    description: '数组切片',
    example: '$.store.book[0:2]',
    resultDescription: '前两本书',
  },
  {
    symbol: '[?()]',
    description: '过滤表达式',
    example: '$.store.book[?(@.price<10)]',
    resultDescription: '价格小于10的书',
  },
];

export default function JsonPathPage() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultJson, null, 2));
  const [jsonPath, setJsonPath] = useState('$.store.book[*].author');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 预计算每个语法示例的真实结果
  const exampleResults = useMemo(() => {
    const results: Record<string, string> = {};
    syntaxExamples.forEach((item) => {
      try {
        const queryResult = JSONPath({ path: item.example, json: defaultJson });
        // 简化结果显示，如果结果太长则截断
        const resultStr = JSON.stringify(queryResult, null, 2);
        if (resultStr.length > 200) {
          results[item.example] = resultStr.substring(0, 200) + '...';
        } else {
          results[item.example] = resultStr;
        }
      } catch {
        results[item.example] = '解析失败';
      }
    });
    return results;
  }, []);

  // 验证JSON格式
  const validateJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  // 执行JSONPath查询
  const executeQuery = () => {
    setError('');
    setResult('');

    if (!jsonInput) {
      setError('请输入JSON数据');
      return;
    }

    if (!jsonPath) {
      setError('请输入JSONPath表达式');
      return;
    }

    if (!validateJson(jsonInput)) {
      setError(`JSON格式错误（行 ${currentParseError?.line ?? parseError?.line ?? 1}）`);
      return;
    }

    try {
      const json = JSON.parse(jsonInput);
      const queryResult = JSONPath({
        path: jsonPath,
        json: json,
      });
      setResult(JSON.stringify(queryResult, null, 2));
    } catch (err) {
      setError('JSONPath查询失败: ' + (err as Error).message);
    }
  };

  // 格式化JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      // 格式化失败
    }
  };

  // 复制到剪贴板
  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 使用示例JSONPath
  const applyExample = (path: string) => {
    setJsonPath(path);
  };

  const currentParseError = (() => {
    if (!jsonInput) return null;
    try {
      JSON.parse(jsonInput);
      return null;
    } catch (err) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Braces className="h-8 w-8" />
          JSONPath 解析工具
        </h1>
        <p className="text-muted-foreground">JSON路径解析工具，支持JSON编辑、格式校验和JSONPath查询</p>
      </div>

      <div className="space-y-4">
        {/* 上半部分：JSON输入和结果 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 左侧：JSON输入 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  JSON 输入
                  {currentParseError && (
                    <span className="text-sm font-normal text-red-500 ml-2">
                      (错误: 行 {currentParseError.line})
                    </span>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={formatJson}>
                    格式化
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(jsonInput)}
                    disabled={!jsonInput}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJsonInput('')}
                    disabled={!jsonInput}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    清空
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <JsonEditor
                value={jsonInput}
                onChange={setJsonInput}
                placeholder="输入JSON数据..."
                height="400px"
                error={!!parseError}
              />
              <p className="text-xs text-muted-foreground mt-2">
                大小限制：≤5MB
              </p>
            </CardContent>
          </Card>

          {/* 右侧：JSONPath输入 + 结果 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">解析结果</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(result)}
                  disabled={!result}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      复制结果
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* JSONPath输入区 */}
              <div className="space-y-2">
                <Label htmlFor="jsonpath">JSONPath 表达式</Label>
                <div className="flex gap-2">
                  <Input
                    id="jsonpath"
                    value={jsonPath}
                    onChange={(e) => setJsonPath(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeQuery()}
                    placeholder="输入JSONPath..."
                    className="font-mono"
                  />
                  <Button onClick={executeQuery}>解析</Button>
                </div>
              </div>

              {/* 结果显示区 */}
              {error ? (
                <div className="w-full h-[320px] flex items-center justify-center border rounded-lg bg-red-50 dark:bg-red-950 text-red-600 p-4 text-center">
                  {error}
                </div>
              ) : (
                <JsonViewer value={result} height="320px" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* 下半部分：JSONPath语法说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">JSONPath 常用语法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">符号</th>
                    <th className="text-left py-2 px-3 font-medium">描述</th>
                    <th className="text-left py-2 px-3 font-medium">示例</th>
                    <th className="text-left py-2 px-3 font-medium min-w-[200px]">结果</th>
                    <th className="text-left py-2 px-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {syntaxExamples.map((item) => (
                    <tr key={item.example} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-3 font-mono text-primary">{item.symbol}</td>
                      <td className="py-3 px-3">{item.description}</td>
                      <td className="py-3 px-3 font-mono text-xs">{item.example}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs text-muted-foreground">{item.resultDescription}</span>
                          <pre className="text-xs bg-muted/50 p-2 rounded max-h-32 overflow-auto font-mono whitespace-pre-wrap">
                            {exampleResults[item.example]}
                          </pre>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Button size="sm" variant="ghost" onClick={() => applyExample(item.example)}>
                          使用
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 评论区 */}
      <CommentSection pageKey="jsonpath" />
    </div>
  );
}
