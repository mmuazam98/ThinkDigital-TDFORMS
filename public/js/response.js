let input = document.getElementsByName("array[]");
let form = $(".a");
let formID = $("#formID").val();
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
form.submit(async (e) => {
  e.preventDefault();
  // var data = new FormData(form);
  // console.log(data);
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
  let result = await fetch("/submit", config);
  let status = await result.status;
  if (status == 200) {
    alert("Submitted");
    window.location.href = "/done";
  }

  // console.log(questionID, allResponses, ques);
});
