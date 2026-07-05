import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'

export default function Members() {
  const [members, setMembers] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Loading members…')
  const [statusType, setStatusType] = useState('')

  async function loadMembers(q = '') {
    setStatus('Loading members…')
    setStatusType('')
    try {
      const res = await api.get('members/', { params: q ? { q } : {} })
      setMembers(res.data)
      setStatus(`${res.data.length} member(s) found`)
      setStatusType('ok')
    } catch {
      setStatus('Could not load members. Check that Django + CORS are running.')
      setStatusType('err')
    }
  }

  useEffect(() => { loadMembers() }, [])

  function handleSearch(e) {
    e.preventDefault()
    loadMembers(query)
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this member?')) return
    try {
      await api.delete(`members/${id}/`)
      loadMembers(query)
    } catch {
      setStatus('Failed to remove member')
      setStatusType('err')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Members</h2>
          <p>Registered library members</p>
        </div>
        <Link to="/members/add" className="btn btn-primary">+ Add Member</Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="Search by name or email…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1 }} />
        <button type="submit" className="btn">Search</button>
      </form>

      <div className={`status-msg ${statusType}`}>{status}</div>

      {members.length === 0 ? (
        <div className="empty-state">No members found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.m_id}>
                <td className="avatar-cell">{m.image && <img src={m.image} alt={m.Name} />}</td>
                <td>{m.m_id}</td>
                <td>{m.Name}</td>
                <td>{m.Email}</td>
                <td>{m.Address}</td>
                <td><button className="btn btn-danger btn-small" onClick={() => handleDelete(m.m_id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
