import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="landing-wrap">
      <div className="landing-glow" />
      <div className="landing-card">
        <div className="landing-badge">📚 Library Management System</div>
        <h1 className="landing-title">Stacks</h1>
        <p className="landing-sub">Manage books, members &amp; borrowing — all in one place.</p>

        <div className="role-grid">
          <Link to="/login" className="role-card">
            <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 19V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19a2 2 0 0 0 2 2h12" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 8h6M8 12h6" strokeLinecap="round"/>
            </svg>
            <div className="role-name">Manager</div>
            <div className="role-desc">Manage catalog, members &amp; requests</div>
            <span className="role-arrow">→</span>
          </Link>

          <Link to="/member/login" className="role-card">
            <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="role-name">Member</div>
            <div className="role-desc">Browse books &amp; track your requests</div>
            <span className="role-arrow">→</span>
          </Link>
        </div>

        <div className="landing-footer">Continue as Manager or Member to sign in</div>
      </div>
    </div>
  )
}