# 🧠 Sistema de Análisis y Búsqueda Semántica de Noticias

Este proyecto permite a los usuarios cargar archivos `.txt` con enlaces a noticias, procesarlos automáticamente (scraping), generar **embeddings semánticos** y realizar búsquedas basadas en significado usando `pgvector` y `FAISS`.

---

## 🧩 Características Principales

- 📤 Subida de archivos `.txt` con múltiples enlaces.
- 🔁 Scraping automático del contenido de cada enlace.
- 🧠 Generación de embeddings (representaciones vectoriales) por usuario.
- 🔍 Búsqueda semántica personalizada (solo ves tus datos).
- 📊 Dashboard y resultados visuales.
- 🐳 Contenedores Docker con `DevContainer` listo para desarrollo.

---

## ⚙️ Tecnologías Utilizadas

- **Frontend:** Vite + React + TypeScript
- **Backend Principal (hub):** Node.js + Express + MySQL
- **Scraper y RAG:** Flask + Celery + Redis + PostgreSQL + pgvector
- **Embeddings y búsqueda:** FAISS + OpenAI/transformers
- **Base de datos:** PostgreSQL con extensión `pgvector`
- **Contenedores:** Docker + Docker Compose + DevContainer

---

## 📂 Estructura del Proyecto


├── frontend/           # Interfaz de usuario con React
├── hub/                # Backend Node.js (API principal)
├── scraper/            # Servicio Flask para scraping
├── rag/                # Servicio Flask para generación y búsqueda semántica
├── .devcontainer/      # Configuración para entorno de desarrollo en VSCode
├── docker-compose.yml  # Orquestador de servicios

🚀 Instalación Rápida
🔧 Requisitos
Docker

VSCode + extensión "Dev Containers" (opcional)

🏁 Pasos
# Clona el repositorio
  git clone https://github.com/tuusuario/mi-proyecto-noticias.git
  cd mi-proyecto-noticias

# Arranca todos los servicios
  docker-compose up --build
  La aplicación estará disponible en:
  
    Frontend: http://localhost:9999
    
    Backend Node: http://localhost:9010
    
    Scraper: http://localhost:9020
    
    RAG (búsqueda semántica): http://localhost:9030
    
    PostgreSQL: localhost:9040


📡 API Endpoints
Hub (Node.js)
Endpoint	Método	Descripción
/upload	POST	Subida de archivo .txt
/files	GET	Listado de archivos del usuario
/files/:id	GET	Links de un archivo específico

Scraper
Endpoint	Método	Descripción
/process	POST	Enviar links a Celery para scrapeo

RAG (Búsqueda Semántica)
Endpoint	Método	Descripción
/init	POST	Generar embeddings por user_id
/search	POST	Buscar semánticamente en tus links


🧪 Pruebas
Backends con Flask (scraper y rag)
# Ejecutar pruebas
  pytest
  Incluye pruebas para:
  
  /init (generación de embeddings)
  
  /search (búsqueda con y sin resultados)
  
  /process (envío de tareas a Celery)


👤 Autenticación
La autenticación es gestionada desde hub con JWT.

El token se envía en el Authorization header a scraper y rag.

💾 Base de Datos (PostgreSQL)
Esquema con las siguientes tablas:

users, files, links, scraped_content, embeddings

Usa la extensión pgvector para campos vectoriales (vector(768))

📌 Notas
Asegúrate de ejecutar /init tras subir y scrapear nuevos archivos.

Los embeddings y resultados son siempre por usuario.
