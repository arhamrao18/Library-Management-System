import axios from 'axios'

const memberApi = axios.create({
  baseURL: localStorage.getItem('apiBase') || 'http://127.0.0.1:8000/api/',
})

memberApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('memberAccessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue = []

function resolveQueue(newToken) {
  pendingQueue.forEach((cb) => cb(newToken))
  pendingQueue = []
}

memberApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('memberRefreshToken')

      if (!refreshToken) {
        localStorage.removeItem('memberAccessToken')
        localStorage.removeItem('memberRefreshToken')
        localStorage.removeItem('memberId')
        localStorage.removeItem('memberName')
        window.location.href = '/member/login'
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(memberApi(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        let base = localStorage.getItem('apiBase') || 'http://127.0.0.1:8000/api/'
        if (!base.endsWith('/')) base += '/'

        const res = await axios.post(base + 'token/refresh/', { refresh: refreshToken })
        const newAccessToken = res.data.access

        localStorage.setItem('memberAccessToken', newAccessToken)
        isRefreshing = false
        resolveQueue(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return memberApi(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        localStorage.removeItem('memberAccessToken')
        localStorage.removeItem('memberRefreshToken')
        window.location.href = '/member/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default memberApi