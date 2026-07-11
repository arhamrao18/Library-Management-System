import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [apiBase, setApiBase] = useState(localStorage.getItem('apiBase') || 'http://127.0.0.1:8000/api/')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus('Signing in…')
    setStatusType('')
    try {
      let base = apiBase.trim()
      if (!base.endsWith('/')) base += '/'
      const res = await axios.post(base + 'login/', { username, password })
      localStorage.setItem('accessToken', res.data.access)
      localStorage.setItem('refreshToken', res.data.refresh)
      localStorage.setItem('apiBase', base)
      setStatus('Login successful — redirecting…')
      setStatusType('ok')
      navigate('/books')
    } catch (err) {
      if (err.response && err.response.status === 400) setStatus('Invalid username or password')
      else if (err.request && !err.response) setStatus('Could not reach API. Check the URL and that Django + CORS are running.')
      else setStatus('Login failed. Please try again.')
      setStatusType('err')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="auth-card">
        <div className="auth-side">
          <div>
            <svg className="auth-side-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 19V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19a2 2 0 0 0 2 2h12" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 8h6M8 12h6" strokeLinecap="round"/>
            </svg>
            <h2>Manager Console</h2>
            <p>Manage catalog, members, borrow requests and returns from one dashboard.</p>
          </div>
          <div className="auth-side-foot">Stacks · Library Manager</div>
        </div>

        <div className="auth-form-wrap">
          <h1>Welcome back</h1>
          <div className="brand-sub-dark">Manager — Sign In</div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%' }} />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>
          {status && <div className={`status-msg ${statusType}`} style={{ marginTop: 14 }}>{status}</div>}
          <div className="api-base-field">
            <label>API base URL</label>
            <input type="text" value={apiBase} onChange={(e) => setApiBase(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}