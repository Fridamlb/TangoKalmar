document.addEventListener('DOMContentLoaded', () => {
  console.log('Script laddat') // Felsökningsmeddelande 1

  const loginBtn = document.getElementById('login-btn')
  const adminLogin = document.getElementById('admin-login')
  const courseForm = document.getElementById('course-form')

  console.log('Element:', { loginBtn, adminLogin, courseForm }) // Felsökningsmeddelande 2

  // Kontrollera localStorage
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  console.log('Är admin:', isAdmin) // Felsökningsmeddelande 3

  // Visa/dölj element baserat på inloggning
  if (adminLogin) adminLogin.style.display = isAdmin ? 'none' : 'block'
  if (courseForm) courseForm.style.display = isAdmin ? 'block' : 'none'

  const logoutBtn = document.getElementById('logout-btn')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isAdmin')
      location.reload() // Ladda om sidan
    })
  }

  // Hantera inloggning
  if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault()
      console.log('Login-klickad') // Felsökningsmeddelande 4

      const username = document.getElementById('username').value
      const password = document.getElementById('password').value

      try {
        console.log('Försöker logga in...') // Felsökningsmeddelande 5
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })

        const result = await response.json()
        console.log('Login-svar:', result) // Felsökningsmeddelande 6

        if (result.success && result.token) {
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('token', result.token)
          if (adminLogin) adminLogin.style.display = 'none'
          if (courseForm) courseForm.style.display = 'block'
          console.log('Inloggning lyckades') // Felsökningsmeddelande 7
        } else {
          alert(result.message || 'Inloggning misslyckades')
        }
      } catch (error) {
        console.error('Login error:', error) // Felsökningsmeddelande 8
        alert('Ett fel uppstod vid inloggning')
      }
    })
  }
})
