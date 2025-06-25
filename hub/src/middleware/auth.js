import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

export const auth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' })

  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    res.status(403).json({ error: 'Token inválido' })
  }
}
