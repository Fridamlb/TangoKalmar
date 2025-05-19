document.addEventListener('DOMContentLoaded', () => {
  console.log('Script loaded') // Debug message 1

  const loginPopupBtn = document.querySelector('.btnLogin-popup')
  const wrapper = document.querySelector('.wrapper')
  const iconClose = document.querySelector('.icon-close')
  const loginForm = document.querySelector('.form-box.login form')
  const adminLogin = document.getElementById('admin-login')
  const courseForm = document.getElementById('course-form')
  const btnPopup = document.querySelector('.btnLogin-popup')

  btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup')
  })

  console.log('Elements:', { loginPopupBtn, wrapper, loginForm, adminLogin, courseForm }) // Debug message 2

  // Check localStorage
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  console.log('Is admin:', isAdmin) // Debug message 3

  // Show/hide elements based on login status
  if (adminLogin) adminLogin.style.display = isAdmin ? 'none' : 'block'
  if (courseForm) courseForm.style.display = isAdmin ? 'block' : 'none'

  const logoutBtn = document.getElementById('logout-btn')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('token')
      location.reload() // Reload the page
    })
  }

  // Handle popup login form
  if (loginPopupBtn) {
    loginPopupBtn.addEventListener('click', () => {
      wrapper.classList.add('active-popup')
    })
  }

  if (iconClose) {
    iconClose.addEventListener('click', () => {
      wrapper.classList.remove('active-popup')
    })
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      console.log('Login form submitted') // Debug message 4

      const username = loginForm.querySelector('input[type="Username"]').value
      const password = loginForm.querySelector('input[type="password"]').value

      try {
        console.log('Attempting login...') // Debug message 5
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })

        const result = await response.json()
        console.log('Login response:', result) // Debug message 6

        if (result.success && result.token) {
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('token', result.token)
          if (adminLogin) adminLogin.style.display = 'none'
          if (courseForm) courseForm.style.display = 'block'
          wrapper.classList.remove('active-popup')
          console.log('Login successful') // Debug message 7
          location.reload() // Reload to update the UI
        } else {
          alert(result.message || 'Login failed')
        }
      } catch (error) {
        console.error('Login error:', error) // Debug message 8
        alert('An error occurred during login')
      }
    })
  }
})
