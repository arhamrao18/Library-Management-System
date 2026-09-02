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

                           {/* Show due date once the book has been approved/handed over */}
              {i.Status === 'Approved' && i.due_date && (
                <p style={{ fontSize: '0.85rem', marginTop: 6 }}>
                  Due by: <strong>{i.due_date}</strong>
                  {i.is_overdue && (
                    <span style={{ color: '#b91c1c', marginLeft: 6 }}>
                      (Overdue — fine may apply)
                    </span>
                  )}
                </p>
              )}

              {/* Show rejection message + reason from admin */}
              {i.Status === 'Rejected' && (
                <p style={{ fontSize: '0.85rem', marginTop: 6, color: '#b91c1c' }}>
                  Your request was cancelled by admin.<br />
                  Reason: <strong>{i.rejection_reason || 'No reason given'}</strong>
                </p>
              )}

              <div style={{ marginTop: 10 }}>
                {i.Status === 'Approved' && <button className="btn btn-small" onClick={() => returnBook(i.book_id)}>Return</button>}
                {i.Status === 'pending' && <button className="btn btn-danger btn-small" onClick={() => cancel(i.book_id)}>Cancel Request</button>}
                {i.Status === 'Returned Request' && <button className="btn btn-small" disabled>In Process…</button>}
                {i.Status === 'Rejected' && <button className="btn btn-small" onClick={() => cancel(i.book_id)}>Dismiss</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}