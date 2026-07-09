import { Navigate } from 'react-router-dom'

export default function MemberProtectedRoute({ children }) {
  const memberId = localStorage.getItem('memberId')
  if (!memberId) return <Navigate to="/member/login" replace />
  return children
}