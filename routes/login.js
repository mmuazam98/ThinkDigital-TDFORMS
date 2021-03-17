const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
  res.render("index", { page: "index" });
});
module.exports = router;
