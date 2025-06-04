require('../src/public/js/courses.js') // Loading the script first

beforeEach(() => {
  // Set up DOM before each test
  document.body.innerHTML = `
    <button id="show-form-btn">Skapa ny kurs</button>
    <div id="add-course-form" style="display: none;"></div>
  `
  // Simulate DOMContentLoaded after DOM is ready
  document.dispatchEvent(new Event('DOMContentLoaded'))
})

test('toggles the visibility of the course form when clicking the showFormBtn', () => {
  const showFormBtn = document.getElementById('show-form-btn')
  const addCourseForm = document.getElementById('add-course-form')

  // Click 1: show form
  showFormBtn.click()
  expect(addCourseForm.style.display).toBe('block')
  expect(showFormBtn.textContent).toBe('Dölj formulär')

  // Click 2: hide form
  showFormBtn.click()
  expect(addCourseForm.style.display).toBe('none')
  expect(showFormBtn.textContent).toBe('Skapa ny kurs')
})
