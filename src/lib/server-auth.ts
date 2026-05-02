import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function getRequestUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) return null;

  try {
    const client = getSupabaseClient();
    const { data: user } = await client
      .from('users')
      .select('id, email, nickname, avatar, created_at')
      .eq('id', decoded.userId)
      .single();

    if (user) {
      return {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar || '',
        createdAt: user.created_at,
      };
    }
  } catch {
    // ignore DB read failure, fall back to token payload
  }

  return {
    id: decoded.userId,
    email: decoded.email,
    nickname: decoded.nickname || decoded.email.split('@')[0] || '用户',
    avatar: decoded.avatar || '',
    createdAt: new Date().toISOString(),
  };
}
