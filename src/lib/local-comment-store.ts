interface LocalCommentRecord {
  id: string;
  pageKey: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LocalCommentUser {
  id: string;
  nickname: string;
  avatar: string;
}

interface LocalCommentResponse {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: LocalCommentUser;
  replies?: LocalCommentResponse[];
}

const localComments: LocalCommentRecord[] = [];

function createId(): string {
  return `local-comment-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toResponse(comment: LocalCommentRecord): LocalCommentResponse {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: {
      id: comment.userId,
      nickname: comment.userNickname,
      avatar: comment.userAvatar,
    },
  };
}

export function listLocalComments(pageKey: string, page: number, pageSize: number) {
  const topLevelComments = localComments
    .filter((comment) => comment.pageKey === pageKey && !comment.parentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const offset = (page - 1) * pageSize;
  const pagedComments = topLevelComments.slice(offset, offset + pageSize);

  const comments = pagedComments.map((comment) => {
    const replies = localComments
      .filter((reply) => reply.parentId === comment.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(toResponse);

    return {
      ...toResponse(comment),
      replies,
    };
  });

  return {
    comments,
    pagination: {
      page,
      pageSize,
      total: topLevelComments.length,
      totalPages: Math.ceil(topLevelComments.length / pageSize),
    },
  };
}

export function addLocalComment({
  pageKey,
  content,
  parentId,
  user,
}: {
  pageKey: string;
  content: string;
  parentId: string | null;
  user: LocalCommentUser;
}) {
  let normalizedParentId = parentId;

  if (parentId) {
    const parentComment = localComments.find((comment) => comment.id === parentId);
    if (!parentComment || parentComment.pageKey !== pageKey) {
      return null;
    }
    normalizedParentId = parentComment.parentId || parentComment.id;
  }

  const now = new Date().toISOString();
  const comment: LocalCommentRecord = {
    id: createId(),
    pageKey,
    userId: user.id,
    userNickname: user.nickname,
    userAvatar: user.avatar,
    content,
    parentId: normalizedParentId,
    createdAt: now,
    updatedAt: now,
  };

  localComments.push(comment);

  return {
    ...toResponse(comment),
    parentId: comment.parentId,
  };
}

export function listLocalUserComments(userId: string, page: number, pageSize: number) {
  const pageNames: Record<string, string> = {
    jsonpath: 'JSONPath 解析',
    base64: 'Base64 加解密',
    timestamp: '时间戳转换',
    'json-escape': 'JSON 转义',
    'text-stats': '文本统计',
    'image-base64': '图片 Base64',
    'ip-query': 'IP 查询',
    'java-to-node': 'Java 转 Node',
  };

  const userComments = localComments
    .filter((comment) => comment.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const offset = (page - 1) * pageSize;
  const comments = userComments.slice(offset, offset + pageSize).map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    pageKey: comment.pageKey,
    pageName: pageNames[comment.pageKey] || comment.pageKey,
    isReply: Boolean(comment.parentId),
  }));

  return {
    comments,
    pagination: {
      page,
      pageSize,
      total: userComments.length,
      totalPages: Math.ceil(userComments.length / pageSize),
    },
  };
}
