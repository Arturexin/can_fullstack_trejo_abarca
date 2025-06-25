import { useState, useEffect } from 'react'
import FileLinks from './FileLinks'
import { useAuth } from '../context/AuthContext'

export default function FileList() {
  const { token, isAuthenticated } = useAuth()
  const [files, setFiles] = useState<any[]>([])
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)

  useEffect(() => {
    if (!token) return

    fetch('http://localhost:9010/files', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(() => alert('Error al cargar archivos'))
  }, [token])

  if (!isAuthenticated) return null

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>📁 Archivos subidos</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Cantidad de enlaces</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Links</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id} style={rowStyle}>
              <td>{new Date(file.upload_date).toLocaleString()}</td>
              <td>{file.filename}</td>
              <td>{file.total_links}</td>
              <td>{file.status}</td>
              <td>
                <button
                  onClick={() => setSelectedFileId(file.id)}
                  style={linkButtonStyle}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFileId && <FileLinks fileId={selectedFileId} />}
    </div>
  )
}

// 🎨 Estilos personalizados

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '32px 24px',
  backgroundColor: '#fff',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#2c3e50',
}

const titleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '16px'
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  marginBottom: '24px',
  fontSize: '0.95rem',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
}

const theadStyle: React.CSSProperties = {
  backgroundColor: '#3498db',
  color: '#fff',
  textAlign: 'left',
}

const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderBottom: '1px solid #dbe9f4',
  fontWeight: 600,
  letterSpacing: '0.3px',
}

const rowStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#ffffff',
  transition: 'background-color 0.2s ease',
}

const linkButtonStyle: React.CSSProperties = {
  color: '#2980b9',
  background: 'none',
  border: '1px solid transparent',
  borderRadius: '4px',
  padding: '4px 10px',
  fontSize: '0.9rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'color 0.2s ease',
}