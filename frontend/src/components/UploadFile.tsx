import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function UploadFile() {
  const { token, isAuthenticated } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('')

  if (!isAuthenticated) return null

  const handleUpload = async () => {
    if (!file || !token) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('http://localhost:9010/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    if (res.ok) {
      const data = await res.json()
      setStatus(`✅ Archivo subido con éxito: ${data.total} links`)
    } else {
      setStatus('❌ Error al subir archivo')
    }
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>📤 Subir archivo .txt</h2>
      <div style={uploadRow}>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={fileInputStyle}
        />
        <button onClick={handleUpload} style={uploadButtonStyle}>
          Subir
        </button>
      </div>
      {status && <p style={statusStyle}>{status}</p>}
    </div>
  )
}

// 🎨 Estilos

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '32px 24px',
  backgroundColor: '#fff',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#2c3e50',
}

const titleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '16px',
}

const uploadRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
}

const fileInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '6px 8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
}

const uploadButtonStyle: React.CSSProperties = {
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
}

const statusStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  marginTop: '8px',
  color: '#555',
}
