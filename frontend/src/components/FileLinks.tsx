import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface LinkInfo {
  link_id: number
  url: string
  status: string
  title: string | null
  body: string | null
}

export default function FileLinks({ fileId }: { fileId: number }) {
  const [links, setLinks] = useState<LinkInfo[]>([])
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return

    fetch(`http://localhost:9010/files/${fileId}/links`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(() => alert('Error al cargar links'))
  }, [fileId, token])

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>🔗 Links del archivo #{fileId}</h3>
      <ul style={listStyle}>
        {links.map(link => (
          <li key={link.link_id} style={cardStyle}>
            <p><strong>URL:</strong>{' '}
              <a href={link.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                {link.url}
              </a>
            </p>
            <p><strong>Estado:</strong> {link.status}</p>
            {link.title && (
              <>
                <p><strong>Título:</strong> {link.title}</p>
                <p style={bodyStyle}><strong>Contenido:</strong> {link.body}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 🎨 Estilos personalizados

const containerStyle: React.CSSProperties = {
  marginTop: '32px',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#2c3e50',
}

const titleStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 600,
  marginBottom: '16px',
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  paddingLeft: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const cardStyle: React.CSSProperties = {
  border: '1px solid #dce6f2',
  borderLeft: '4px solid #3498db',
  borderRadius: '6px',
  padding: '16px',
  backgroundColor: '#f8fbff',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
}

const linkStyle: React.CSSProperties = {
  color: '#3498db',
  textDecoration: 'none',
  fontWeight: 500,
}

const bodyStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#555',
  lineHeight: '1.5',
}

