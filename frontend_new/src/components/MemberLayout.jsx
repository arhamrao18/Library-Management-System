import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function MemberLayout() {
  const navigate = useNavigate()
  function handleLogout() {
    localStorage.removeItem('memberId')
    localStorage.removeItem('memberName')
    navigate('/member/login')
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Stacks</div>
        <div className="brand-sub">Member Portal</div>
        <NavLink to="/member/books" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Books</NavLink>
        <NavLink to="/member/requests" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>My Requests</NavLink>
        <NavLink to="/member/profile" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Profile</NavLink>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  )
}