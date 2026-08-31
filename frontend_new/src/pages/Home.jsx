export default function Home() {
  return (
    <div className="home-page">
      {/* ===== HERO ===== */}
      <section className="home-hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="home-dots" />

        <div className="home-kicker">✦ Library Management System</div>

        <h1 className="home-title">Stacks</h1>
        <p className="home-subtitle">
          A quiet, beautiful place to manage books, members &amp; borrowing —
          crafted for libraries that care about the details.
        </p>

        <div className="book-float-row" aria-hidden="true">
          <span className="fbook fb1" />
          <span className="fbook fb2" />
          <span className="fbook fb3" />
          <span className="fbook fb4" />
          <span className="fbook fb5" />
        </div>

        <a href="#choose-portal" className="home-scroll-cue">
          <span>Enter the library</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* ===== SHELF DIVIDER ===== */}
      <div className="shelf-wrap" aria-hidden="true">
        <div className="shelf-row">
          {[22,34,26,40,18,30,24,36,20,28,32,24,38,22,30,26,34,20,28,24].map((h, i) => (
            <span key={i} className={`shelf-bar sb-${i % 6}`} style={{ height: h + 8 }} />
          ))}
        </div>
        <div className="shelf-line" />
      </div>

      {/* ===== STATS ===== */}
      <section className="stats-row">
        <div className="stat-item">
          <div className="stat-num">1000+</div>
          <div className="stat-label">Books Catalogued</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">JWT</div>
          <div className="stat-label">Secure Authentication</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">24/7</div>
          <div className="stat-label">Member Self-Service</div>
        </div>
      </section>

      {/* ===== CHOOSE PORTAL ===== */}
      <section className="cta-section" id="choose-portal">
        <div className="cta-kicker">Continue as</div>
        <h2 className="cta-title">Who's checking in today?</h2>
        <p className="cta-sub">Choose your portal to sign in and get started.</p>

        <div className="role-grid-v2">
          <a href="/login" className="role-card-v2">
            <div className="role-glow" />
            <svg className="role-icon-v2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19a2 2 0 0 0 2 2h12" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 8h6M8 12h6" strokeLinecap="round"/>
            </svg>
            <div className="role-name-v2">Manager</div>
            <div className="role-desc-v2">Manage the catalog, members, borrow requests &amp; returns</div>
            <span className="role-cta">Sign in as Manager <b>→</b></span>
          </a>

          <a href="/member/login" className="role-card-v2">
            <div className="role-glow" />
            <svg className="role-icon-v2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="role-name-v2">Member</div>
            <div className="role-desc-v2">Browse the catalog, request books &amp; track your requests</div>
            <span className="role-cta">Sign in as Member <b>→</b></span>
          </a>
        </div>
      </section>

      <footer className="home-footer">
        <span>📚 Stacks</span> — thoughtfully designed for modern libraries
      </footer>
    </div>
  )
}