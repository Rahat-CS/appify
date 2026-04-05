import { useState, useEffect } from 'react'

export default function CommentSection({ postId, currentUserId }) {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [replies, setReplies] = useState({}) // { commentId: [] }
  const [replyInput, setReplyInput] = useState({}) // { commentId: text }
  const [showReplies, setShowReplies] = useState({})

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then(r => r.json()).then(setComments)
  }, [postId])

  const addComment = async () => {
    if (!content.trim()) return
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content })
    })
    const c = await res.json()
    setComments(p => [...p, c])
    setContent('')
  }

  const likeComment = async (commentId, likedByMe) => {
    const res = await fetch('/api/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId })
    })
    const data = await res.json()
    setComments(p => p.map(c => c.id === commentId
      ? { ...c, likedByMe: data.likedByMe, likeCount: data.likeCount } : c))
  }

  const loadReplies = async (commentId) => {
    if (!showReplies[commentId]) {
      const res = await fetch(`/api/replies?commentId=${commentId}`)
      const data = await res.json()
      setReplies(p => ({ ...p, [commentId]: data }))
    }
    setShowReplies(p => ({ ...p, [commentId]: !p[commentId] }))
  }

  const addReply = async (commentId) => {
    const text = replyInput[commentId]
    if (!text?.trim()) return
    const res = await fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, content: text })
    })
    const r = await res.json()
    setReplies(p => ({ ...p, [commentId]: [...(p[commentId] || []), r] }))
    setReplyInput(p => ({ ...p, [commentId]: '' }))
  }

  const likeReply = async (replyId, commentId) => {
    const res = await fetch('/api/replies', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyId })
    })
    const data = await res.json()
    setReplies(p => ({
      ...p,
      [commentId]: p[commentId].map(r => r.id === replyId
        ? { ...r, likedByMe: data.likedByMe, likeCount: data.likeCount } : r)
    }))
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Add comment */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          className="form-control form-control-sm"
          placeholder="Write a comment..."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ borderRadius: 20 }}
        />
        <button className="_btn1" style={{ fontSize: 13, padding: '4px 16px' }} onClick={addComment}>
          Post
        </button>
      </div>

      {/* Comments */}
      {comments.map(c => (
        <div key={c.id} style={{ marginBottom: 12 }}>
          <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '8px 12px' }}>
            <strong style={{ fontSize: 13 }}>{c.author.firstName} {c.author.lastName}</strong>
            <p style={{ margin: '2px 0 0', fontSize: 14 }}>{c.content}</p>
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4, display: 'flex', gap: 12 }}>
            <button onClick={() => likeComment(c.id, c.likedByMe)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: c.likedByMe ? '#e0245e' : '#888' }}>
              {c.likedByMe ? '❤️' : '🤍'} {c.likeCount} Like
            </button>
            <button onClick={() => loadReplies(c.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#888' }}>
              Reply {c.replyCount > 0 ? `(${c.replyCount})` : ''}
            </button>
          </div>

          {/* Replies */}
          {showReplies[c.id] && (
            <div style={{ marginLeft: 24, marginTop: 8 }}>
              {(replies[c.id] || []).map(r => (
                <div key={r.id} style={{ marginBottom: 8 }}>
                  <div style={{ background: '#f0f0f0', borderRadius: 8, padding: '6px 10px' }}>
                    <strong style={{ fontSize: 12 }}>{r.author.firstName} {r.author.lastName}</strong>
                    <p style={{ margin: '2px 0 0', fontSize: 13 }}>{r.content}</p>
                  </div>
                  <button onClick={() => likeReply(r.id, c.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: r.likedByMe ? '#e0245e' : '#888' }}>
                    {r.likedByMe ? '❤️' : '🤍'} {r.likeCount} Like
                  </button>
                </div>
              ))}
              {/* Reply input */}
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <input
                  className="form-control form-control-sm"
                  placeholder="Write a reply..."
                  value={replyInput[c.id] || ''}
                  onChange={e => setReplyInput(p => ({ ...p, [c.id]: e.target.value }))}
                  style={{ borderRadius: 20, fontSize: 13 }}
                />
                <button onClick={() => addReply(c.id)}
                  style={{ background: 'none', border: 'none', color: '#377dff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}