"use strict";

var input = document.getElementsByName("array[]");
var form = $(".a");
var formID = $("#formID").val();
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
          _context.next = 10;
          return regeneratorRuntime.awrap(fetch("/submit", config));

        case 10:
          result = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(result.status);

        case 13:
          status = _context.sent;

          if (status == 200) {
            alert("Submitted");
            window.location.href = "/done";
          } // console.log(questionID, allResponses, ques);


        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
});