export const renderHome = (req, res) => {
  res.render("home/index", { title: "Hem" })
}

export const renderAbout = (req, res) => {
  res.render("about/index", { title: "Om oss" })
}

export const renderEvents = (req, res) => {
  res.render("events/index", { title: "Event" })
}

export const renderQualifications = (req, res) => {
  res.render("qualifications/index", { title: "Kvalifikationer" })
}
