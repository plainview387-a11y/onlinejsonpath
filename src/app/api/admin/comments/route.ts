import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { isAdminEmail } from '@/lib/admin';
import { getRequestUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  if (!isAdminEmail(user.email)) return NextResponse.json({ error: '无权限访问' }, { status: 403 });

  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey') || '';
    const query = (searchParams.get('query') || '').trim();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const offset = (page - 1) * pageSize;

    let builder = client
      .from('comments')
      .select('id, content, created_at, updated_at, user_id, page_key, parent_id', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (pageKey) builder = builder.eq('page_key', pageKey);
    if (query) builder = builder.ilike('content', `%${query}%`);

    const { data: comments, error, count } = await builder.range(offset, offset + pageSize - 1);
    if (error) return NextResponse.json({ error: '获取评论失败' }, { status: 500 });

    const userIds = [...new Set((comments || []).map((item) => item.user_id))];
    const { data: users } = await client.from('users').select('id, email, nickname, avatar').in('id', userIds);
    const userMap = new Map((users || []).map((item) => [item.id, item]));

    return NextResponse.json({
      success: true,
      data: {
        comments: (comments || []).map((item) => ({
          id: item.id,
          content: item.content,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          pageKey: item.page_key,
          parentId: item.parent_id,
          isReply: !!item.parent_id,
          user: userMap.get(item.user_id) || { id: item.user_id, email: '', nickname: '未知用户', avatar: '' },
        })),
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('Admin comments error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
