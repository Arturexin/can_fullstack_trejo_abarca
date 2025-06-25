import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ddd',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/upload" style={linkStyle}>Subir</Link>
        <Link to="/files" style={linkStyle}>Archivos</Link>
        <Link to="/search" style={linkStyle}>Buscar</Link>
      </div>
      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
        style={{
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Cerrar sesión
      </button>
    </nav>
  )
}

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#2c3e50',
  fontSize: '1rem',
  fontWeight: 500,
  padding: '4px 0',
  transition: 'color 0.2s ease',
}

