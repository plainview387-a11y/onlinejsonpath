import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    // 从 header 获取 token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token 无效或已过期' },
        { status: 401 }
      );
    }

    try {
      const client = getSupabaseClient();
      const { data: user } = await client
        .from('users')
        .select('id, email, nickname, avatar, created_at')
        .eq('id', decoded.userId)
        .single();

      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            userId: user.id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            createdAt: user.created_at,
          },
        });
      }
    } catch {
      // ignore DB read issues and fall back to token payload
    }

    return NextResponse.json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
