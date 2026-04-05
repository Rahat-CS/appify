import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { ...form, redirect: false })
    if (res.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/feed')
    }
  }

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      {/* shapes */}
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
      </div>

      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <img src="/assets/images/login.png" alt="" className="_left_img" />
            </div>
            <div className="col-lg-4">
              <div className="_social_login_content">
                <img src="/assets/images/logo.svg" alt="Logo" className="_left_logo _mar_b28" />
                <p className="_mar_b8">Welcome back</p>
                <h4 className="_titl4 _mar_b50">Login to your account</h4>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={submit} className="_social_login_form">
                  <div className="_social_login_form_input _mar_b14">
                    <label className="_social_login_label _mar_b8">Email</label>
                    <input
                      type="email" required
                      className="form-control _social_login_input"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="_social_login_form_input _mar_b14">
                    <label className="_social_login_label _mar_b8">Password</label>
                    <input
                      type="password" required
                      className="form-control _social_login_input"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                  <div className="_mar_t40 _mar_b60">
                    <button type="submit" className="_btn1" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login now'}
                    </button>
                  </div>
                </form>

                <p>Don't have an account? <Link href="/register">Create New Account</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}