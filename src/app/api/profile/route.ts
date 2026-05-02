import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { generateAvatarForSeed, generateToken, hashPassword, verifyPassword, verifyToken } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: '登录已过期，请重新登录' }, { status: 401 });
    }

    const body = await request.json();
    const nickname = String(body.nickname || '').trim();
    const avatar = String(body.avatar || '').trim();
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');

    const client = getSupabaseClient();
    const { data: existingUser, error: userError } = await client
      .from('users')
      .select('id, email, password, nickname, avatar, created_at')
      .eq('id', decoded.userId)
      .single();

    if (userError || !existingUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const updates: Record<string, string> = {};

    if (nickname) {
      if (nickname.length < 2 || nickname.length > 20) {
        return NextResponse.json({ error: '昵称长度需在 2 到 20 个字符之间' }, { status: 400 });
      }
      updates.nickname = nickname;
    }

    if (avatar) {
      updates.avatar = avatar;
    }

    if (!avatar && body.regenerateAvatar === true) {
      updates.avatar = generateAvatarForSeed(`${existingUser.email}-${Date.now()}`);
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: '修改密码时必须填写当前密码' }, { status: 400 });
      }

      const isValid = await verifyPassword(currentPassword, existingUser.password);
      if (!isValid) {
        return NextResponse.json({ error: '当前密码错误' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: '新密码至少需要 6 位' }, { status: 400 });
      }

      updates.password = await hashPassword(newPassword);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: '没有需要更新的内容' }, { status: 400 });
    }

    const { data: updatedUser, error: updateError } = await client
      .from('users')
      .update(updates)
      .eq('id', decoded.userId)
      .select('id, email, nickname, avatar, created_at')
      .single();

    if (updateError || !updatedUser) {
      return NextResponse.json({ error: '更新资料失败' }, { status: 500 });
    }

    const nextToken = generateToken(updatedUser.id, updatedUser.email, updatedUser.nickname, updatedUser.avatar || '');

    return NextResponse.json({
      success: true,
      message: '资料更新成功',
      token: nextToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        avatar: updatedUser.avatar || '',
        createdAt: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
