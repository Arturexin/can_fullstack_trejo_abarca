import { Pool } from 'pg'

export const pool = new Pool({
  host: 'postgres',
  user: 'postgres',
  password: 'postgres',
  database: 'noticias_db',
  port: 5432,
})
// export const pool = new Pool({
//   host: 'localhost',
//   user: 'postgres',
//   password: 'Luter123.',
//   database: 'postgres',
//   port: 5432,
// })
