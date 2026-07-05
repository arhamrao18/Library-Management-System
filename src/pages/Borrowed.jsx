import { useEffect, useState } from 'react'
import api from '../api.js'

export default function Borrowed() {
  const [borrowed, setBorrowed] = useState([])
  const [status, setStatus] = useState('Loading…')
  const [statusType, setStatusType] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('borrowed/', { params: { status: 'Approved' } })
        setBorrowed(res.data)
        setStatus(`${res.data.length} book(s) currently borrowed`)
        setStatusType('ok')
      } catch {
        setStatus('Could not load data. Check that Django + CORS are running.')
        setStatusType('err')
      }
    }
    load()
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Borrowed Books</h2>
          <p>Books currently checked out by members</p>
        </div>
      </div>

      <div className={`status-msg ${statusType}`}>{status}</div>

      {borrowed.length === 0 ? (
        <div className="empty-state">No books are currently borrowed.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Req ID</th>
              <th>Member</th>
              <th>Email</th>
              <th>Book</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {borrowed.map((r) => (
              <tr key={r.b_id}>
                <td>{r.b_id}</td>
                <td>{r.Name}</td>
                <td>{r.Email}</td>
                <td>{r.Book}</td>
                <td><span className="pill approved">{r.Status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
