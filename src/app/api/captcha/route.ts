import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 生成随机验证码文本
function generateCode(length: number = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除容易混淆的字符
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 生成SVG验证码图片
function generateSvg(code: string): string {
  const width = 120;
  const height = 40;
  const fontSize = 28;
  
  // 随机颜色
  const randomColor = () => `rgb(${Math.floor(Math.random() * 100)},${Math.floor(Math.random() * 100)},${Math.floor(Math.random() * 100)})`;
  
  // 生成干扰线
  let lines = '';
  for (let i = 0; i < 4; i++) {
    const x1 = Math.floor(Math.random() * width);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * width);
    const y2 = Math.floor(Math.random() * height);
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${randomColor()}" stroke-width="1" opacity="0.5"/>`;
  }
  
  // 生成干扰点
  let dots = '';
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    dots += `<circle cx="${x}" cy="${y}" r="1" fill="${randomColor()}" opacity="0.5"/>`;
  }
  
  // 生成每个字符
  let chars = '';
  const charWidth = width / (code.length + 1);
  code.split('').forEach((char, i) => {
    const x = charWidth * (i + 0.8);
    const y = height / 2 + fontSize / 3;
    const rotate = (Math.random() - 0.5) * 30; // 随机旋转角度
    const color = randomColor();
    chars += `<text x="${x}" y="${y}" 
      font-family="Arial, sans-serif" 
      font-size="${fontSize}" 
      font-weight="bold"
      fill="${color}" 
      transform="rotate(${rotate} ${x} ${y - fontSize/3})"
    >${char}</text>`;
  });
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    ${lines}
    ${dots}
    ${chars}
  </svg>`;
}

export async function GET() {
  try {
    // 生成验证码
    const code = generateCode(4);
    const svg = generateSvg(code);

    // 将验证码文本加密生成token（有效期5分钟）
    const token = jwt.sign(
      { code: code.toLowerCase(), timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    return NextResponse.json({
      success: true,
      captcha: svg,
      token,
    });
  } catch (error) {
    console.error('Generate captcha error:', error);
    return NextResponse.json(
      { error: '生成验证码失败' },
      { status: 500 }
    );
  }
}
