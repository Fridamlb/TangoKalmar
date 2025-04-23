import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import router from './src/routes/site.js' // Importera router

const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

// Använder router för alla routes
app.use('/', router)

// Statiska filer
app.use(express.static(path.join(__dirname, 'src', 'public')))

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});