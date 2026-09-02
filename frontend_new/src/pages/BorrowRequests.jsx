import { useEffect, useState } from 'react'
import api from '../api.js'

export default function BorrowRequests() {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('Loading requests…')
  const [statusType, setStatusType] = useState('')

  async function loadRequests() {
    setStatus('Loading requests…')
    setStatusType('')
    try {
      const res = await api.get('borrowed/', { params: { status: 'pending' } })
      setRequests(res.data)
      setStatus(`${res.data.length} pending request(s)`)
      setStatusType('ok')
    } catch {
      setStatus('Could not load requests. Check that Django + CORS are running.')
      setStatusType('err')
    }
  }

  useEffect(() => { loadRequests() }, [])

  async function handleApprove(id) {
    try {
      await api.patch(`borrowed/${id}/approve/`)
      loadRequests()
    } catch {
      setStatus('Failed to approve request')
      setStatusType('err')
    }
  }

  async function handleReject(id) {
    const reason = window.prompt('Reason for rejecting this request (required):')
    if (reason === null) return // admin clicked Cancel on the prompt itself
    if (!reason.trim()) {
      window.alert('A reason is required to reject a request.')
      return
    }
    try {
      await api.patch(`borrowed/${id}/reject/`, { reason: reason.trim() })
      setStatus('Request rejected'); setStatusType('ok')
      loadRequests()
    } catch (err) {
      setStatus(err.response?.data?.detail || 'Failed to reject request')
      setStatusType('err')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Borrow Requests</h2>
          <p>Pending requests waiting for approval</p>
        </div>
      </div>

      <div className={`status-msg ${statusType}`}>{status}</div>

      {requests.length === 0 ? (
        <div className="empty-state">No pending requests.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Req ID</th>
              <th>Member</th>
              <th>Email</th>
              <th>Book</th>
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
                <td><span className="pill pending">{r.Status}</span></td>
                <td>
                  <button className="btn btn-primary btn-small" onClick={() => handleApprove(r.b_id)}>Approve</button>{' '}
                  <button className="btn btn-danger btn-small" onClick={() => handleReject(r.b_id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}