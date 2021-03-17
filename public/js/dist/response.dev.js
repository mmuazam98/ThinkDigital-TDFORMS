"use strict";

var form = $(".a");
var formID = $("#formID").val();
var button = $("#submit");
var responses = document.querySelectorAll(".form-control-");
var questions = document.querySelectorAll(".question");
var questionID = [],
    allResponses = [],
    ques = [],
    _final = [{
  formID: formID,
  responses: []
}];
form.submit(function _callee(e) {
  var i, config, result, status;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault(); // var data = new FormData(form);
          // console.log(data);

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
          _context.next = 12;
          return regeneratorRuntime.awrap(fetch("/submit", config));

        case 12:
          result = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(result.status);

        case 15:
          status = _context.sent;

          if (status == 200) {
            // alert("Submitted");
            window.location.href = "/done";
          } // console.log(questionID, allResponses, ques);


        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
});