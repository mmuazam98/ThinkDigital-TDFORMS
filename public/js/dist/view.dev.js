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