import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false) }
    else router.push('/login')
  }

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one"><img src="/assets/images/shape1.svg" alt="" className="_shape_img" /></div>
      <div className="_shape_two"><img src="/assets/images/shape2.svg" alt="" className="_shape_img" /></div>
      <div className="_shape_three"><img src="/assets/images/shape3.svg" alt="" className="_shape_img" /></div>

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <img src="/assets/images/registration.png" alt="" />
            </div>
            <div className="col-lg-4">
              <div className="_social_registration_content">
                <img src="/assets/images/logo.svg" alt="Logo" className="_right_logo _mar_b28" />
                <p className="_mar_b8">Get Started Now</p>
                <h4 className="_titl4 _mar_b50">Registration</h4>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={submit}>
                  {[
                    { label: 'First Name', key: 'firstName', type: 'text' },
                    { label: 'Last Name', key: 'lastName', type: 'text' },
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'Password', key: 'password', type: 'password' },
                  ].map(({ label, key, type }) => (
                    <div key={key} className="_social_registration_form_input _mar_b14">
                      <label className="_social_registration_label _mar_b8">{label}</label>
                      <input
                        type={type} required
                        className="form-control _social_registration_input"
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="_mar_t40 _mar_b60">
                    <button type="submit" className="_btn1" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </form>

                <p>Already have an account? <Link href="/login">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}