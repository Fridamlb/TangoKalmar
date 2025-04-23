export const renderHome = (req, res) => {
  res.render("home/index", { title: "TangoKalmar" })
}

export const renderAbout = (req, res) => {
  res.render("about/index", { title: "TangoKalmar" })
}

export const renderEvents = (req, res) => {
  res.render("events/index", { title: "TangoKalmar" })
}

export const renderQualifications = (req, res) => {
  res.render("qualifications/index", { title: "TangoKalmar" })
}
