import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ error: 'All fields required' })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ error: 'Email already in use' })

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { firstName, lastName, email, password: hashed } })
  res.status(201).json({ ok: true })
}