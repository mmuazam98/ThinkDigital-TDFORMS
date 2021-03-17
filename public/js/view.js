// javascript of view form page
function copyStringToClipboard(str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
$(".share").click(function () {
  let formID = $(this).data("address");
  let url = window.location.host;
  let finalURL = url + "/view/" + formID;
  copyStringToClipboard(finalURL);
  alert("Link has been copied to clipboard.");
});
