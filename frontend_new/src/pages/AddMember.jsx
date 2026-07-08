import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function AddMember() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ Name: '', Email: '', Password: '', Address: '' })
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setStatus('Saving member…')
    setStatusType('')

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    if (image) data.append('image', image)

    try {
      await api.post('members/', data)
      setStatus('Member added successfully')
      setStatusType('ok')
      setTimeout(() => navigate('/members'), 700)
    } catch (err) {
      setStatus('Failed to add member — check that all fields are filled correctly')
      setStatusType('err')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Add Member</h2>
          <p>Register a new library member</p>
        </div>
      </div>

      <div className="form-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="full">
              <label>Full Name</label>
              <input type="text" name="Name" value={form.Name} onChange={handleChange} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" name="Email" value={form.Email} onChange={handleChange} required />
            </div>
            <div>
              <label>Password</label>
              <input type="text" name="Password" value={form.Password} onChange={handleChange} required maxLength={10} />
            </div>
            <div className="full">
              <label>Address</label>
              <input type="text" name="Address" value={form.Address} onChange={handleChange} required />
            </div>
            <div className="full">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Member'}
            </button>
          </div>
        </form>

        {status && <div className={`status-msg ${statusType}`} style={{ marginTop: 14 }}>{status}</div>}
      </div>
    </div>
  )
}
