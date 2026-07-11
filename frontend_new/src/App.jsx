import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Books from './pages/Books.jsx'
import AddBook from './pages/AddBook.jsx'
import Members from './pages/Members.jsx'
import AddMember from './pages/AddMember.jsx'
import BorrowRequests from './pages/BorrowRequests.jsx'
import Borrowed from './pages/Borrowed.jsx'
import Returns from './pages/Returns.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import MemberLogin from './pages/member/MemberLogin.jsx'
import MemberBooks from './pages/member/MemberBooks.jsx'
import MemberRequests from './pages/member/MemberRequests.jsx'
import MemberProfile from './pages/member/MemberProfile.jsx'
import MemberLayout from './components/MemberLayout.jsx'
import MemberProtectedRoute from './components/MemberProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Landing dashboard: choose Manager or Member */}
      <Route path="/" element={<Home />} />

      {/* Manager auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="books" element={<Books />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="members" element={<Members />} />
        <Route path="members/add" element={<AddMember />} />
        <Route path="borrow-requests" element={<BorrowRequests />} />
        <Route path="borrowed" element={<Borrowed />} />
        <Route path="returns" element={<Returns />} />
      </Route>

      {/* Member auth */}
      <Route path="/member/login" element={<MemberLogin />} />
      <Route path="/member" element={<MemberProtectedRoute><MemberLayout /></MemberProtectedRoute>}>
        <Route index element={<Navigate to="/member/books" replace />} />
        <Route path="books" element={<MemberBooks />} />
        <Route path="requests" element={<MemberRequests />} />
        <Route path="profile" element={<MemberProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}