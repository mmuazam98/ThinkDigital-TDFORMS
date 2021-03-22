"use strict";

var form = $(".a");
var formID = $("#formID").val();
var button = $("#submit");
var url = window.location.href;
var pathname = new URL(url).pathname; // let formID = pathname.substr(6);

var data = [];
var responses = document.querySelectorAll(".form-control-");
var questions = document.querySelectorAll(".question");
var questionID = [],
    allResponses = [],
    ques = [],
    _final = [{
  formID: formID,
  responses: []
}]; //local storage

var forms = [];

if (!window.localStorage.view) {
  var _arr = ["-1"];
  localStorage.setItem("forms", JSON.stringify(_arr));
}

var retrievedData = localStorage.getItem("forms");
var arr = JSON.parse(retrievedData);
$(document).ready(function () {
  window.localStorage.view = true;
  var arr = [];
  retrievedData = localStorage.getItem("forms");
  arr = JSON.parse(retrievedData);
  if (arr.indexOf(formID) !== -1) window.location.href = "/error/filled"; // alert(arr);
});
form.submit(function _callee(e) {
  var i, config, result, status;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault(); // var data = new FormData(form);
          // console.log(data);

          data.push(formID);
          localStorage.setItem("forms", JSON.stringify(data));
          button.empty();
          button.append("\n  <div class=\"spinner-border text-light\" role=\"status\">\n    <span class=\"sr-only\">Loading...</span>\n  </div>\n  ");
          questionID = [];
          allResponses = [];
          responses.forEach(function (item) {
            if (questionID.indexOf(item.dataset.id) == -1) questionID.push(item.dataset.id);
            if (item.dataset.type !== "mcq") allResponses.push(item.value);else {
              if ($(item).is(":checked")) allResponses.push(item.value);
            }
          });
          questions.forEach(function (item) {
            if (item.value) ques.push(item.value);
          });

          for (i = 0; i < ques.length; i++) {
            _final[0].responses.push({
              title: ques[i],
              value: allResponses[i],
              questionID: questionID[i]
            });
          }

          console.log(allResponses, questionID);
          config = {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(_final)
          };

          if (!(arr.indexOf(formID) == -1)) {
            _context.next = 22;
            break;
          }

          _context.next = 15;
          return regeneratorRuntime.awrap(fetch("/submit", config));

        case 15:
          result = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(result.status);

        case 18:
          status = _context.sent;

          if (status == 200) {
            // alert("Submitted");
            arr.push(formID);
            localStorage.setItem("forms", JSON.stringify(arr));
            window.location.href = "/done";
          }

          _context.next = 23;
          break;

        case 22:
          window.location.href = "/error/filled";

        case 23:
        case "end":
          return _context.stop();
      }
    }
  });
});