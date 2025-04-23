import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import router from './src/routes/site.js' // Importera router
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// View engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

// Middleware
app.use(express.json()) // Lägg till för att hantera JSON-data
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'src', 'public')))
app.use('/', router)

// Dummy-kurser i minnet
let courses = [
  { id: 1, title: 'Tango Grundkurs', date: '2025-05-01' },
  { id: 2, title: 'Salsa Fortsättning', date: '2025-06-01' }
]

// Enkel hårdkodad inloggning
app.post('/login', (req, res) => {
  const { username, password } = req.body

  if (username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD) {
    // Skicka tillbaka en session-token eller flagga
    res.json({ 
      success: true,
      isAdmin: true // Denna flagga kan användas på klienten
    })
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Fel användarnamn eller lösenord'
    })
  }
})

// WebSocket-hantering
io.on('connection', (socket) => {
  console.log('Användare ansluten via Socket.IO')

  // Skicka kurser direkt vid anslutning
  socket.emit('courses', courses)

  // Hantera inloggning via Socket.IO (alternativ till HTTP POST)
  socket.on('login', ({ username, password }, callback) => {
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
      // Spara att användaren är admin i socket-sessionen
      socket.isAdmin = true
      callback({ success: true, isAdmin: true })
    } else {
      callback({ success: false, message: 'Ogiltiga uppgifter' })
    }
  })

  // Lägg till kurs (endast för admin)
  socket.on('addCourse', (course) => {
    if (!socket.isAdmin) {
      return socket.emit('error', 'Ingen behörighet')
    }
    
    const newCourse = { 
      id: Date.now(), 
      ...course 
    }
    courses.push(newCourse)
    io.emit('courses', courses)
  })

  // Ta bort kurs (endast för admin)
  socket.on('deleteCourse', (id) => {
    if (!socket.isAdmin) {
      return socket.emit('error', 'Ingen behörighet')
    }
    
    courses = courses.filter(c => c.id !== id)
    io.emit('courses', courses)
  })

  // Uppdatera kurs (endast för admin)
  socket.on('updateCourse', (updatedCourse) => {
    if (!socket.isAdmin) {
      return socket.emit('error', 'Ingen behörighet')
    }
    
    courses = courses.map(c => 
      c.id === updatedCourse.id ? updatedCourse : c
    )
    io.emit('courses', courses)
  })

  socket.on('disconnect', () => {
    console.log('Användare kopplades bort')
  })
})

// Starta server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})