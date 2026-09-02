import { useEffect, useState } from 'react'
import api from '../api.js'

export default function Returns() {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('Loading…')
  const [statusType, setStatusType] = useState('')

  async function loadRequests() {
    setStatus('Loading return requests…')
    setStatusType('')
    try {
      const res = await api.get('borrowed/', { params: { status: 'Returned Request' } })
      setRequests(res.data)
      setStatus(`${res.data.length} return request(s)`)
      setStatusType('ok')
    } catch {
      setStatus('Could not load data. Check that Django + CORS are running.')
      setStatusType('err')
    }
  }

  useEffect(() => { loadRequests() }, [])

    async function handleApproveReturn(id) {
    try {
      const res = await api.patch(`borrowed/${id}/approve_return/`)
      const fine = Number(res.data.fine_amount || 0)
      if (fine > 0) {
        setStatus(`Return confirmed. Late fine of Rs. ${fine} applies.`)
      } else {
        setStatus('Return confirmed. No fine — returned on time.')
      }
      setStatusType('ok')
      loadRequests()
    } catch {
      setStatus('Failed to approve return')
      setStatusType('err')
    }
  }
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Return Requests</h2>
          <p>Members waiting for their return to be confirmed</p>
        </div>
      </div>

      <div className={`status-msg ${statusType}`}>{status}</div>

      {requests.length === 0 ? (
        <div className="empty-state">No return requests.</div>
      ) : (
               <table>
          <thead>
            <tr>
              <th>Req ID</th>
              <th>Member</th>
              <th>Email</th>
              <th>Book</th>
              <th>Due Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.b_id}>
                <td>{r.b_id}</td>
                <td>{r.Name}</td>
                <td>{r.Email}</td>
                <td>{r.Book}</td>
                <td>
                  {r.due_date || '-'}
                  {r.is_overdue && <span style={{ color: '#b91c1c', marginLeft: 6, fontSize: '0.8rem' }}>(Late)</span>}
                </td>
                <td><span className="pill returned">{r.Status}</span></td>
                <td><button className="btn btn-primary btn-small" onClick={() => handleApproveReturn(r.b_id)}>Confirm Return</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
