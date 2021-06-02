let form = "<%= formID %>";
let resp = "<%= responseId %>";
let arr = "<%= responsesArr %>";
let responses = arr.split(",");
console.log(responses);
let n = parseInt("<%=total.length %>");

var Pagination = {
  code: "",
  // converting initialize data
  Extend: function (data) {
    data = data || {};
    Pagination.size = data.size;
    Pagination.page = data.page || 1;
    Pagination.step = data.step || 3;
  },

  // add pages by number (from [s] to [f])
  Add: function (s, f) {
    for (var i = s; i < f; i++) {
      Pagination.code += "<a class='x'>" + i + "</a>";
    }
  },
  // add last page with separator
  Last: function () {
    Pagination.code += "<i>...</i><a class='x'>" + Pagination.size + "</a>";
  },
  // add first page with separator
  First: function () {
    Pagination.code += "<a class='x'>1</a><i>...</i>";
  },
  // change page
  Click: function (e) {
    Pagination.page = +this.innerHTML;
    Pagination.Start();
    let c = e.srcElement.innerHTML;
    // Pagination.page = +this.innerHTML;
    // Pagination.Start();
    window.location.href = `/responses/${form}/${responses[c - 1]}`;
  },
  // previous page
  Prev: function (e) {
    Pagination.page--;

    let pagination = document.querySelectorAll("#span-cont a");
    pagination.forEach((e) => {
      if (e.className == "current") {
        let curr = parseInt(e.innerHTML);
        if (responses[curr - 2] !== undefined)
          window.location.href = `/responses/${form}/${responses[curr - 2]}`;
      }
    });
  },

  // next page
  Next: function (e) {
    Pagination.page++;

    let pagination = document.querySelectorAll("#span-cont a");
    pagination.forEach((e) => {
      if (e.className == "current") {
        let curr = parseInt(e.innerHTML);

        if (responses[curr] !== undefined)
          window.location.href = `/responses/${form}/${responses[curr]}`;
      }
    });
  },
  // binding pages
  Bind: function () {
    var a = Pagination.e.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
      if (+a[i].innerHTML === Pagination.page) a[i].className = "current";
      a[i].addEventListener("click", Pagination.Click, false);
    }
  },

  // write pagination
  Finish: function () {
    Pagination.e.innerHTML = Pagination.code;
    Pagination.code = "";
    Pagination.Bind();
  },

  // find pagination type
  Start: function () {
    if (Pagination.size < Pagination.step * 2 + 6) {
      Pagination.Add(1, Pagination.size + 1);
    } else if (Pagination.page < Pagination.step * 2 + 1) {
      Pagination.Add(1, Pagination.step * 2 + 4);
      Pagination.Last();
    } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
      Pagination.First();
      Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
    } else {
      Pagination.First();
      Pagination.Add(
        Pagination.page - Pagination.step,
        Pagination.page + Pagination.step + 1
      );
      Pagination.Last();
    }
    Pagination.Finish();
  },
  // binding buttons
  Buttons: function (e) {
    var nav = e.getElementsByTagName("a");
    nav[0].addEventListener("click", Pagination.Prev, false);
    nav[1].addEventListener("click", Pagination.Next, false);
  },

  // create skeleton
  Create: function (e) {
    var html = [
      "<a>&#9668;</a>", // previous button
      "<span id='span-cont'></span>", // pagination container
      "<a>&#9658;</a>", // next button
    ];

    e.innerHTML = html.join("");
    Pagination.e = e.getElementsByTagName("span")[0];
    Pagination.Buttons(e);
  },

  // init
  Init: function (e, data) {
    Pagination.Extend(data);
    Pagination.Create(e);
    Pagination.Start();
  },
};
var init = function () {
  Pagination.Init(document.getElementById("pagination"), {
    size: n, // pages size
    page: 1, // selected page
    step: 3, // pages before and after current
  });
};

document.addEventListener("DOMContentLoaded", init, false);
setTimeout(() => {
  const pagination = document.querySelectorAll("#span-cont a");
  pagination.forEach((e) => {
    e.className = "x";
    // console.log(responses[parseInt(e.innerHTML)-1], form)
    if (responses[parseInt(e.innerHTML) - 1] == resp) {
      e.className = "current";
    }
  });
}, 0);
