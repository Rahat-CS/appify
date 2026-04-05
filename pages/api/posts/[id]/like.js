import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'  // like.js

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const userId = session.user.id
  const postId = req.query.id

  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId } }
  })

  if (existing) {
    await prisma.postLike.delete({ where: { userId_postId: { userId, postId } } })
  } else {
    await prisma.postLike.create({ data: { userId, postId } })
  }

  const likeCount = await prisma.postLike.count({ where: { postId } })
  res.json({ likedByMe: !existing, likeCount })
}