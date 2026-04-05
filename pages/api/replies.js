import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const userId = session.user.id

  if (req.method === 'GET') {
    const { commentId } = req.query
    const replies = await prisma.reply.findMany({
      where: { commentId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        likes: { select: { userId: true } },
        _count: { select: { likes: true } }
      }
    })
    return res.json(replies.map(r => ({
      ...r,
      likedByMe: r.likes.some(l => l.userId === userId),
      likeCount: r._count.likes
    })))
  }

  if (req.method === 'POST') {
    const { commentId, content } = req.body
    const reply = await prisma.reply.create({
      data: { content, commentId, authorId: userId },
      include: { author: { select: { id: true, firstName: true, lastName: true } } }
    })
    return res.status(201).json({ ...reply, likedByMe: false, likeCount: 0 })
  }

  if (req.method === 'PATCH') {
    const { replyId } = req.body
    const existing = await prisma.replyLike.findUnique({
      where: { userId_replyId: { userId, replyId } }
    })
    if (existing) {
      await prisma.replyLike.delete({ where: { userId_replyId: { userId, replyId } } })
    } else {
      await prisma.replyLike.create({ data: { userId, replyId } })
    }
    const likeCount = await prisma.replyLike.count({ where: { replyId } })
    return res.json({ likedByMe: !existing, likeCount })
  }

  res.status(405).end()
}