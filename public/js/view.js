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
$(".isActive").click(async function () {
  let formID = this.dataset.formid;
  let status = $(this).hasClass("active") ? "false" : "true";
  let final = {
    formID,
    status,
  };
  console.log(status);
  let config = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(final),
  };
  let result = await fetch("/update", config);
  let Status = result.status;

  if (Status == 200) {
    window.location.href = "/view";
  }
});
$(document).ready(function () {
  $("#up,#down").hide();
  let addr = window.location.href;
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
  let addr = window.location.href;
  if (addr.includes("sort")) {
    $(".arrow").toggleClass("fa-arrow-up fa-arrow-down");
    window.location.href = "/view";
  } else {
    $(".arrow").toggleClass("fa-arrow-down fa-arrow-up");
    window.location.href = "/view?sort=desc";
  }
});
