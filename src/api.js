import axios from 'axios'

const api = axios.create({
  baseURL: localStorage.getItem('apiBase') || 'http://127.0.0.1:8000/api/',
})

// Attach the saved token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

// If the token is rejected, clear it and send the user back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
