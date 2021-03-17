"use strict";

var formArray = [];
var id = 1; // submitAll.addEventListener("click", (e) => {
//   // onSubmission();
//   e.preventDefault();
//   formArray = [];
//   const title = document.getElementById("form-title").value;
//   const description = document.getElementById("lightinp").value;
//   // formArray.push(title);
//   // formArray.push(description);
//   formArray.push({ title: title, description: description, questions: [] });
//   // console.log(formArray);
//   // console.log(formArray[0].questions);
//   const questions = document.querySelectorAll(".questionTitle");
//   questions.forEach((item) => {
//     type = item.dataset.type;
//     if (type == "mcq" || type == "check") {
//       optionsArray = [];
//       option = item.dataset.option;
//       const options = document.querySelectorAll(`.${option}`);
//       options.forEach((element) => {
//         optionsArray.push(element.value);
//       });
//       formArray[0].questions.push({
//         title: item.value,
//         type: type,
//         options: optionsArray,
//       });
//     } else formArray[0].questions.push({ title: item.value, type: type });
//   });
// });

var button = $("#submitAll");
$(".form").submit(function _callee(e) {
  var title, description, questions, config, result, _final;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault();
          button.empty();
          button.append("\n  <div class=\"spinner-border text-light\" role=\"status\">\n    <span class=\"sr-only\">Loading...</span>\n  </div>\n  ");
          formArray = [];
          title = document.getElementById("form-title").value;
          description = document.getElementById("lightinp").value; // formArray.push(title);
          // formArray.push(description);

          formArray.push({
            title: title,
            description: description,
            questions: []
          }); // console.log(formArray);
          // console.log(formArray[0].questions);

          questions = document.querySelectorAll(".questionTitle");
          questions.forEach(function (item) {
            type = item.dataset.type;

            if (type == "mcq" || type == "check") {
              optionsArray = [];
              option = item.dataset.option;
              var options = document.querySelectorAll(".".concat(option));
              options.forEach(function (element) {
                optionsArray.push(element.value);
              });
              formArray[0].questions.push({
                title: item.value,
                type: type,
                options: optionsArray
              });
            } else formArray[0].questions.push({
              title: item.value,
              type: type
            });
          });
          config = {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(formArray)
          };
          _context.next = 12;
          return regeneratorRuntime.awrap(fetch("/create", config));

        case 12:
          result = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(result.status);

        case 15:
          _final = _context.sent;
          console.log(_final);

          if (_final === 200 || _final === 300) {
            // alert("Form has been created.");
            window.location.href = "/";
          }

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}); // formArray = [];
//   const title = document.getElementById("form-title").value;
//   const description = document.getElementById("lightinp").value;
//   // formArray.push(title);
//   // formArray.push(description);
//   formArray.push({ title: title, description: description });
//   const questions = document.querySelectorAll(".questionTitle");
//   questions.forEach((item) => {
//     type = item.dataset.type;
//     if (type == "mcq" || type == "check") {
//       optionsArray = [];
//       option = item.dataset.option;
//       const options = document.querySelectorAll(`.${option}`);
//       options.forEach((element) => {
//         optionsArray.push(element.value);
//       });
//       formArray.push({ title: item.value, type: type, options: optionsArray });
//     } else formArray.push({ title: item.value, type: type });
//     // formArray.push(questionArray);
//   });
//   $.post("/create", { formArray });
//   console.log(formArray)