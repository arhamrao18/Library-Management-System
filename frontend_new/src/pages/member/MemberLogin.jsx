import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api.js'

export default function MemberLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('Signing in…'); setStatusType('')
    try {
      const res = await api.post('member/login/', { email, password })
      localStorage.setItem('memberId', res.data.m_id)
      localStorage.setItem('memberName', res.data.Name)
      navigate('/member/books')
    } catch (err) {
      if (err.response) setStatus(err.response.data.detail || 'Login failed')
      else setStatus('Could not reach API. Check Django + CORS.')
      setStatusType('err')
    }
  }

  return (
    <div className="login-wrap">
      <div className="auth-card">
        <div className="auth-side">
          <div>
            <svg className="auth-side-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2>Member Portal</h2>
            <p>Browse the catalog, request books and keep track of your borrowing.</p>
          </div>
          <div className="auth-side-foot">Stacks · Member Access</div>
        </div>

        <div className="auth-form-wrap">
          <h1>Hello there</h1>
          <div className="brand-sub-dark">Member — Sign In</div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          {status && <div className={`status-msg ${statusType}`} style={{ marginTop: 14 }}>{status}</div>}
        </div>
      </div>
    </div>
  )
}