var formArray = [];
var id = 1;
let button = $("#submitAll");

$(".form").submit(async (e) => {
  e.preventDefault();
  button.empty();
  button.append(`
  <div class="spinner-border text-light" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  `);
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

  let final = result.status;
  console.log(final);
  if (final === 200 || final === 201) {
    // alert("Form has been created.");
    window.location.href = "/view";
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
