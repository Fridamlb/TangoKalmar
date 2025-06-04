import Course from '../models/course.js'

// GET /courses
/**
 * Retrieves all active courses from the database and sends them as a JSON response.
 *
 * @param {import('express').Response} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 */
export async function getCourses (req, res) {
  try {
    // Hämta alla aktiva kurser
    const courses = await Course.find({ active: true })
    res.json(courses)
  } catch (error) {
    res.status(500).json({
      message: 'Kunde inte hämta kurser',
      error: error.message
    })
  }
}

// POST /courses
/**
 * Deletes a course by its ID and sends a confirmation message or an error response.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function createCourse (req, res) {
  try {
    const newCourse = new Course(req.body)
    const savedCourse = await newCourse.save()
    res.status(201).json(savedCourse)
  } catch (error) {
    res.status(400).json({ message: 'Kunde inte skapa kurs', error })
  }
}

// PUT /courses/:id
/**
 * Updates a course by its ID and sends the updated course or an error response.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function updateCourse (req, res) {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Kurs hittades inte' })
    }
    res.json(updatedCourse)
  } catch (error) {
    res.status(400).json({ message: 'Kunde inte uppdatera kurs', error })
  }
}

// DELETE /courses/:id
/**
 * Deletes a course by its ID and sends a confirmation message or an error response.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function deleteCourse (req, res) {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id)
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Kurs hittades inte' })
    }
    res.json({ message: 'Kurs raderad' })
  } catch (error) {
    res.status(400).json({ message: 'Kunde inte radera kurs', error })
  }
}
