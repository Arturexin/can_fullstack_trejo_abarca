import { useState } from 'react'
import GenerateEmbeddingsButton from './GenerateEmbeddingsButton'
import { useAuth } from '../context/AuthContext'

interface Result {
  link_id: number
  title: string
  excerpt: string
}

export default function SemanticSearch() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setResults([])

    const res = await fetch('http://localhost:9030/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, user_id: user?.id }),
    })

    if (res.ok) {
      const data = await res.json()
      setResults(data)
    } else {
      alert('Error al buscar')
    }

    setLoading(false)
  }
  function highlightMatches(text: string, query: string) {
    if (!query) return text

    const keywords = query
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape regex

    if (keywords.length === 0) return text

    const regex = new RegExp(`(${keywords.join('|')})`, 'gi')

    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} style={{ backgroundColor: '#facc15' }}>{part}</mark> : part
    )
  }


  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <h2 style={titleStyle}>🔍 Búsqueda Semántica</h2>
        <GenerateEmbeddingsButton />
      </div>

      <div style={inputGroupStyle}>
        <input
          type="text"
          placeholder="Ej. comercio exterior"
          style={inputStyle}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} style={searchButtonStyle}>
          Buscar
        </button>
      </div>

      {loading && <p style={{ marginTop: '12px' }}>Buscando...</p>}

      {results.length > 0 && (
        <div>
          <h3 style={subtitleStyle}>Resultados:</h3>
          <ul style={listStyle}>
            {results.map((r) => (
              <li key={r.link_id} style={resultCardStyle}>
                <h4 style={resultTitleStyle}>{r.title || 'Sin título'}</h4>
                <p style={excerptStyle}>{highlightMatches(r.excerpt, query)}</p>

              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

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

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '20px',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
}

const searchButtonStyle: React.CSSProperties = {
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 500,
  marginBottom: '12px',
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  paddingLeft: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const resultCardStyle: React.CSSProperties = {
  padding: '16px',
  border: '1px solid #eee',
  borderRadius: '6px',
  backgroundColor: '#fafafa',
}

const resultTitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: '8px',
}

const excerptStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#555',
}
const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '16px',
}

