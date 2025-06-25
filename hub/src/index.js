
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import fileRoutes from './routes/fileRoutes.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use('/', authRoutes)
app.use('/', fileRoutes)

app.get('/', (req, res) => res.send('Hub API funcionando'))

app.listen(9010, () => console.log('Hub corriendo en http://localhost:9010'))
