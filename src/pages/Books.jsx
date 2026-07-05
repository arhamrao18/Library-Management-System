import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'

export default function Books() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Loading books…')
  const [statusType, setStatusType] = useState('')

  async function loadBooks(q = '') {
    setStatus('Loading books…')
    setStatusType('')
    try {
      const res = await api.get('books/', { params: q ? { q } : {} })
      setBooks(res.data)
      setStatus(`${res.data.length} book(s) found`)
      setStatusType('ok')
    } catch (err) {
      setStatus('Could not load books. Check that Django + CORS are running.')
      setStatusType('err')
    }
  }

  useEffect(() => { loadBooks() }, [])

  function handleSearch(e) {
    e.preventDefault()
    loadBooks(query)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this book?')) return
    try {
      await api.delete(`books/${id}/`)
      loadBooks(query)
    } catch {
      setStatus('Failed to delete book')
      setStatusType('err')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Books</h2>
          <p>Browse and manage the library catalog</p>
        </div>
        <Link to="/books/add" className="btn btn-primary">+ Add Book</Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="Search by title, author, or category…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1 }} />
        <button type="submit" className="btn">Search</button>
      </form>

      <div className={`status-msg ${statusType}`}>{status}</div>

      {books.length === 0 ? (
        <div className="empty-state">No books found.</div>
      ) : (
        <div className="card-grid">
          {books.map((b) => (
            <div className="book-card" key={b.id}>
              {b.image && <img src={b.image} alt={b.title} />}
              <div className="body">
                <p className="title">{b.title}</p>
                <p className="meta">{b.Author} · {b.Category}</p>
                <span className={`qty-pill ${b.Quantity <= 0 ? 'zero' : ''}`}>
                  {b.Quantity} in stock
                </span>
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(b.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
