import { useState } from 'react'
import CommentSection from './CommentSection'

export default function PostCard({ post, currentUserId, onUpdate }) {
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [likedByMe, setLikedByMe] = useState(post.likedByMe)
  const [showComments, setShowComments] = useState(false)

  const toggleLike = async () => {
    setLikedByMe(p => !p)
    setLikeCount(p => likedByMe ? p - 1 : p + 1)
    const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
    const data = await res.json()
    setLikedByMe(data.likedByMe)
    setLikeCount(data.likeCount)
  }

  return (
    <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b16">
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <img src="/assets/images/profile.png" style={{ width: 40, height: 40, borderRadius: '50%' }} />
        <div>
          <strong>{post.author.firstName} {post.author.lastName}</strong>
          <div style={{ fontSize: 12, color: '#888' }}>
            {post.visibility === 'PRIVATE' ? '🔒 Private' : '🌍 Public'} ·{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p>{post.content}</p>

      <hr />

      <div style={{ display: 'flex', gap: 16 }}>
        <button
          onClick={toggleLike}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: likedByMe ? '#e0245e' : '#666', fontWeight: likedByMe ? 700 : 400 }}
        >
          {likedByMe ? '❤️' : '🤍'} {likeCount} Likes
        </button>
        <button
          onClick={() => setShowComments(p => !p)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
        >
          💬 {post.commentCount} Comments
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post.id} currentUserId={currentUserId} />
      )}
    </div>
  )
}