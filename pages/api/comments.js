import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const userId = session.user.id

  if (req.method === 'GET') {
    const { postId } = req.query
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        likes: { select: { userId: true } },
        _count: { select: { likes: true, replies: true } }
      }
    })
    return res.json(comments.map(c => ({
      ...c,
      likedByMe: c.likes.some(l => l.userId === userId),
      likeCount: c._count.likes,
      replyCount: c._count.replies
    })))
  }

  if (req.method === 'POST') {
    const { postId, content } = req.body
    const comment = await prisma.comment.create({
      data: { content, postId, authorId: userId },
      include: { author: { select: { id: true, firstName: true, lastName: true } } }
    })
    return res.status(201).json({ ...comment, likedByMe: false, likeCount: 0, replyCount: 0 })
  }

  // PATCH for like toggle
  if (req.method === 'PATCH') {
    const { commentId } = req.body
    const existing = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } }
    })
    if (existing) {
      await prisma.commentLike.delete({ where: { userId_commentId: { userId, commentId } } })
    } else {
      await prisma.commentLike.create({ data: { userId, commentId } })
    }
    const likeCount = await prisma.commentLike.count({ where: { commentId } })
    return res.json({ likedByMe: !existing, likeCount })
  }

  res.status(405).end()
}