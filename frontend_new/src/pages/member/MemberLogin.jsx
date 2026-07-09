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
      <div className="login-card">
        <h1>Stacks</h1>
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
  )
}