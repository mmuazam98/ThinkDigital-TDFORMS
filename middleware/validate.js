module.exports = {
  validateRegister: (req, res, next) => {
    if (req.session.name) {
      req.name = req.session.name;
    } else {
      res.status(400);
      res.render("index", { page: "index" });
    }
    next();
  },
};
