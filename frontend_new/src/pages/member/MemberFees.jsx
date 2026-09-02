import { useEffect, useState } from 'react'
import memberApi from '../../memberApi.js'

export default function MemberFees() {
  const [fees, setFees] = useState([])
  const [status, setStatus] = useState('Loading your fees…')
  const [statusType, setStatusType] = useState('')

  async function loadFees() {
    setStatus('Loading your fees…')
    setStatusType('')
    try {
      const res = await memberApi.get('member/fees/')
      setFees(res.data)
      setStatus('')
    } catch {
      setStatus('Could not load your fees.')
      setStatusType('err')
    }
  }

  useEffect(() => { loadFees() }, [])

  // The most recent fee that still needs to be paid, if any
  const currentDue = fees.find(f => f.status !== 'Paid')

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>My Fees</h2>
          <p>Your monthly membership fee history</p>
        </div>
      </div>

      {status && <div className={`status-msg ${statusType}`}>{status}</div>}

      {currentDue && (
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem', border: currentDue.status === 'Overdue' ? '1px solid #e33' : '1px solid #eab308' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            {currentDue.status === 'Overdue' ? 'Overdue Payment' : 'Payment Due'}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0.3rem 0' }}>
            Rs. {currentDue.total_due} — {currentDue.month}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.6rem' }}>
            Due by {currentDue.due_date}
            {Number(currentDue.fine_amount) > 0 && ` (includes Rs. ${currentDue.fine_amount} late fine)`}
          </div>
          {/* Pay Now button — will be wired to Stripe in the next step */}
          <button className="btn btn-primary">Pay Now</button>
        </div>
      )}

      {fees.length === 0 ? (
        <div className="empty-state">No fee records yet.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Fine</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f.id}>
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