import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Stacks</div>
        <div className="brand-sub">Library Manager</div>

        <div className="nav-section">Catalog</div>
        <NavLink to="/books" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Books</NavLink>
        <NavLink to="/books/add" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Add Book</NavLink>

        <div className="nav-section">Members</div>
        <NavLink to="/members" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Members</NavLink>
        <NavLink to="/members/add" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Add Member</NavLink>

        <div className="nav-section">Borrowing</div>
        <NavLink to="/borrow-requests" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Borrow Requests</NavLink>
        <NavLink to="/borrowed" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Borrowed</NavLink>
        <NavLink to="/returns" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Returns</NavLink>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
