import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const userId = session.user.id

  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({
      where: {
        OR: [{ visibility: 'PUBLIC' }, { authorId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        likes: { select: { userId: true } },
        _count: { select: { comments: true, likes: true } }
      }
    })
    const result = posts.map(p => ({
      ...p,
      likedByMe: p.likes.some(l => l.userId === userId),
      likeCount: p._count.likes,
      commentCount: p._count.comments,
    }))
    return res.json(result)
  }

  if (req.method === 'POST') {
    const { content, visibility, imageUrl } = req.body
    if (!content) return res.status(400).json({ error: 'Content required' })

    const post = await prisma.post.create({
      data: {
        content,
        visibility: visibility || 'PUBLIC',
        imageUrl,
        author: { connect: { id: userId } },   // ← fixed
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        likes: true,
        _count: { select: { comments: true, likes: true } }
      }
    })
    return res.status(201).json({ ...post, likedByMe: false, likeCount: 0, commentCount: 0 })
  }

  res.status(405).end()
}