import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<Books />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="members" element={<Members />} />
        <Route path="members/add" element={<AddMember />} />
        <Route path="borrow-requests" element={<BorrowRequests />} />
        <Route path="borrowed" element={<Borrowed />} />
        <Route path="returns" element={<Returns />} />
      </Route>

      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  )
}
