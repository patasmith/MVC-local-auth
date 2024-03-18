module.exports = {
  getIndex: (req, res, next) => {
    res.render('index', {
      title: "Guest home page",
      messages: req.flash(),
    })
  },
}
