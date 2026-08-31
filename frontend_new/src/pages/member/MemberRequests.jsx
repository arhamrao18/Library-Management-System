import { useEffect, useState } from 'react'
import memberApi from '../../memberApi.js'

export default function MemberRequests() {
  const [items, setItems] = useState([])

  async function load() {
    const res = await memberApi.get('member/requests/')
    setItems(res.data)
  }
  useEffect(() => { load() }, [])

  async function cancel(book_id) {
    await memberApi.delete(`member/requests/cancel/${book_id}/`)
    load()
  }
  async function returnBook(book_id) {
    await memberApi.post(`member/requests/return/${book_id}/`, {})
    load()
  }

  return (
    <div>
      <div className="page-header"><h2>My Requests</h2></div>
      <div className="card-grid">
        {items.map((i) => (
          <div className="book-card" key={i.book_id}>
            {i.image && <img src={i.image} alt={i.title} />}
            <div className="body">
              <p className="title">{i.title}</p>
              <p className="meta">{i.Author} · {i.Category}</p>
              <span className="qty-pill">{i.Status}</span>
              <div style={{ marginTop: 10 }}>
                {i.Status === 'Approved' && <button className="btn btn-small" onClick={() => returnBook(i.book_id)}>Return</button>}
                {i.Status === 'pending' && <button className="btn btn-danger btn-small" onClick={() => cancel(i.book_id)}>Cancel Request</button>}
                {i.Status === 'Returned Request' && <button className="btn btn-small" disabled>In Process…</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}