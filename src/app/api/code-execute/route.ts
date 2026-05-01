import { NextResponse } from 'next/server';

interface ExecuteRequest {
  code: string;
}

export async function POST(request: Request) {
  try {
    const { code }: ExecuteRequest = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: '请提供有效的代码' },
        { status: 400 }
      );
    }

    // 限制代码长度
    if (code.length > 10000) {
      return NextResponse.json(
        { success: false, error: '代码长度不能超过10000字符' },
        { status: 400 }
      );
    }

    // 使用原生 vm 模块执行代码
    const vm = await import('vm');
    
    // 创建输出收集器
    const outputs: string[] = [];
    
    // 创建安全的 console 对象
    const safeConsole = {
      log: (...args: unknown[]) => outputs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')),
      error: (...args: unknown[]) => outputs.push('Error: ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')),
      warn: (...args: unknown[]) => outputs.push('Warning: ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')),
      info: (...args: unknown[]) => outputs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')),
    };

    // 创建沙箱环境
    const sandbox = {
      console: safeConsole,
      setTimeout: (fn: () => void, ms: number) => {
        if (ms > 5000) throw new Error('超时时间不能超过5秒');
        return setTimeout(fn, ms);
      },
      setInterval: (fn: () => void, ms: number) => {
        if (ms > 5000) throw new Error('间隔时间不能超过5秒');
        return setInterval(fn, ms);
      },
      clearTimeout,
      clearInterval,
      Math,
      JSON,
      Date,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Map,
      Set,
      WeakMap,
      WeakSet,
      Promise,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      encodeURI,
      decodeURI,
      encodeURIComponent,
      decodeURIComponent,
    };

    // 创建上下文
    const context = vm.createContext(sandbox);
    
    // 执行代码，设置超时
    let result;
    const timeout = setTimeout(() => {
      throw new Error('代码执行超时（超过5秒）');
    }, 5000);

    try {
      result = vm.runInContext(code, context, {
        timeout: 5000,
        displayErrors: true,
      });
    } finally {
      clearTimeout(timeout);
    }

    return NextResponse.json({
      success: true,
      output: outputs.join('\n'),
      result: result !== undefined ? String(result) : undefined,
    });

  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '代码执行失败',
    });
  }
}
