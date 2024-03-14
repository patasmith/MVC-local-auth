module.exports = {
  getIndex: (req, res, next) => {
    res.render('index', {
      title: "Guest home page",
      messages: req.flash(),
    })
  },
  getDashboard: (req, res, next) => {
    res.render('dashboard', {
      title: "User dashboard",
      messages: req.flash(),
    })
  }
}
