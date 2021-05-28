"use strict";

var validateRegister = function validateRegister(req, res, next) {
  if (req.session.name) {
    req.name = req.session.name;
    next();
  } else {
    res.status(400);
    res.redirect("/");
  }
};

module.exports = validateRegister;