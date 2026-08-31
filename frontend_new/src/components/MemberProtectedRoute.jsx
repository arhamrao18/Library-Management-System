import { Navigate } from 'react-router-dom'

export default function MemberProtectedRoute({ children }) {
  const token = localStorage.getItem('memberAccessToken')
  if (!token) return <Navigate to="/member/login" replace />
  return children
}