/**
 * Renders the home page.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 */
export const renderHome = (req, res) => {
  res.render('home/index', { title: 'TangoKalmar' })
}

/**
 * Renders the about page.
 *
 * @param {import('express').Response} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 */
export const renderAbout = (req, res) => {
  res.render('about/index', { title: 'TangoKalmar' })
}

/**
 * Renders the events page.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 */
export const renderEvents = (req, res) => {
  res.render('events/index', { title: 'TangoKalmar' })
}

/**
 * Renders the qualifications page.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 */
export const renderQualifications = (req, res) => {
  res.render('qualifications/index', { title: 'TangoKalmar' })
}
