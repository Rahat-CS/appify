import { getServerSession } from 'next-auth'
import authOptions from './api/auth/[...nextauth]'
import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import PostComposer from '@/components/PostComposer'
import PostCard from '@/components/PostCard'

export default function Feed() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])

  const loadPosts = () =>
    fetch('/api/posts').then(r => r.json()).then(setPosts)

  useEffect(() => { loadPosts() }, [])

  return (
    <div className="_layout _layout_main_wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-light _header_nav" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, background: '#fff', padding: '12px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <img src="/assets/images/logo.svg" alt="Logo" style={{ height: 32 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 500 }}>{session?.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-sm btn-outline-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="container" style={{ marginTop: 80, maxWidth: 680 }}>
        <PostComposer onPost={(p) => setPosts(prev => [p, ...prev])} />
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={session?.user?.id}
            onUpdate={(updated) => setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))}
          />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  return { props: {} }
}