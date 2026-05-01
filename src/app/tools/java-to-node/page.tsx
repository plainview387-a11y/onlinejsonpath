'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Play, Loader2, Copy, Trash2, Check, ArrowRight, AlertCircle, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { CommentSection } from '@/components/CommentSection';

// Java 到 Node.js 的转换规则
const javaToNodejsRules: Record<string, { pattern: RegExp; replacement: string; description: string }[]> = {
  // 导入语句
  imports: [
    { pattern: /^import\s+[\w.]+;\s*\n*/gm, replacement: '', description: '移除 Java import' },
    { pattern: /^import\s+[\w.]+\.([\w]+);\s*\n*/gm, replacement: "// const $1 = require('$1');\n", description: '转为 require' },
  ],
  // 类声明
  class: [
    { pattern: /(public|private|protected)\s+(static\s+)?class\s+(\w+)/g, replacement: 'class $3', description: '移除访问修饰符' },
    { pattern: /(public|private|protected)\s+(static\s+)?void\s+main/gm, replacement: 'function main', description: 'main 方法转函数' },
    { pattern: /static void main\(String\[\] args\)/g, replacement: 'function main()', description: 'main 参数' },
  ],
  // 数据类型
  types: [
    { pattern: /\bString\b/g, replacement: 'let', description: 'String → let' },
    { pattern: /\bint\b/g, replacement: 'let', description: 'int → let' },
    { pattern: /\blong\b/g, replacement: 'let', description: 'long → let' },
    { pattern: /\bdouble\b/g, replacement: 'let', description: 'double → let' },
    { pattern: /\bfloat\b/g, replacement: 'let', description: 'float → let' },
    { pattern: /\bboolean\b/g, replacement: 'let', description: 'boolean → let' },
    { pattern: /\bchar\b/g, replacement: 'let', description: 'char → let' },
    { pattern: /\bbyte\b/g, replacement: 'let', description: 'byte → let' },
    { pattern: /\bshort\b/g, replacement: 'let', description: 'short → let' },
    { pattern: /\bArrayList<(\w+)>\b/g, replacement: 'let /* ArrayList<$1> */', description: 'ArrayList' },
    { pattern: /\bHashMap<(\w+),\s*(\w+)>\b/g, replacement: 'let /* HashMap<$1,$2> */', description: 'HashMap' },
    { pattern: /\bMap<(\w+),\s*(\w+)>\b/g, replacement: 'let /* Map<$1,$2> */', description: 'Map' },
    { pattern: /\bList<(\w+)>\b/g, replacement: 'let /* List<$1> */', description: 'List' },
  ],
  // 输出语句
  print: [
    { pattern: /System\.out\.println\s*\(/g, replacement: 'console.log(', description: 'println → console.log' },
    { pattern: /System\.out\.print\s*\(/g, replacement: 'process.stdout.write(', description: 'print → process.stdout.write' },
    { pattern: /System\.out\.printf\s*\(/g, replacement: 'console.log(', description: 'printf → console.log' },
  ],
  // 读取输入
  input: [
    { pattern: /new\s+Scanner\s*\(\s*System\.in\s*\)/g, replacement: '/* 输入需手动定义 */', description: 'Scanner 移除' },
    { pattern: /(\w+)\.nextLine\(\)/g, replacement: '/* 获取输入: $1 */ ""', description: 'nextLine' },
    { pattern: /(\w+)\.nextInt\(\)/g, replacement: '/* 获取整数输入: $1 */ 0', description: 'nextInt' },
    { pattern: /(\w+)\.next\(\)/g, replacement: '/* 获取输入: $1 */ ""', description: 'next' },
  ],
  // 字符串方法
  strings: [
    { pattern: /\.length\(\)/g, replacement: '.length', description: 'length() → length' },
    { pattern: /\.toString\(\)/g, replacement: '.toString()', description: 'toString() 保留' },
    { pattern: /\.charAt\((\d+)\)/g, replacement: '[$1]', description: 'charAt → []' },
    { pattern: /\.substring\((\d+),\s*(\d+)\)/g, replacement: '.substring($1, $2)', description: 'substring 保留' },
    { pattern: /\.split\("([^"]+)"\)/g, replacement: '.split("$1")', description: 'split 保留' },
    { pattern: /\.indexOf\("([^"]+)"\)/g, replacement: '.indexOf("$1")', description: 'indexOf 保留' },
    { pattern: /\.replaceAll\("([^"]+)",\s*"/g, replacement: '.replaceAll(/$1/g, "', description: 'replaceAll' },
  ],
  // 数组相关
  arrays: [
    { pattern: /\[\s*\]/g, replacement: '[]', description: '空数组' },
    { pattern: /new\s+\w+\[\d+\]/g, replacement: 'Array', description: 'new Array[]' },
    { pattern: /\.length/g, replacement: '.length', description: '数组长度' },
  ],
  // 方法调用
  methods: [
    { pattern: /Math\.abs\(/g, replacement: 'Math.abs(', description: 'Math.abs 保留' },
    { pattern: /Math\.max\(/g, replacement: 'Math.max(', description: 'Math.max 保留' },
    { pattern: /Math\.min\(/g, replacement: 'Math.min(', description: 'Math.min 保留' },
    { pattern: /Math\.sqrt\(/g, replacement: 'Math.sqrt(', description: 'Math.sqrt 保留' },
    { pattern: /Math\.pow\(/g, replacement: 'Math.pow(', description: 'Math.pow 保留' },
    { pattern: /Math\.random\(\)/g, replacement: 'Math.random()', description: 'Math.random 保留' },
    { pattern: /Math\.floor\(/g, replacement: 'Math.floor(', description: 'Math.floor 保留' },
    { pattern: /Math\.ceil\(/g, replacement: 'Math.ceil(', description: 'Math.ceil 保留' },
    { pattern: /Math\.round\(/g, replacement: 'Math.round(', description: 'Math.round 保留' },
    { pattern: /Math\.PI\b/g, replacement: 'Math.PI', description: 'Math.PI 保留' },
  ],
  // 关键字转换
  keywords: [
    { pattern: /\bnew\b/g, replacement: '/* new 需根据具体情况调整 */', description: 'new 关键字' },
    { pattern: /\bextends\b/g, replacement: '/* extends */', description: 'extends' },
    { pattern: /\bimplements\b/g, replacement: '/* implements */', description: 'implements' },
    { pattern: /\bthrows\b/g, replacement: '/* throws */', description: 'throws' },
    { pattern: /\binstanceof\b/g, replacement: 'instanceof', description: 'instanceof 保留' },
    { pattern: /\bfinal\b/g, replacement: 'const', description: 'final → const' },
    { pattern: /\bstatic\b/g, replacement: '/* static */', description: 'static 移除' },
    { pattern: /\bpublic\b/g, replacement: '/* public */', description: 'public 移除' },
    { pattern: /\bprivate\b/g, replacement: '/* private */', description: 'private 移除' },
  ],
};

// 默认 Java 示例代码
const defaultJavaCode = `import java.util.Scanner;

public class HelloWorld {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // 获取用户输入
        System.out.println("请输入你的名字:");
        String name = scanner.nextLine();
        
        System.out.println("请输入你的年龄:");
        int age = scanner.nextInt();
        
        // 输出结果
        System.out.println("Hello, " + name + "!");
        System.out.println("You are " + age + " years old.");
        
        // 计算
        int doubleAge = age * 2;
        System.out.println("Double your age is: " + doubleAge);
        
        // 字符串操作
        String upperName = name.toUpperCase();
        String lowerName = name.toLowerCase();
        
        System.out.println("Uppercase: " + upperName);
        System.out.println("Lowercase: " + lowerName);
        
        // Math 类方法
        double sqrt = Math.sqrt(age);
        double pow = Math.pow(age, 2);
        
        System.out.println("sqrt(" + age + ") = " + sqrt);
        System.out.println(age + "^2 = " + pow);
        
        // 数组示例
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        System.out.println("Sum of array: " + sum);
        
        scanner.close();
    }
}`;

export default function JavaToNodePage() {
  const [javaCode, setJavaCode] = useState(defaultJavaCode);
  const [nodeCode, setNodeCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [converting, setConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  // 转换 Java 到 Node.js
  const convertCode = useCallback(() => {
    setConverting(true);
    setError('');
    
    try {
      let result = javaCode;
      
      // 按顺序应用所有转换规则
      Object.values(javaToNodejsRules).forEach(rules => {
        rules.forEach(rule => {
          if (rule.replacement) {
            result = result.replace(rule.pattern, rule.replacement);
          }
        });
      });

      // 额外处理：移除 package 声明
      result = result.replace(/^package\s+[\w.]+;\s*\n*/gm, '');
      
      // 移除多余空行
      result = result.replace(/\n{3,}/g, '\n\n');
      
      // 添加运行说明
      const runNote = `// === Java 转 Node.js 代码 ===\n// 注意：此转换是自动进行的，可能需要手动调整\n// Java 输入需要在代码中手动定义变量\n\n`;
      
      setNodeCode(runNote + result);
      toast.success('代码转换成功');
    } catch (err) {
      setError('转换失败: ' + (err as Error).message);
      toast.error('转换失败');
    } finally {
      setConverting(false);
    }
  }, [javaCode]);

  // 执行 Node.js 代码
  const executeCode = async () => {
    if (!nodeCode.trim()) {
      toast.error('请先转换代码');
      return;
    }

    setRunning(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch('/api/code-execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: nodeCode,
          language: 'nodejs',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.data?.output || '(无输出)');
        if (data.data?.error) {
          setError(data.data.error);
        }
      } else {
        setError(data.error || '执行失败');
        toast.error(data.error || '执行失败');
      }
    } catch (err) {
      setError('网络错误: ' + (err as Error).message);
      toast.error('网络错误');
    } finally {
      setRunning(false);
    }
  };

  // 复制代码
  const copyCode = () => {
    if (nodeCode) {
      navigator.clipboard.writeText(nodeCode);
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 清空
  const clearAll = () => {
    setJavaCode('');
    setNodeCode('');
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout
      title="Java 转 Node.js 工具"
      description="将 Java 代码自动转换为 Node.js 代码，并支持在线执行"
    >
      <div className="space-y-4">
        {/* 工具栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code className="h-4 w-4" />
            <span>Java 代码输入</span>
            <ArrowRight className="h-4 w-4" />
            <span>Node.js 代码输出</span>
            <ArrowRight className="h-4 w-4" />
            <span>在线执行</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              清空
            </Button>
          </div>
        </div>

        {/* 代码编辑区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Java 输入 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-orange-500 font-mono">Java</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={javaCode}
                onChange={(e) => setJavaCode(e.target.value)}
                placeholder="粘贴 Java 代码..."
                className="w-full h-[400px] p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-[#1e1e1e] text-green-400"
              />
            </CardContent>
          </Card>

          {/* Node.js 输出 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-green-500 font-mono">Node.js</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCode}
                    disabled={!nodeCode}
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={nodeCode}
                readOnly
                placeholder="转换后的 Node.js 代码..."
                className="w-full h-[400px] p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-[#1e1e1e] text-blue-400"
              />
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={convertCode}
            disabled={converting || !javaCode.trim()}
            size="lg"
            className="min-w-[200px]"
          >
            {converting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                转换中...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                转换为 Node.js
              </>
            )}
          </Button>
          <Button
            onClick={executeCode}
            disabled={running || !nodeCode.trim()}
            size="lg"
            variant="default"
            className="min-w-[200px]"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                执行中...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                运行代码
              </>
            )}
          </Button>
        </div>

        {/* 执行结果 */}
        {(output || error) && (
          <Card className={error ? 'border-red-500' : ''}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                运行结果
                {error && <span className="text-red-500 text-sm font-normal">（有错误）</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 错误信息 */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap font-mono">
                        {error}
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* 输出结果 */}
                {output && (
                  <div className="p-4 bg-[#1e1e1e] rounded-lg">
                    <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono overflow-auto max-h-[300px]">
                      {output}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 转换说明 */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">转换说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">支持的转换</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>System.out.println → console.log</li>
                  <li>数据类型 → let (自动推断)</li>
                  <li>Math 类方法保留</li>
                  <li>字符串方法保留</li>
                  <li>数组操作保留</li>
                  <li>final → const</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">需要手动调整</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Scanner 输入 → 手动定义变量</li>
                  <li>import 语句 → 使用 require</li>
                  <li>类和方法声明</li>
                  <li>访问修饰符 (public/private)</li>
                  <li>复杂数据类型 (ArrayList, HashMap)</li>
                  <li>面向对象代码</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>注意：</strong>自动转换仅适用于简单场景。复杂的面向对象代码、继承、多线程等内容需要手动调整。代码执行在沙箱环境中进行，请勿执行恶意代码。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 评论区 */}
      <CommentSection pageKey="java-to-node" />
    </ToolLayout>
  );
}
