import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const icons = {
  books: <path d="M4 19V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14M4 19a2 2 0 0 0 2 2h12M8 8h6M8 12h6" strokeLinecap="round" strokeLinejoin="round"/>,
  add: <path d="M12 5v14M5 12h14" strokeLinecap="round"/>,
  members: <path d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 20v-1a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>,
  inbox: <path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" strokeLinecap="round" strokeLinejoin="round"/>,
  borrowed: <path d="M19 21 12 17l-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" strokeLinecap="round" strokeLinejoin="round"/>,
  returns: <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" strokeLinecap="round" strokeLinejoin="round"/>,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>,
}
const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">{d}</svg>
)

export default function Layout() {
  const navigate = useNavigate()
  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Stacks</div>
        <div className="brand-sub">Library Manager</div>

        <div className="nav-section">Catalog</div>
        <NavLink to="/books" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.books} />Books</NavLink>
        <NavLink to="/books/add" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.add} />Add Book</NavLink>

        <div className="nav-section">Members</div>
        <NavLink to="/members" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.members} />Members</NavLink>
        <NavLink to="/members/add" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.add} />Add Member</NavLink>

        <div className="nav-section">Borrowing</div>
        <NavLink to="/borrow-requests" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.inbox} />Borrow Requests</NavLink>
        <NavLink to="/borrowed" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.borrowed} />Borrowed</NavLink>
        <NavLink to="/returns" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}><Icon d={icons.returns} />Returns</NavLink>

        <button className="logout-btn" onClick={handleLogout}><Icon d={icons.logout} />Logout</button>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  )
}