import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import helmet from 'helmet'

import router from './src/routes/site.js'
import courseRoutes from './src/routes/courses.js'

dotenv.config()

const app = express()
const server = createServer(app)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(helmet.frameguard()) // Skyddar mot clickjacking
app.use(helmet.noSniff()) // Förhindrar MIME-sniffing

// MongoDB-anslutning
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Ansluten till MongoDB'))
  .catch(err => console.error('MongoDB anslutningsfel:', err))

// View engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'src', 'public')))

// Routes
app.use('/', router)
app.use('/courses', courseRoutes)

// JWT-inloggning
/**
 * Generates a JSON Web Token (JWT) for a user.
 *
 * @param {string} userId - The ID of the user.
 * @param {boolean} isAdmin - Whether the user is an admin.
 * @returns {string} The generated JWT.
 */
const generateToken = (userId, isAdmin) => {
  return jwt.sign(
    { id: userId, isAdmin },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  )
}

app.post('/login', (req, res) => {
  const { username, password } = req.body

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = generateToken('admin_user', true)
    res.json({ success: true, token, isAdmin: true })
  } else {
    res.status(401).json({
      success: false,
      message: 'Fel användarnamn eller lösenord'
    })
  }
})

// Starta server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

// För tester
export default app
