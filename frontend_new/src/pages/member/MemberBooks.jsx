import { useEffect, useState } from 'react'
import api from '../../api.js'

export default function MemberBooks() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const memberId = localStorage.getItem('memberId')

  async function loadBooks(q = '') {
    const res = await api.get('member/books/', { params: q ? { q } : {} })
    setBooks(res.data)
  }
  useEffect(() => { loadBooks() }, [])

  async function handleBorrow(book_id) {
    try {
      await api.post('member/borrow/', { member_id: memberId, book_id })
      setStatus('Request submitted!'); setStatusType('ok')
    } catch (err) {
      setStatus(err.response?.data?.detail || 'Failed'); setStatusType('err')
    }
  }

  return (
    <div>
      <div className="page-header"><h2>Books</h2></div>
      <form className="search-bar" onSubmit={(e) => { e.preventDefault(); loadBooks(query) }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" style={{ flex: 1 }} />
        <button className="btn" type="submit">Search</button>
      </form>
      {status && <div className={`status-msg ${statusType}`}>{status}</div>}
      <div className="card-grid">
        {books.map((b) => (
          <div className="book-card" key={b.id}>
            {b.image && <img src={b.image} alt={b.title} />}
            <div className="body">
              <p className="title">{b.title}</p>
              <p className="meta">{b.Author} · {b.Category} · Qty: {b.Quantity}</p>
              <button className="btn btn-primary btn-small" onClick={() => handleBorrow(b.id)}>Borrow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}