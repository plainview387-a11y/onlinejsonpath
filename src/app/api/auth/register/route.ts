import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { hashPassword, generateRandomAvatar, generateLocalUser, generateToken } from '@/lib/auth';
import { verifyCaptcha } from '@/lib/captcha';
import { isAdminEmail } from '@/lib/admin';

function isSupabaseConfigError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Supabase');
}

function createLocalRegisterResponse(email: string, nickname: string) {
  const user = generateLocalUser(email, nickname);
  const token = generateToken(user.id, user.email, user.nickname, user.avatar);

  return NextResponse.json({
    success: true,
    message: '临时注册成功',
    token,
    user,
    mode: 'local',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nickname, captchaToken, captchaCode } = body;

    // 验证码校验
    const captchaResult = verifyCaptcha(captchaToken, captchaCode);
    if (!captchaResult.valid) {
      return NextResponse.json(
        { error: captchaResult.error },
        { status: 400 }
      );
    }

    // 参数验证
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 密码强度验证
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少6位' },
        { status: 400 }
      );
    }

    let client;
    try {
      client = getSupabaseClient();
    } catch (error) {
      if (isSupabaseConfigError(error)) {
        return createLocalRegisterResponse(email, nickname);
      }
      throw error;
    }

    // 检查邮箱是否已存在
    const { data: existingUser } = await client
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);
    
    // 生成随机头像
    const avatar = generateRandomAvatar();

    // 创建用户
    const { data: user, error } = await client
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        nickname,
        avatar,
      })
      .select('id, email, nickname, avatar, created_at')
      .single();

    if (error || !user) {
      console.error('Create user error:', error);
      return NextResponse.json(
        { error: '注册失败，请稍后重试' },
        { status: 500 }
      );
    }

    const token = generateToken(user.id, user.email, user.nickname, user.avatar);

    return NextResponse.json({
      success: true,
      message: '注册成功',
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
    console.error('Register error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
