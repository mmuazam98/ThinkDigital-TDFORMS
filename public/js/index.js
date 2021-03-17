// javascript of index page
const signin = document.getElementById("login");
const signup = document.getElementById("signup");
const showSignUp = document.getElementById("showSignUp");
const showSignIn = document.getElementById("showSignIn");
const signInEye = document.getElementById("signInEye");
const signUpEye = document.getElementById("signUpEye");
const signInPass = document.getElementById("signinPass");
const signUpPass = document.getElementById("signupPass");

signInEye.style.display = "none";
signUpEye.style.display = "none";
signup.style.display = "none";

signInPass.addEventListener("focus", () => {
  signInEye.style.display = "";
});

signUpPass.addEventListener("focus", () => {
  signUpEye.style.display = "";
});

signInEye.addEventListener("click", () => {
  let el = document.getElementById("signInEye");
  let newClass = "";
  el.classList.contains("fa-eye") ? (newClass = "fa-eye-slash") : (newClass = "fa-eye");
  el.className = "fas " + newClass;
  //   let type = signInPass.getAttribute("type") === "password" ? "text" : "password";

  if (newClass == "fa-eye-slash") {
    signInPass.setAttribute("type", "text");
  } else {
    signInPass.setAttribute("type", "password");
  }
});

signUpEye.addEventListener("click", () => {
  let el2 = document.getElementById("signUpEye");
  let newClass2 = "";
  el2.classList.contains("fa-eye")
    ? (newClass2 = "fa-eye-slash")
    : (newClass2 = "fa-eye");
  el2.className = "fas " + newClass2;
  //   let type = signInPass.getAttribute("type") === "password" ? "text" : "password";

  if (newClass2 == "fa-eye-slash") {
    signUpPass.setAttribute("type", "text");
  } else {
    signUpPass.setAttribute("type", "password");
  }
});

showSignUp.addEventListener("click", () => {
  signup.style.display = "";
  signin.style.display = "none";
});
showSignIn.addEventListener("click", () => {
  signin.style.display = "";
  signup.style.display = "none";
});
