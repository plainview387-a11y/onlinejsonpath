import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { verifyToken } from '@/lib/auth';
import { addLocalComment, listLocalComments } from '@/lib/local-comment-store';

interface DbComment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  parent_id: string | null;
}

interface DbUser {
  id: string;
  nickname: string;
  avatar: string;
}

interface FormattedComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: DbUser;
  replies?: FormattedComment[];
}

function isSupabaseConfigError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Supabase');
}

// GET: 获取指定页面的评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    if (!pageKey) {
      return NextResponse.json(
        { error: '缺少页面标识' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * pageSize;
    let client;
    try {
      client = getSupabaseClient();
    } catch (error) {
      if (isSupabaseConfigError(error)) {
        return NextResponse.json({
          success: true,
          data: listLocalComments(pageKey, page, pageSize),
          mode: 'local',
        });
      }
      throw error;
    }

    // 获取顶级评论总数（parent_id 为 null）
    const { count, error: countError } = await client
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('page_key', pageKey)
      .is('parent_id', null);

    if (countError) {
      console.error('Get comments count error:', countError);
      return NextResponse.json(
        { error: '获取评论失败' },
        { status: 500 }
      );
    }

    // 获取顶级评论列表
    const { data: comments, error } = await client
      .from('comments')
      .select('id, content, created_at, updated_at, user_id, parent_id')
      .eq('page_key', pageKey)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Get comments error:', error);
      return NextResponse.json(
        { error: '获取评论失败' },
        { status: 500 }
      );
    }

    if (!comments || comments.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          comments: [],
          pagination: {
            page,
            pageSize,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
          },
        },
      });
    }

    // 获取所有顶级评论的ID
    const commentIds = comments.map(c => c.id);
    
    // 获取所有回复
    const { data: replies, error: repliesError } = await client
      .from('comments')
      .select('id, content, created_at, updated_at, user_id, parent_id')
      .in('parent_id', commentIds)
      .order('created_at', { ascending: true });

    if (repliesError) {
      console.error('Get replies error:', repliesError);
    }

    // 合并所有评论ID
    const topLevelComments = comments as DbComment[];
    const replyComments = (replies || []) as DbComment[];
    const allComments = [...topLevelComments, ...replyComments];
    const userIds = [...new Set(allComments.map(c => c.user_id))];
    
    // 批量查询用户信息
    const { data: users, error: usersError } = await client
      .from('users')
      .select('id, nickname, avatar')
      .in('id', userIds);

    if (usersError) {
      console.error('Get users error:', usersError);
    }

    // 构建用户映射
    const userMap: Record<string, { id: string; nickname: string; avatar: string }> = {};
    (users as DbUser[] | null)?.forEach((user) => {
      userMap[user.id] = {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      };
    });

    // 构建回复映射
    const repliesMap: Record<string, FormattedComment[]> = {};
    replyComments.forEach((reply) => {
      if (!reply.parent_id) return;
      if (!repliesMap[reply.parent_id]) {
        repliesMap[reply.parent_id] = [];
      }
      repliesMap[reply.parent_id].push({
        id: reply.id,
        content: reply.content,
        createdAt: reply.created_at,
        updatedAt: reply.updated_at,
        user: userMap[reply.user_id] || { id: reply.user_id, nickname: '未知用户', avatar: '' },
      });
    });

    // 格式化返回数据
    const formattedComments = topLevelComments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      user: userMap[comment.user_id] || { id: comment.user_id, nickname: '未知用户', avatar: '' },
      replies: repliesMap[comment.id] || [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        comments: formattedComments,
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// POST: 添加新评论或回复
export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: '登录已过期，请重新登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pageKey, content, parentId } = body;

    // 参数验证
    if (!pageKey || !content) {
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      );
    }

    // 内容长度限制
    if (content.length > 500) {
      return NextResponse.json(
        { error: '评论内容不能超过500字' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      );
    }

    let client;
    try {
      client = getSupabaseClient();
    } catch (error) {
      if (isSupabaseConfigError(error)) {
        const comment = addLocalComment({
          pageKey,
          content: content.trim(),
          parentId: parentId || null,
          user: {
            id: decoded.userId,
            nickname: decoded.nickname || decoded.email.split('@')[0] || '临时用户',
            avatar: decoded.avatar || '',
          },
        });

        if (!comment) {
          return NextResponse.json(
            { error: '回复的评论不存在' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: '评论发布成功',
          data: comment,
          mode: 'local',
        });
      }
      throw error;
    }

    let normalizedParentId = parentId || null;

    // 如果是回复，验证父评论存在；回复二级评论时归并到顶级评论，列表仍按两层展示
    if (parentId) {
      const { data: parentComment, error: parentError } = await client
        .from('comments')
        .select('id, page_key, parent_id')
        .eq('id', parentId)
        .single();

      if (parentError || !parentComment) {
        return NextResponse.json(
          { error: '回复的评论不存在' },
          { status: 400 }
        );
      }

      // 确保回复和父评论在同一页面
      if (parentComment.page_key !== pageKey) {
        return NextResponse.json(
          { error: '评论页面不匹配' },
          { status: 400 }
        );
      }

      normalizedParentId = parentComment.parent_id || parentComment.id;
    }

    // 插入评论
    const { data: comment, error } = await client
      .from('comments')
      .insert({
        user_id: decoded.userId,
        page_key: pageKey,
        content: content.trim(),
        parent_id: normalizedParentId,
      })
      .select('id, content, created_at, updated_at, user_id, parent_id')
      .single();

    if (error || !comment) {
      console.error('Create comment error:', error);
      return NextResponse.json(
        { error: '评论发布失败' },
        { status: 500 }
      );
    }

    // 获取用户信息
    const { data: user } = await client
      .from('users')
      .select('id, nickname, avatar')
      .eq('id', decoded.userId)
      .single();

    return NextResponse.json({
      success: true,
      message: '评论发布成功',
      data: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        parentId: comment.parent_id,
        user: user ? {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
        } : { id: decoded.userId, nickname: '未知用户', avatar: '' },
      },
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
