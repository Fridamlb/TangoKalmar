import express from 'express'
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js'

const router = express.Router()

// Offentliga routes
router.get('/', getCourses)

// Skyddade routes (kräver autentisering)
router.post('/', createCourse)
router.put('/:id', updateCourse)
router.delete('/:id', deleteCourse)

export default router
