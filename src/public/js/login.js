document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn')

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const username = document.getElementById('username').value
      const password = document.getElementById('password').value

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ username, password })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Inloggning misslyckades')
        }

        const result = await response.json()

        if (result.success) {
          alert('Inloggning lyckades!')
          document.getElementById('admin-login').style.display = 'none'
          document.getElementById('course-form').style.display = 'block'
          // Spara att användaren är inloggad
          localStorage.setItem('isAdmin', 'true')
        } else {
          throw new Error('Fel användarnamn eller lösenord')
        }
      } catch (error) {
        console.error('Inloggningsfel:', error)
        alert(error.message || 'Ett fel uppstod vid inloggning')
      }
    })
  }
})
