import { useState } from 'react'

export default function PostComposer({ onPost }) {
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState('PUBLIC')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!content.trim()) return
    setLoading(true)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, visibility })
    })
    const post = await res.json()
    onPost(post)
    setContent('')
    setLoading(false)
  }

  return (
    <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b16">
      <textarea
        className="form-control _textarea"
        placeholder="Write something..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
          value={visibility}
          onChange={e => setVisibility(e.target.value)}
        >
          <option value="PUBLIC">🌍 Public</option>
          <option value="PRIVATE">🔒 Private</option>
        </select>
        <button className="_btn1" onClick={submit} disabled={loading} style={{ marginLeft: 'auto' }}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}