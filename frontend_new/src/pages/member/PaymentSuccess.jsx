import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import memberApi from '../../memberApi.js'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('Confirming your payment…')
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function confirm() {
      const sessionId = searchParams.get('session_id')
      const feeId = searchParams.get('fee_id')

      if (!sessionId || !feeId) {
        setStatus('Missing payment information.')
        setError(true)
        return
      }

      try {
        const res = await memberApi.post('member/fees/confirm-payment/', {
          session_id: sessionId,
          fee_id: feeId,
        })
        setReceipt(res.data)
        setStatus('Payment confirmed!')
      } catch (err) {
        setStatus(err.response?.data?.detail || 'Could not confirm payment.')
        setError(true)
      }
    }
    confirm()
  }, [searchParams])

  return (
    <div>
      <div className="page-header"><h2>Payment Status</h2></div>

      <div className={`status-msg ${error ? 'err' : 'ok'}`}>{status}</div>

      {receipt && (
        <div className="card" style={{ padding: '1.5rem', maxWidth: 420, marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Receipt</h3>
          <p><strong>Receipt ID:</strong> {receipt.receipt_id}</p>
          <p><strong>Month:</strong> {receipt.month}</p>
          <p><strong>Amount Paid:</strong> Rs. {receipt.total_due}</p>
          <p><strong>Paid On:</strong> {new Date(receipt.paid_date).toLocaleString()}</p>
          <p><strong>Status:</strong> {receipt.status}</p>
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/member/fees" className="btn btn-primary">Back to My Fees</Link>
      </div>
    </div>
  )
}