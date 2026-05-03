import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { isAdminEmail } from '@/lib/admin';
import { getRequestUser } from '@/lib/server-auth';

async function requireAdmin(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return { error: NextResponse.json({ error: '请先登录' }, { status: 401 }) };
  }
  if (!isAdminEmail(user.email)) {
    return { error: NextResponse.json({ error: '无权限访问' }, { status: 403 }) };
  }
  return { user };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

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
    const { data: users } = userIds.length > 0
      ? await client.from('users').select('id, email, nickname, avatar').in('id', userIds)
      : { data: [] };
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

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: '缺少评论 ID' }, { status: 400 });
    }

    const { data: comment, error: commentError } = await client
      .from('comments')
      .select('id, parent_id')
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 });
    }

    if (!comment.parent_id) {
      const { count, error: repliesError } = await client
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', commentId);

      if (repliesError) {
        return NextResponse.json({ error: '删除前检查回复失败' }, { status: 500 });
      }

      if ((count || 0) > 0) {
        return NextResponse.json({ error: '该主评论下已有回复，暂不支持直接删除' }, { status: 400 });
      }
    }

    const { error: deleteError } = await client.from('comments').delete().eq('id', commentId);
    if (deleteError) {
      return NextResponse.json({ error: '删除评论失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '评论删除成功', data: { id: commentId } });
  } catch (error) {
    console.error('Admin comments delete error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
