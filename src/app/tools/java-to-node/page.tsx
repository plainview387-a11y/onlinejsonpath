'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Play, Loader2, Copy, Trash2, Check, ArrowRight, AlertCircle, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { CommentSection } from '@/components/CommentSection';
import { useLanguage } from '@/contexts/LanguageContext';

const javaToNodejsRules: Record<string, { pattern: RegExp; replacement: string; description: string }[]> = {
  imports: [
    { pattern: /^import\s+[\w.]+;\s*\n*/gm, replacement: '', description: 'remove import' },
    { pattern: /^import\s+[\w.]+\.([\w]+);\s*\n*/gm, replacement: "// const $1 = require('$1');\n", description: 'to require' },
  ],
  class: [
    { pattern: /(public|private|protected)\s+(static\s+)?class\s+(\w+)/g, replacement: 'class $3', description: 'remove modifiers' },
    { pattern: /(public|private|protected)\s+(static\s+)?void\s+main/gm, replacement: 'function main', description: 'main to function' },
    { pattern: /static void main\(String\[\] args\)/g, replacement: 'function main()', description: 'main args' },
  ],
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
  print: [
    { pattern: /System\.out\.println\s*\(/g, replacement: 'console.log(', description: 'println → console.log' },
    { pattern: /System\.out\.print\s*\(/g, replacement: 'process.stdout.write(', description: 'print → stdout' },
    { pattern: /System\.out\.printf\s*\(/g, replacement: 'console.log(', description: 'printf → console.log' },
  ],
  input: [
    { pattern: /new\s+Scanner\s*\(\s*System\.in\s*\)/g, replacement: '/* manual input required */', description: 'Scanner remove' },
    { pattern: /(\w+)\.nextLine\(\)/g, replacement: '/* input: $1 */ ""', description: 'nextLine' },
    { pattern: /(\w+)\.nextInt\(\)/g, replacement: '/* integer input: $1 */ 0', description: 'nextInt' },
    { pattern: /(\w+)\.next\(\)/g, replacement: '/* input: $1 */ ""', description: 'next' },
  ],
  strings: [
    { pattern: /\.length\(\)/g, replacement: '.length', description: 'length() → length' },
    { pattern: /\.toString\(\)/g, replacement: '.toString()', description: 'keep toString()' },
    { pattern: /\.charAt\((\d+)\)/g, replacement: '[$1]', description: 'charAt → []' },
    { pattern: /\.substring\((\d+),\s*(\d+)\)/g, replacement: '.substring($1, $2)', description: 'keep substring' },
    { pattern: /\.split\("([^"]+)"\)/g, replacement: '.split("$1")', description: 'keep split' },
    { pattern: /\.indexOf\("([^"]+)"\)/g, replacement: '.indexOf("$1")', description: 'keep indexOf' },
    { pattern: /\.replaceAll\("([^"]+)",\s*"/g, replacement: '.replaceAll(/$1/g, "', description: 'replaceAll' },
  ],
  arrays: [
    { pattern: /\[\s*\]/g, replacement: '[]', description: 'empty array' },
    { pattern: /new\s+\w+\[\d+\]/g, replacement: 'Array', description: 'new Array[]' },
    { pattern: /\.length/g, replacement: '.length', description: 'array length' },
  ],
  methods: [
    { pattern: /Math\.abs\(/g, replacement: 'Math.abs(', description: 'keep Math.abs' },
    { pattern: /Math\.max\(/g, replacement: 'Math.max(', description: 'keep Math.max' },
    { pattern: /Math\.min\(/g, replacement: 'Math.min(', description: 'keep Math.min' },
    { pattern: /Math\.sqrt\(/g, replacement: 'Math.sqrt(', description: 'keep Math.sqrt' },
    { pattern: /Math\.pow\(/g, replacement: 'Math.pow(', description: 'keep Math.pow' },
    { pattern: /Math\.random\(\)/g, replacement: 'Math.random()', description: 'keep Math.random' },
    { pattern: /Math\.floor\(/g, replacement: 'Math.floor(', description: 'keep Math.floor' },
    { pattern: /Math\.ceil\(/g, replacement: 'Math.ceil(', description: 'keep Math.ceil' },
    { pattern: /Math\.round\(/g, replacement: 'Math.round(', description: 'keep Math.round' },
    { pattern: /Math\.PI\b/g, replacement: 'Math.PI', description: 'keep Math.PI' },
  ],
  keywords: [
    { pattern: /\bnew\b/g, replacement: '/* adjust new manually */', description: 'new keyword' },
    { pattern: /\bextends\b/g, replacement: '/* extends */', description: 'extends' },
    { pattern: /\bimplements\b/g, replacement: '/* implements */', description: 'implements' },
    { pattern: /\bthrows\b/g, replacement: '/* throws */', description: 'throws' },
    { pattern: /\binstanceof\b/g, replacement: 'instanceof', description: 'keep instanceof' },
    { pattern: /\bfinal\b/g, replacement: 'const', description: 'final → const' },
    { pattern: /\bstatic\b/g, replacement: '/* static */', description: 'static remove' },
    { pattern: /\bpublic\b/g, replacement: '/* public */', description: 'public remove' },
    { pattern: /\bprivate\b/g, replacement: '/* private */', description: 'private remove' },
  ],
};

const defaultJavaCode = `import java.util.Scanner;

public class HelloWorld {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("请输入你的名字:");
        String name = scanner.nextLine();
        
        System.out.println("请输入你的年龄:");
        int age = scanner.nextInt();
        
        System.out.println("Hello, " + name + "!");
        System.out.println("You are " + age + " years old.");
        
        int doubleAge = age * 2;
        System.out.println("Double your age is: " + doubleAge);
        
        String upperName = name.toUpperCase();
        String lowerName = name.toLowerCase();
        
        System.out.println("Uppercase: " + upperName);
        System.out.println("Lowercase: " + lowerName);
        
        double sqrt = Math.sqrt(age);
        double pow = Math.pow(age, 2);
        
        System.out.println("sqrt(" + age + ") = " + sqrt);
        System.out.println(age + "^2 = " + pow);
        
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
  const { language } = useLanguage();
  const copy = {
    title: language === 'zh' ? 'Java 转 Node.js 工具' : 'Java to Node.js Tool',
    description: language === 'zh' ? '将 Java 代码自动转换为 Node.js 代码，并支持在线执行' : 'Convert Java code into Node.js code and run it online.',
    flow1: 'Java',
    flow2: 'Node.js',
    flow3: language === 'zh' ? '在线执行' : 'Run online',
    clear: language === 'zh' ? '清空' : 'Clear',
    javaPlaceholder: language === 'zh' ? '粘贴 Java 代码...' : 'Paste Java code...',
    nodePlaceholder: language === 'zh' ? '转换后的 Node.js 代码...' : 'Converted Node.js code...',
    copied: language === 'zh' ? '已复制' : 'Copied',
    copy: language === 'zh' ? '复制' : 'Copy',
    converting: language === 'zh' ? '转换中...' : 'Converting...',
    convert: language === 'zh' ? '转换为 Node.js' : 'Convert to Node.js',
    running: language === 'zh' ? '执行中...' : 'Running...',
    run: language === 'zh' ? '运行代码' : 'Run Code',
    output: language === 'zh' ? '运行结果' : 'Output',
    error: language === 'zh' ? '有错误' : 'With errors',
    explain: language === 'zh' ? '转换说明' : 'Conversion Notes',
    support: language === 'zh' ? '支持的转换' : 'Supported conversions',
    manual: language === 'zh' ? '需要手动调整' : 'Needs manual adjustment',
    note: language === 'zh' ? '注意：自动转换仅适用于简单场景。复杂的面向对象代码、继承、多线程等内容需要手动调整。代码执行在沙箱环境中进行，请勿执行恶意代码。' : 'Note: automatic conversion is suitable only for simple cases. Complex OOP code, inheritance, multithreading, and similar patterns still need manual adjustment. Code runs in a sandbox; do not execute malicious code.',
    toolDesc: language === 'zh' ? '工具说明' : 'About this tool',
    faq: language === 'zh' ? '常见问题' : 'FAQ',
    t1: language === 'zh' ? 'Java 转 Node.js 工具适合做代码迁移、学习对照和快速原型验证，可以把常见 Java 结构转换成更接近 Node.js 的写法。' : 'This tool is useful for code migration, learning comparison, and quick prototyping by converting common Java structures into Node.js-like code.',
    t2: language === 'zh' ? '它更适合做“初步转换”和思路参考，而不是完全替代人工代码审查，因此生成结果仍建议开发者再检查一遍。' : 'It is better suited for initial conversion and reference, not as a replacement for human code review, so the generated result should still be checked by a developer.',
    q1: language === 'zh' ? '为什么转换结果不能直接运行？' : 'Why might the converted result not run directly?',
    a1: language === 'zh' ? '因为 Java 和 Node.js 语法与运行时模型差异较大，复杂代码通常仍需要人工调整。' : 'Because Java and Node.js differ significantly in syntax and runtime model, complex code usually still needs manual adjustment.',
    q2: language === 'zh' ? '适合什么用途？' : 'What is it useful for?',
    a2: language === 'zh' ? '适合快速改写思路、代码迁移参考、教学演示和原型验证。' : 'It is useful for quick rewrite ideas, migration reference, teaching demos, and prototype validation.',
    success: language === 'zh' ? '代码转换成功' : 'Code converted successfully',
    fail: language === 'zh' ? '转换失败' : 'Conversion failed',
    needConvert: language === 'zh' ? '请先转换代码' : 'Please convert the code first',
    execFail: language === 'zh' ? '执行失败' : 'Execution failed',
    network: language === 'zh' ? '网络错误' : 'Network error',
    noOutput: language === 'zh' ? '(无输出)' : '(No output)',
    copyToast: language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard',
  };

  const [javaCode, setJavaCode] = useState(defaultJavaCode);
  const [nodeCode, setNodeCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [converting, setConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  const convertCode = useCallback(() => {
    setConverting(true);
    setError('');
    try {
      let result = javaCode;
      Object.values(javaToNodejsRules).forEach((rules) => {
        rules.forEach((rule) => {
          if (rule.replacement) result = result.replace(rule.pattern, rule.replacement);
        });
      });
      result = result.replace(/^package\s+[\w.]+;\s*\n*/gm, '');
      result = result.replace(/\n{3,}/g, '\n\n');
      const runNote = language === 'zh'
        ? `// === Java 转 Node.js 代码 ===\n// 注意：此转换是自动进行的，可能需要手动调整\n// Java 输入需要在代码中手动定义变量\n\n`
        : `// === Java to Node.js ===\n// Note: this conversion is automatic and may still need manual adjustment\n// Java input should be defined manually in the code\n\n`;
      setNodeCode(runNote + result);
      toast.success(copy.success);
    } catch (err) {
      setError((language === 'zh' ? '转换失败: ' : 'Conversion failed: ') + (err as Error).message);
      toast.error(copy.fail);
    } finally {
      setConverting(false);
    }
  }, [javaCode, language, copy.success, copy.fail]);

  const executeCode = async () => {
    if (!nodeCode.trim()) return toast.error(copy.needConvert);
    setRunning(true);
    setOutput('');
    setError('');
    try {
      const response = await fetch('/api/code-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: nodeCode, language: 'nodejs' }),
      });
      const data = await response.json();
      if (data.success) {
        setOutput(data.data?.output || copy.noOutput);
        if (data.data?.error) setError(data.data.error);
      } else {
        setError(data.error || copy.execFail);
        toast.error(data.error || copy.execFail);
      }
    } catch (err) {
      setError(copy.network + ': ' + (err as Error).message);
      toast.error(copy.network);
    } finally {
      setRunning(false);
    }
  };

  const copyCode = () => {
    if (nodeCode) {
      navigator.clipboard.writeText(nodeCode);
      setCopied(true);
      toast.success(copy.copyToast);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setJavaCode('');
    setNodeCode('');
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout title={copy.title} description={copy.description}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Code className="h-4 w-4" /><span>{copy.flow1}</span><ArrowRight className="h-4 w-4" /><span>{copy.flow2}</span><ArrowRight className="h-4 w-4" /><span>{copy.flow3}</span></div>
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={clearAll}><Trash2 className="mr-1 h-4 w-4" />{copy.clear}</Button></div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><span className="font-mono text-orange-500">Java</span></CardTitle></CardHeader><CardContent><textarea value={javaCode} onChange={(e) => setJavaCode(e.target.value)} placeholder={copy.javaPlaceholder} className="h-[400px] w-full resize-none rounded-lg border bg-[#1e1e1e] p-4 font-mono text-sm text-green-400 focus:outline-none focus:ring-2 focus:ring-primary" /></CardContent></Card>
          <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2 text-lg"><span className="font-mono text-green-500">Node.js</span></CardTitle><div className="flex gap-2"><Button variant="outline" size="sm" onClick={copyCode} disabled={!nodeCode}>{copied ? <><Check className="mr-1 h-4 w-4" />{copy.copied}</> : <><Copy className="mr-1 h-4 w-4" />{copy.copy}</>}</Button></div></div></CardHeader><CardContent><textarea value={nodeCode} readOnly placeholder={copy.nodePlaceholder} className="h-[400px] w-full resize-none rounded-lg border bg-[#1e1e1e] p-4 font-mono text-sm text-blue-400 focus:outline-none focus:ring-2 focus:ring-primary" /></CardContent></Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={convertCode} disabled={converting || !javaCode.trim()} size="lg" className="min-w-[200px]">{converting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{copy.converting}</> : <><ArrowRight className="mr-2 h-4 w-4" />{copy.convert}</>}</Button>
          <Button onClick={executeCode} disabled={running || !nodeCode.trim()} size="lg" variant="default" className="min-w-[200px]">{running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{copy.running}</> : <><Play className="mr-2 h-4 w-4" />{copy.run}</>}</Button>
        </div>

        {(output || error) && <Card className={error ? 'border-red-500' : ''}><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Terminal className="h-5 w-5" />{copy.output}{error && <span className="text-sm font-normal text-red-500">（{copy.error}）</span>}</CardTitle></CardHeader><CardContent><div className="space-y-4">{error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" /><pre className="whitespace-pre-wrap font-mono text-sm text-red-600 dark:text-red-400">{error}</pre></div></div>}{output && <div className="rounded-lg bg-[#1e1e1e] p-4"><pre className="max-h-[300px] overflow-auto whitespace-pre-wrap font-mono text-sm text-green-400">{output}</pre></div>}</div></CardContent></Card>}

        <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">{copy.explain}</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2"><div><h4 className="mb-2 font-medium">{copy.support}</h4><ul className="space-y-1 text-muted-foreground"><li>System.out.println → console.log</li><li>Data types → let</li><li>Math methods kept</li><li>String methods kept</li><li>Array operations kept</li><li>final → const</li></ul></div><div><h4 className="mb-2 font-medium">{copy.manual}</h4><ul className="space-y-1 text-muted-foreground"><li>Scanner input → manual variables</li><li>import → require</li><li>Class and method declarations</li><li>Access modifiers</li><li>Complex data types</li><li>Object-oriented code</li></ul></div></div><div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" /><p className="text-sm text-yellow-700 dark:text-yellow-400"><strong>{language === 'zh' ? '注意：' : 'Note:'}</strong> {copy.note}</p></div></div></CardContent></Card>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="text-lg">{copy.toolDesc}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p>{copy.t1}</p><p>{copy.t2}</p></CardContent></Card><Card><CardHeader><CardTitle className="text-lg">{copy.faq}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p><strong>Q:</strong> {copy.q1}<br /><strong>A:</strong> {copy.a1}</p><p><strong>Q:</strong> {copy.q2}<br /><strong>A:</strong> {copy.a2}</p></CardContent></Card></div>

      <CommentSection pageKey="java-to-node" />
    </ToolLayout>
  );
}
