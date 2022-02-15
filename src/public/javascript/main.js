$(document).ready(function () {
  $(".modal").modal();
});

$(document).ready(function () {
  $(".sidenav").sidenav();
});

$(document).ready(function () {
  $(".fixed-action-btn").floatingActionButton();
});

M.Sidenav.init(document.querySelector(".sidenav"));
M.FormSelect.init(document.querySelector("#status"));
CKEDITOR.replace("body", {
  plugins: "wysiwygarea, toolbar, basicstyles, link",
});
