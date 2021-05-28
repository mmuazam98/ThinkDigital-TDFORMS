"use strict";

var express = require("express");

var app = express();

var session = require("express-session");

app.use(session({
  secret: "ilu>c8cs",
  resave: true,
  saveUninitialized: true
}));
app.set("view engine", "ejs");
app.use(express["static"](__dirname + "/public"));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

var adminLinks = require("./routes/admin");

var pageRoutes = require("./routes/pages");

app.use("/", adminLinks);
app.use("/", pageRoutes);
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server running at http://localhost:".concat(PORT));
});