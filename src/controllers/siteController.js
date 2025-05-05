/**
 *
 * @param req
 * @param res
 */
export const renderHome = (req, res) => {
  res.render('home/index', { title: 'TangoKalmar' })
}

/**
 *
 * @param req
 * @param res
 */
export const renderAbout = (req, res) => {
  res.render('about/index', { title: 'TangoKalmar' })
}

/**
 *
 * @param req
 * @param res
 */
export const renderEvents = (req, res) => {
  res.render('events/index', { title: 'TangoKalmar' })
}

/**
 *
 * @param req
 * @param res
 */
export const renderQualifications = (req, res) => {
  res.render('qualifications/index', { title: 'TangoKalmar' })
}
