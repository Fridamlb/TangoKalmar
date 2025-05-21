document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const elements = {
    showFormBtn: document.getElementById('show-form-btn'),
    addCourseForm: document.getElementById('add-course-form'),
    courseFormContainer: document.getElementById('course-form'),
    courseForm: document.getElementById('add-course-form'),
    clearFormBtn: document.getElementById('clear-form-btn'),
    coursesList: document.getElementById('courses-list-body'),
    publicCourseList: document.getElementById('public-course-list'),
    formFields: {
      id: document.getElementById('course-id'),
      title: document.getElementById('title'),
      description: document.getElementById('description'),
      weeks: document.getElementById('weeks'),
      lessonLength: document.getElementById('lessonLength'),
      price: document.getElementById('price'),
      teacher: document.getElementById('teacher'),
      saveBtn: document.getElementById('save-course-btn')
    }
  }

  let courses = [] // Local courses cache

  // Initialize the UI
  /**
   * Initializes the application by setting up event listeners, updating the UI, and fetching courses.
   */
  function init () {
    setupEventListeners()
    updateAdminUI()
    fetchCourses()
  }

  // Set up all event listeners
  /**
   * Sets up all event listeners for the application.
   */
  function setupEventListeners () {
    // Toggle course form visibility
    if (elements.showFormBtn && elements.addCourseForm) {
      elements.addCourseForm.style.display = 'none'
      elements.showFormBtn.textContent = 'Skapa ny kurs'

      elements.showFormBtn.addEventListener('click', () => {
        const visible = elements.addCourseForm.style.display === 'block'
        elements.addCourseForm.style.display = visible ? 'none' : 'block'
        elements.showFormBtn.textContent = visible ? 'Skapa ny kurs' : 'Dölj formulär'
      })
    }

    // Handle form submission
    if (elements.courseForm) {
      elements.courseForm.addEventListener('submit', handleFormSubmit)
    }

    // Clear form
    if (elements.clearFormBtn) {
      elements.clearFormBtn.addEventListener('click', resetForm)
    }

    // Update UI when storage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'isAdmin') updateAdminUI()
    })
  }

  // Update admin UI based on login status
  /**
   * Updates the admin UI based on the user's login status.
   */
  function updateAdminUI () {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (elements.courseFormContainer) {
      elements.courseFormContainer.style.display = isAdmin ? 'block' : 'none'
    }
  }

  // Fetch courses from server
  /**
   * Fetches the list of courses from the server and updates the UI.
   */
  async function fetchCourses () {
    try {
      const res = await fetch('/courses')

      if (!res.ok) {
        throw new Error(await res.text() || 'Kunde inte hämta kurser')
      }

      courses = await res.json()
      renderCourseLists()
    } catch (error) {
      console.error('Fel vid hämtning av kurser:', error)
      showNotification('Kunde inte hämta kurser', 'error')
      renderCourseLists([]) // Render empty lists
    }
  }

  // Render both admin and public course lists
  /**
   * Renders both the admin and public course lists using the provided courses.
   *
   * @param {string} coursesToRender - The list of courses to render in the UI.
   */
  function renderCourseLists (coursesToRender = courses) {
    renderAdminCourseList(coursesToRender)
    renderPublicCourseList(coursesToRender)
  }

  // Render admin course list
  /**
   * Renders the admin course list in the table format.
   *
   * @param {string} coursesToRender - The list of courses to render in the admin UI.
   */
  function renderAdminCourseList (coursesToRender) {
    if (!elements.coursesList) return

    elements.coursesList.innerHTML = coursesToRender.length === 0
      ? '<tr><td colspan="6">Inga kurser tillagda</td></tr>'
      : coursesToRender.map(course => `
        <tr>
          <td>${course.title}</td>
          <td>${course.weeks}</td>
          <td>${course.lessonLength || 60}</td>
          <td>${course.price} kr</td>
          <td>${course.teacher}</td>
          <td>
            <button class="edit-btn" data-id="${course._id}">Redigera</button>
            <button class="delete-btn" data-id="${course._id}">Ta bort</button>
          </td>
        </tr>
      `).join('')

    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editCourse(btn.getAttribute('data-id')))
    })

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Vill du verkligen ta bort denna kurs?')) {
          deleteCourse(btn.getAttribute('data-id'))
        }
      })
    })
  }

  // Render public course list
  /**
   * Renders the public course list in a card format.
   *
   * @param {string} coursesToRender - The list of courses to render in the public UI.
   */
  function renderPublicCourseList (coursesToRender) {
    if (!elements.publicCourseList) return

    elements.publicCourseList.innerHTML = coursesToRender.length === 0
      ? '<p class="no-courses">Inga kurser är planerade för tillfället</p>'
      : coursesToRender
        .map(course => {
          return `
        <div class="course-card">
          <h3>${course.title}</h3>
          <p><strong>Antal lektioner:</strong> ${course.weeks}</p>
          <p><strong>Längd per lektion:</strong> ${course.lessonLength} minuter</p>
          <p><strong>Lärare:</strong> ${course.teacher}</p>
          <p><strong>Pris:</strong> ${course.price} kr</p>
          <div class="course-description-container">
            <strong>Kursinnehåll:</strong>
            <div class="course-description">
${course.description
  ? course.description.split('\n').map(line =>
      line.trim() ? `<div class="centered-line">${line}</div>` : '<br>'
    ).join('')
  : 'Ingen beskrivning tillgänglig'
}
            </div>
          </div>
        </div>
        `
        }).join('')
  }

  // Handle form submission
  /**
   * Handles the submission of the course form, either creating or updating a course.
   *
   * @param  {string} e - The event object from the form submission.
   */
  async function handleFormSubmit (e) {
    e.preventDefault()

    try {
      // Check admin status
      if (localStorage.getItem('isAdmin') !== 'true') {
        throw new Error('Endast admins kan skapa eller ändra kurser')
      }

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Du är inte längre inloggad. Logga in igen.')
      }

      // Prepare course data
      const courseData = {
        title: elements.formFields.title.value,
        description: elements.formFields.description.value,
        weeks: parseInt(elements.formFields.weeks.value),
        lessonLength: parseInt(elements.formFields.lessonLength.value),
        price: parseInt(elements.formFields.price.value),
        teacher: elements.formFields.teacher.value
      }

      // Determine if we're updating or creating
      const courseId = elements.formFields.id.value
      const method = courseId ? 'PUT' : 'POST'
      const url = courseId ? `/courses/${courseId}` : '/courses'

      // Send request
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Något gick fel')
      }

      // Success handling
      showNotification(courseId ? 'Kurs uppdaterad!' : 'Kurs skapad!', 'success')
      resetForm()
      fetchCourses()
    } catch (error) {
      console.error('Fel vid sparning:', error)
      showNotification(error.message, 'error')
    }
  }

  // Edit course
  /**
   * Deletes a course by its ID.
   *
   * @param {string} courseId - The ID of the course to delete.
   */
  function editCourse (courseId) {
    const course = courses.find(c => c._id === courseId)
    if (!course) return

    // Fill form with course data
    elements.formFields.id.value = course._id
    elements.formFields.title.value = course.title
    elements.formFields.description.value = course.description || ''
    elements.formFields.weeks.value = course.weeks
    elements.formFields.lessonLength.value = course.lessonLength
    elements.formFields.price.value = course.price
    elements.formFields.teacher.value = course.teacher
    elements.formFields.saveBtn.textContent = 'Uppdatera kurs'

    // Show form
    if (elements.addCourseForm) {
      elements.addCourseForm.style.display = 'block'
    }
  }

  // Delete course
  /**
   * Deletes a course by its ID.
   *
   * @param {string} courseId - The ID of the course to delete.
   */
  async function deleteCourse (courseId) {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Du är inte längre inloggad.')
      }

      const res = await fetch(`/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Kunde inte radera kurs')
      }

      showNotification('Kurs raderad!', 'success')
      fetchCourses()
    } catch (error) {
      console.error('Fel vid radering:', error)
      showNotification(error.message, 'error')
    }
  }

  // Reset form to initial state
  /**
   * Resets the course form to its initial state, clearing all input fields and resetting the save button text.
   */
  function resetForm () {
    elements.courseForm.reset()
    elements.formFields.id.value = ''
    elements.formFields.saveBtn.textContent = 'Spara kurs'
  }

  // Show notification
  /**
   * Displays a notification message on the screen with a specified type.
   *
   * @param {string} message - The message to display in the notification.
   * @param {string} [type='info'] - The type of notification (e.g., 'info', 'success', 'error').
   */
  function showNotification (message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add('hide')
      setTimeout(() => notification.remove(), 500)
    }, 3000)
  }

  // Initialize the application
  init()
})
