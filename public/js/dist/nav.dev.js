"use strict";

// javascript of navbar and footer
var hamburger = document.querySelector(".hamburger");
var navLinks = document.querySelector(".nav-links"); // const links = document.querySelectorAll(".nav-links li");

var logout = document.getElementById("logout");
hamburger.addEventListener("click", function () {
  //Animate Links
  navLinks.classList.toggle("open"); //Hamburger Animation

  hamburger.classList.toggle("toggle");
});
var logo = document.getElementById("mlogo");
logo.addEventListener("click", function () {
  window.location.href = "/view";
}); // let preventBack = () => {
//   window.history.forward();
// };
// logout.addEventListener("click", preventBack());
// window.onunload = function () {
//   null;
// };