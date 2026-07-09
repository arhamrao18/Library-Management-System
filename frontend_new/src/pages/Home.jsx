import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Stacks</h1>
        <div className="brand-sub-dark">Library Manager</div>
        <p style={{ margin: '18px 0' }}>Continue as:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/admin/login" className="btn btn-primary">Admin Login</Link>
          <Link to="/member/login" className="btn">Member Login</Link>
        </div>
      </div>
    </div>
  )
}