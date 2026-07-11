import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const icons = {
  books: <path d="M4 19V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14M4 19a2 2 0 0 0 2 2h12M8 8h6M8 12h6" strokeLinecap="round" strokeLinejoin="round"/>,
  inbox: <path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" strokeLinecap="round" strokeLinejoin="round"/>,
  profile: <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" strokeLinejoin="round"/>,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>,
}
const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">{d}</svg>
)

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
        <NavLink to="/member/books" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.books} />Books</NavLink>
        <NavLink to="/member/requests" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.inbox} />My Requests</NavLink>
        <NavLink to="/member/profile" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.profile} />Profile</NavLink>
        <button className="logout-btn" onClick={handleLogout}><Icon d={icons.logout} />Logout</button>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  )
}