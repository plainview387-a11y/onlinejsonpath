import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { verifyPassword, generateToken, generateLocalUser } from '@/lib/auth';
import { verifyCaptcha } from '@/lib/captcha';
import { isAdminEmail } from '@/lib/admin';

function isSupabaseConfigError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Supabase');
}

function createLocalLoginResponse(email: string) {
  const user = generateLocalUser(email);
  const token = generateToken(user.id, user.email, user.nickname, user.avatar);

  return NextResponse.json({
    success: true,
    message: '临时登录成功',
    token,
    user,
    mode: 'local',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, captchaToken, captchaCode } = body;

    // 验证码校验
    const captchaResult = verifyCaptcha(captchaToken, captchaCode);
    if (!captchaResult.valid) {
      return NextResponse.json(
        { error: captchaResult.error },
        { status: 400 }
      );
    }

    // 参数验证
    if (!email || !password) {
      return NextResponse.json(
        { error: '请填写邮箱和密码' },
        { status: 400 }
      );
    }

    let client;
    try {
      client = getSupabaseClient();
    } catch (error) {
      if (isSupabaseConfigError(error)) {
        return createLocalLoginResponse(email);
      }
      throw error;
    }

    // 查找用户
    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: '账号不存在' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 生成 Token
    const token = generateToken(user.id, user.email, user.nickname, user.avatar);

    return NextResponse.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        createdAt: user.created_at,
        isAdmin: isAdminEmail(user.email),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
