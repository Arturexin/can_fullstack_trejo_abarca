import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        Bienvenido{user ? `, ${user.email}` : ''} al sistema de análisis de noticias
      </h1>

      <p style={paragraphStyle}>
        Este sistema te permite analizar noticias de manera automatizada a partir de enlaces web.
        Desde la carga de archivos hasta la búsqueda semántica con inteligencia artificial, todo en un solo lugar.
      </p>

      <ol style={tutorialListStyle}>
        <li><strong>📤 Subir archivo:</strong> Carga un archivo <code>.txt</code> que contenga una lista de URLs (una por línea).</li>
        <li><strong>🔎 Procesamiento:</strong> El sistema extrae el contenido de cada enlace para su análisis posterior.</li>
        <li><strong>🧠 Generar embeddings:</strong> Ejecuta esta opción para vectorizar los textos con IA y permitir búsqueda semántica.</li>
        <li><strong>🔍 Buscar:</strong> Escribe una consulta en lenguaje natural y recupera resultados relevantes desde tu base de datos.</li>
      </ol>

      <p style={footerStyle}>
        Usa el menú superior para navegar por las secciones y comenzar el análisis. ¡Explora el poder de la inteligencia semántica!
      </p>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '32px 24px',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#2c3e50',
  backgroundColor: '#fefefe',
}

const titleStyle: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 'bold',
  marginBottom: '16px',
}

const paragraphStyle: React.CSSProperties = {
  marginBottom: '20px',
  fontSize: '1rem',
  color: '#444',
}

const tutorialListStyle: React.CSSProperties = {
  marginBottom: '24px',
  paddingLeft: '20px',
  color: '#333',
  lineHeight: '1.7',
  fontSize: '0.98rem',
}

const footerStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#666',
}