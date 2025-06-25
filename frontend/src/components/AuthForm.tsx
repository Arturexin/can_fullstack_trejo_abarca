import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AuthForm() {
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const payload =
      mode === 'register'
        ? { email, password, name }
        : { email, password }

    const res = await fetch(`http://localhost:9010/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (mode === 'login') {
      if (data.state === 'success') {
        login(data.token, data.user)
        navigate('/') // Redirigir al dashboard
      }
      alert(data.message)
    } else if (mode === 'register') {
      if (data.state === 'success') {
        setMode('login')
        setPassword('')
      }
      alert(data.message)
    }
    
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div style={formBox}>
      <h2 style={formTitle}>{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h2>

      <label style={labelStyle}>Correo electrónico</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        placeholder="usuario@ejemplo.com"
      />

      <label style={labelStyle}>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
        placeholder="••••••••"
      />

      <button onClick={handleSubmit} style={submitButton}>
        {mode === 'login' ? 'Entrar' : 'Registrar'}
      </button>

      <p style={{ marginTop: '16px', fontSize: '0.9rem' }}>
        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
        </button>
      </p>
    </div>
  )
}

const formBox: React.CSSProperties = {
  maxWidth: '400px',
  margin: '40px auto',
  padding: '32px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  backgroundColor: '#ffffff',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#2c3e50',
}

const formTitle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '24px',
  textAlign: 'center',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: 500,
  fontSize: '0.95rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '16px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
  boxSizing: 'border-box',
}

const submitButton: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
}

const logoutButton: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#e74c3c',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.95rem',
}
