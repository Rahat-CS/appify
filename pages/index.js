import { getServerSideProps as gSSP } from 'next-auth/next'
export default function Home() { return null }
export async function getServerSideProps(ctx) {
  const { getServerSession } = await import('next-auth')
  const authOptions = (await import('./api/auth/[...nextauth]')).default
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  return { redirect: { destination: session ? '/feed' : '/login', permanent: false } }
}