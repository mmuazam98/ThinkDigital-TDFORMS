window.onload = function () {
  const singleTemplate = Handlebars.compile(
    document.querySelector("#singleoption").innerHTML
  );
  const singleHTML = document.getElementById("single");
  const submitAll = document.getElementById("submitAll");
  const short = document.getElementById("short");
  const check = document.getElementById("check");
  const descriptive = document.getElementById("descriptive");
  const mainForm = document.querySelector(".main-form");
  const singleAddTemplate = Handlebars.compile(
    document.querySelector("#singleadd").innerHTML
  );
  const multipleAddTemplate = Handlebars.compile(
    document.querySelector("#multipleadd").innerHTML
  );
  const handlebarsShort = Handlebars.compile(
    document.querySelector("#handlebarsShort").innerHTML
  );
  const handlebarsDescriptive = Handlebars.compile(
    document.querySelector("#handlebarsDescriptive").innerHTML
  );
  const handlebarsMultiple = Handlebars.compile(
    document.querySelector("#handlebarsMultiple").innerHTML
  );

  singleHTML.addEventListener("click", (e) => {
    singleOpt = singleTemplate({ num: id, optionID: "options" + id });
    id += 1;
    wrapper = document.createElement("div");
    wrapper.innerHTML = singleOpt;
    mainForm.append(wrapper);
    trashDelete();
    add_single_opt();
    add_multiple_opt();
    e.preventDefault();
  });

  check.addEventListener("click", (e) => {
    checkans = handlebarsMultiple({ num: id, optionID: "options" + id });
    id += 1;
    wrapper = document.createElement("div");
    wrapper.innerHTML = checkans;
    mainForm.append(wrapper);
    trashDelete();
    add_single_opt();
    add_multiple_opt();
    e.preventDefault();
  });

  short.addEventListener("click", (e) => {
    shortans = handlebarsShort({ num: id });
    id += 1;
    wrapper = document.createElement("div");
    wrapper.innerHTML = shortans;
    mainForm.append(wrapper);
    trashDelete();
    add_single_opt();
    add_multiple_opt();
    e.preventDefault();
  });

  descriptive.addEventListener("click", (e) => {
    descriptiveans = handlebarsDescriptive({ num: id });
    id += 1;
    wrapper = document.createElement("div");
    wrapper.innerHTML = descriptiveans;
    mainForm.append(wrapper);
    trashDelete();
    add_single_opt();
    add_multiple_opt();
    e.preventDefault();
  });

  function trashDelete() {
    const trashIcon = document.querySelectorAll(".fa-trash");
    trashIcon.forEach((item) => {
      item.addEventListener("click", () => {
        item.parentElement.remove();
      });
    });
  }

  function add_single_opt() {
    const add_single = document.querySelectorAll(".single-option-add");
    add_single.forEach((item) => {
      item.addEventListener("click", (e) => {
        m = e.target;
        optionID = m.dataset.option;
        s = singleAddTemplate({ optionID: optionID });
        quesNum = m.dataset.question;
        a = document.getElementById("options" + quesNum);
        wrapper = document.createElement("div");
        wrapper.innerHTML = s;
        a.append(wrapper);
        trashDelete();
      });
    });
  }

  function add_multiple_opt() {
    const add_multiple = document.querySelectorAll(".multiple-option-add");
    add_multiple.forEach((item) => {
      item.addEventListener("click", (e) => {
        m = e.target;
        optionID = m.dataset.option;
        s = multipleAddTemplate({ optionID: optionID });
        quesNum = m.dataset.question;
        a = document.getElementById("options" + quesNum);
        wrapper = document.createElement("div");
        wrapper.innerHTML = s;
        a.append(wrapper);
        trashDelete();
      });
    });
  }
  var formArray = [];
  var id = 1;

  // submitAll.addEventListener("click", (e) => {
  //   onSubmission();
  //   e.preventDefault();
  // });

  // function onSubmission() {
  //   const title = document.getElementById("form-title").value;
  //   const description = document.getElementById("lightinp").value;
  //   formArray.push(title);
  //   formArray.push(description);
  //   const questions = document.querySelectorAll(".questionTitle");
  //   questions.forEach((item) => {
  //     questionArray = [];
  //     type = item.dataset.type;
  //     questionArray.push(type);
  //     questionArray.push(item.value);
  //     if (type == "mcq" || type == "check") {
  //       optionsArray = [];
  //       option = item.dataset.option;
  //       const options = document.querySelectorAll(`.${option}`);
  //       options.forEach((element) => {
  //         optionsArray.push(element.value);
  //       });
  //       questionArray.push(optionsArray);
  //     }
  //     formArray.push(questionArray);
  //   });
  //   console.log(formArray);
  // }
};
let todo = {
  userId: 123,
  title: "loren impsum doloris",
  completed: false,
};

// fetch("/send", {
//   method: "POST",
//   body: JSON.stringify(todo),
//   headers: { "Content-Type": "application/json" },
// })
//   .then((res) => res.json())
//   .then((json) => console.log(json));
