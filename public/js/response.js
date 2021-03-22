let form = $(".a");
let formID = $("#formID").val();
let button = $("#submit");
let url = window.location.href;
let pathname = new URL(url).pathname;
// let formID = pathname.substr(6);
let data = [];

const responses = document.querySelectorAll(".form-control-");
const questions = document.querySelectorAll(".question");
let questionID = [],
  allResponses = [],
  ques = [],
  final = [
    {
      formID: formID,
      responses: [],
    },
  ];

//local storage
let forms = [];
if (!window.localStorage.view) {
  let arr = ["-1"];
  localStorage.setItem("forms", JSON.stringify(arr));
}
let retrievedData = localStorage.getItem("forms");
let arr = JSON.parse(retrievedData);
$(document).ready(function () {
  window.localStorage.view = true;
  let arr = [];
  retrievedData = localStorage.getItem("forms");
  arr = JSON.parse(retrievedData);
  if (arr.indexOf(formID) !== -1) window.location.href = "/error/filled";
  // alert(arr);
});
form.submit(async (e) => {
  e.preventDefault();
  // var data = new FormData(form);
  // console.log(data);
  data.push(formID);
  localStorage.setItem("forms", JSON.stringify(data));
  button.empty();
  button.append(`
  <div class="spinner-border text-light" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  `);
  questionID = [];
  allResponses = [];
  responses.forEach((item) => {
    if (questionID.indexOf(item.dataset.id) == -1) questionID.push(item.dataset.id);
    if (item.dataset.type !== "mcq") allResponses.push(item.value);
    else {
      if ($(item).is(":checked")) allResponses.push(item.value);
    }
  });
  questions.forEach((item) => {
    if (item.value) ques.push(item.value);
  });
  for (let i = 0; i < ques.length; i++) {
    final[0].responses.push({
      title: ques[i],
      value: allResponses[i],
      questionID: questionID[i],
    });
  }
  console.log(allResponses, questionID);
  let config = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(final),
  };
  if (arr.indexOf(formID) == -1) {
    let result = await fetch("/submit", config);
    let status = await result.status;
    if (status == 200) {
      // alert("Submitted");
      arr.push(formID);
      localStorage.setItem("forms", JSON.stringify(arr));
      window.location.href = "/done";
    }
  } else {
    window.location.href = "/error/filled";
  }

  // console.log(questionID, allResponses, ques);
});
