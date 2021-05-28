"use strict";

// javascript of view form page
function copyStringToClipboard(str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = {
    position: "absolute",
    left: "-9999px"
  };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

$(".share").click(function () {
  var formID = $(this).data("address");
  var url = window.location.host;
  var finalURL = url + "/view/" + formID;
  copyStringToClipboard(finalURL);
  alert("Link has been copied to clipboard.");
});
$(".isActive").click(function _callee() {
  var formID, status, _final, config, result, Status;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          formID = this.dataset.formid;
          status = $(this).hasClass("active") ? "false" : "true";
          _final = {
            formID: formID,
            status: status
          };
          console.log(status);
          config = {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(_final)
          };
          _context.next = 7;
          return regeneratorRuntime.awrap(fetch("/update", config));

        case 7:
          result = _context.sent;
          Status = result.status;

          if (Status == 200) {
            window.location.href = "/view";
          }

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
$(document).ready(function () {
  $("#up,#down").hide();
  var addr = window.location.href;
  console.log(addr.includes("sort"));

  if (addr.includes("sort")) {
    $("#up").show();
    $("#down").hide();
  } else {
    $("#down").show();
    $("#up").hide();
  }
});
$(".arrow").click(function () {
  var addr = window.location.href;

  if (addr.includes("sort")) {
    $(".arrow").toggleClass("fa-arrow-up fa-arrow-down");
    window.location.href = "/view";
  } else {
    $(".arrow").toggleClass("fa-arrow-down fa-arrow-up");
    window.location.href = "/view?sort=desc";
  }
});