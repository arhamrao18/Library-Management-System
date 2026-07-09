import { useEffect, useState } from 'react'
import api from '../../api.js'

export default function MemberProfile() {
  const [data, setData] = useState(null)
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const memberId = localStorage.getItem('memberId')

  useEffect(() => {
    api.get('member/profile/', { params: { member_id: memberId } }).then((res) => setData(res.data))
  }, [])

  async function changePassword(e) {
    e.preventDefault()
    try {
      const res = await api.post('member/change-password/', { member_id: memberId, ...form })
      setStatus(res.data.detail); setStatusType('ok')
    } catch (err) {
      setStatus(err.response?.data?.detail || 'Failed'); setStatusType('err')
    }
  }

  if (!data) return <div>Loading…</div>

  return (
    <div>
      <div className="page-header"><h2>Profile</h2></div>
      <p><strong>ID:</strong> {data.m_id}</p>
      <p><strong>Name:</strong> {data.Name}</p>
      <p><strong>Email:</strong> {data.Email}</p>
      <p><strong>Address:</strong> {data.Address}</p>

      <h3 style={{ marginTop: 20 }}>Change Password</h3>
      <form onSubmit={changePassword}>
        <input type="password" placeholder="Old Password" value={form.old_password} onChange={(e) => setForm({ ...form, old_password: e.target.value })} required />
        <input type="password" placeholder="New Password" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} required />
        <input type="password" placeholder="Confirm Password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} required />
        <button className="btn btn-primary" type="submit">Update Password</button>
      </form>
      {status && <div className={`status-msg ${statusType}`}>{status}</div>}
    </div>
  )
}