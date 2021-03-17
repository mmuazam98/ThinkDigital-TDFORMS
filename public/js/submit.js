var formArray = [];
var id = 1;

// submitAll.addEventListener("click", (e) => {
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

$(".form").submit(async (e) => {
  e.preventDefault();
  formArray = [];
  const title = document.getElementById("form-title").value;
  const description = document.getElementById("lightinp").value;
  // formArray.push(title);
  // formArray.push(description);
  formArray.push({ title: title, description: description, questions: [] });
  // console.log(formArray);
  // console.log(formArray[0].questions);
  const questions = document.querySelectorAll(".questionTitle");
  questions.forEach((item) => {
    type = item.dataset.type;

    if (type == "mcq" || type == "check") {
      optionsArray = [];
      option = item.dataset.option;
      const options = document.querySelectorAll(`.${option}`);
      options.forEach((element) => {
        optionsArray.push(element.value);
      });
      formArray[0].questions.push({
        title: item.value,
        type: type,
        options: optionsArray,
      });
    } else formArray[0].questions.push({ title: item.value, type: type });
  });
  let config = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(formArray),
  };
  let result = await fetch("/create", config);

  let final = await result.status;
  console.log(final);
  if (final === 200 || final === 300) {
    alert("Form has been created.");
    window.location.href = "/";
  }
});

// formArray = [];
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
