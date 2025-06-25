import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
function validateCredentials(email, password, { checkPasswordLength = false } = {}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !password) {
    return { valid: false, message: 'Email y contraseña requeridos.' }
  }
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Formato de correo inválido.' }
  }
  if (checkPasswordLength && password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres.' }
  }
  return { valid: true }
}
// Registro de usuario
export const register = async (req, res) => {
  const { email, password } = req.body

  const validation = validateCredentials(email, password, { checkPasswordLength: true })
  if (!validation.valid) {
    return res.status(400).json({
      state: 'error',
      message: validation.message
    })
  }

  try {
    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hash]
    )

    res.status(201).json({ 
      state: 'success',
      message: 'Usuario registrado, vuelva a escribir su contraseña para iniciar sesión.', 
      userId: result.rows[0].id 
    })
  } catch (err) {
    console.error('Error en /register:', err)
    res.status(400).json({ 
      state: 'error',
      message: 'No se pudo registrar (¿correo duplicado?).' 
    })
  }
}

// Login
export const login = async (req, res) => {
  const { email, password } = req.body

  const validation = validateCredentials(email, password, { checkPasswordLength: true })
  if (!validation.valid) {
    return res.status(400).json({
      state: 'error',
      message: validation.message
    })
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        state: 'error',
        message: 'Usuario no encontrado o contraseña incorrecto.',
        })
    }

    const match = await bcrypt.compare(password, result.rows[0].password_hash)
    if (!match) {
      return res.status(401).json({ 
        state: 'error',
        message: 'Usuario no encontrado o contraseña incorrecto.',
      })
    }

    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '2h' })
    /* res.json({ token }) */
    res.json({
      state: 'success',
      message: 'Login exitoso.',
      token,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
      }
    })
  } catch (err) {
    console.error('Error en /login:', err)
    res.status(500).json({ 
      state: 'error',
      message: 'Error en login.'
    })
  }
}

