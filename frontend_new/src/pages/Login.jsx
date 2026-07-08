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
      if (err.response && err.response.status === 400) {
        setStatus('Invalid username or password')
      } else if (err.request && !err.response) {
        setStatus('Could not reach API. Check the URL and that Django + CORS are running.')
      } else {
        setStatus('Login failed. Please try again.')
      }
      setStatusType('err')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Stacks</h1>
        <div className="brand-sub-dark">Library Manager — Sign In</div>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#7a6f5c', display: 'block', marginBottom: 5 }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#7a6f5c', display: 'block', marginBottom: 5 }}>Password</label>
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
  )
}
