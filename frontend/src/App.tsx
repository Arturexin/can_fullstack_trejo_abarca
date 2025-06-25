import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './routes/Login'
import Dashboard from './routes/Dashboard'
import UploadView from './routes/UploadView'
import FilesView from './routes/FilesView'
import SearchView from './routes/SearchView'
import Navbar from './components/Navbar'

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/upload"
          element={isAuthenticated ? <UploadView /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/files"
          element={isAuthenticated ? <FilesView /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/search"
          element={isAuthenticated ? <SearchView /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  )
}
