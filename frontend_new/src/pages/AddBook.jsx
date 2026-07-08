import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function AddBook() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', Author: '', p_date: '', Description: '', Category: '', Quantity: '',
  })
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
    setStatus('Saving book…')
    setStatusType('')

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    if (image) data.append('image', image)

    try {
      await api.post('books/', data)
      setStatus('Book added successfully')
      setStatusType('ok')
      setTimeout(() => navigate('/books'), 700)
    } catch (err) {
      setStatus('Failed to add book — check that all fields are filled correctly')
      setStatusType('err')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Add Book</h2>
          <p>Add a new title to the catalog</p>
        </div>
      </div>

      <div className="form-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="full">
              <label>Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label>Author</label>
              <input type="text" name="Author" value={form.Author} onChange={handleChange} required />
            </div>
            <div>
              <label>Category</label>
              <input type="text" name="Category" value={form.Category} onChange={handleChange} required />
            </div>
            <div>
              <label>Publish Date</label>
              <input type="date" name="p_date" value={form.p_date} onChange={handleChange} required />
            </div>
            <div>
              <label>Quantity</label>
              <input type="number" name="Quantity" min="0" value={form.Quantity} onChange={handleChange} required />
            </div>
            <div className="full">
              <label>Description</label>
              <textarea name="Description" value={form.Description} onChange={handleChange} required />
            </div>
            <div className="full">
              <label>Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Book'}
            </button>
          </div>
        </form>

        {status && <div className={`status-msg ${statusType}`} style={{ marginTop: 14 }}>{status}</div>}
      </div>
    </div>
  )
}
