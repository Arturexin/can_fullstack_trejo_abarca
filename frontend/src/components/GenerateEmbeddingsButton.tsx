
import { useAuth } from '../context/AuthContext'

export default function GenerateEmbeddingsButton() {
  const { token, user } = useAuth()

  const handleInit = async () => {
    if (!token || !user) return

    const res = await fetch('http://localhost:9030/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user.id }),
    })

    if (res.ok) {
      alert('Embeddings generados correctamente')
    } else {
      alert('Error al generar embeddings')
    }
  }

  return (
    <button onClick={handleInit} style={buttonStyle}>
      🔄 Generar Embeddings
    </button>
  )
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#2ecc71',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
}

