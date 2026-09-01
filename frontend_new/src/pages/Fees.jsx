import { useEffect, useState } from 'react'
import api from '../api.js'

export default function Fees() {
  const [fees, setFees] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [status, setStatus] = useState('Loading fees…')
  const [statusType, setStatusType] = useState('')
  const [generating, setGenerating] = useState(false)

  async function loadFees(filter = '') {
    setStatus('Loading fees…')
    setStatusType('')
    try {
      const res = await api.get('fees/', { params: filter ? { status: filter } : {} })
      setFees(res.data)
      setStatus(`${res.data.length} fee record(s) found`)
      setStatusType('ok')
    } catch {
      setStatus('Could not load fees. Check that Django + CORS are running.')
      setStatusType('err')
    }
  }

  useEffect(() => { loadFees() }, [])

  function handleFilterChange(e) {
    const value = e.target.value
    setStatusFilter(value)
    loadFees(value)
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      await api.post('fees/generate/')
      setStatus('Fee generation completed successfully.')
      setStatusType('ok')
      loadFees(statusFilter)
    } catch {
      setStatus('Failed to generate fees.')
      setStatusType('err')
    } finally {
      setGenerating(false)
    }
  }

  // Totals for the quick summary cards at the top
  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + Number(f.amount), 0)
  const totalOutstanding = fees.filter(f => f.status !== 'Paid').reduce((sum, f) => sum + Number(f.total_due), 0)
  const overdueCount = fees.filter(f => f.status === 'Overdue').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Membership Fees</h2>
          <p>Track monthly fee payments across all members</p>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
          {generating ? 'Generating…' : 'Generate This Month\'s Fees'}
        </button>
      </div>

      {/* Quick summary cards */}
      <div className="summary-cards" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card" style={{ padding: '1rem', flex: 1 }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Total Collected</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Rs. {totalCollected}</div>
        </div>
        <div className="card" style={{ padding: '1rem', flex: 1 }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Outstanding</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Rs. {totalOutstanding}</div>
        </div>
        <div className="card" style={{ padding: '1rem', flex: 1 }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Overdue Members</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{overdueCount}</div>
        </div>
      </div>

      <div className="search-bar">
        <select value={statusFilter} onChange={handleFilterChange} style={{ flex: 1 }}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className={`status-msg ${statusType}`}>{status}</div>

      {fees.length === 0 ? (
        <div className="empty-state">No fee records found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Month</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Fine</th>
              <th>Total Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f.id}>
                <td>{f.member_name}</td>
                <td>{f.member_email}</td>
                <td>{f.month}</td>
                <td>{f.due_date}</td>
                <td>Rs. {f.amount}</td>
                <td>{Number(f.fine_amount) > 0 ? `Rs. ${f.fine_amount}` : '-'}</td>
                <td>Rs. {f.total_due}</td>
                <td>
                  <span className={
                    f.status === 'Paid' ? 'badge badge-success' :
                    f.status === 'Overdue' ? 'badge badge-danger' : 'badge badge-warning'
                  }>
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}