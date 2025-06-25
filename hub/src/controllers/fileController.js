import fs from 'fs'
import { pool } from '../db.js'

export const uploadFile = async (req, res) => {
  try {
    const file = req.file
    const userId = req.userId
    const content = fs.readFileSync(file.path, 'utf-8')
    const links = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('http'))

    const client = await pool.connect()

    const result = await client.query(
      'INSERT INTO files (user_id, filename, total_links, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, file.originalname, links.length, 'pending']
    )
    const fileId = result.rows[0].id

    for (const link of links) {
      await client.query(
        'INSERT INTO links (file_id, url, status) VALUES ($1, $2, $3)',
        [fileId, link, 'pending']
      )
    }

    // Llamar al scraper para iniciar el procesamiento
    await fetch('http://scraper:9020/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_id: fileId })
    })

    client.release()
    res.status(200).json({ message: 'Archivo procesado', fileId, total: links.length })
  } catch (err) {
    console.error('Error al subir archivo:', err)
    res.status(500).json({ error: 'Error al subir archivo' })
  }
}

export const getFiles = async (req, res) => {
  const userId = req.userId

  try {
    const result = await pool.query(
      `SELECT id, filename, upload_date, status, total_links
       FROM files
       WHERE user_id = $1
       ORDER BY upload_date DESC`,
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener archivos' })
  }
}

export const getFileLinks = async (req, res) => {
  const fileId = req.params.fileId
  const userId = req.userId

  try {
    // Validar que el archivo pertenezca al usuario
    const check = await pool.query(
      'SELECT id FROM files WHERE id = $1 AND user_id = $2',
      [fileId, userId]
    )
    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Acceso denegado a este archivo' })
    }

    const result = await pool.query(`
      SELECT 
        l.id AS link_id,
        l.url,
        l.status,
        s.title,
        s.body
      FROM links l
      LEFT JOIN scraped_content s ON s.link_id = l.id
      WHERE l.file_id = $1
      ORDER BY l.id ASC
    `, [fileId])

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener links' })
  }
}

