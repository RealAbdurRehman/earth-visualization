const controls = document.querySelector(".controls");
const controlsBtn = document.querySelector(".toggle-controls");

controlsBtn.addEventListener("click", function () {
  if (controls.classList.contains("active")) {
    controls.classList.remove("active");
    controlsBtn.innerHTML = "<i class='fa-solid fa-caret-left'></i>";
  } else {
    controls.classList.add("active");
    controlsBtn.innerHTML = "<i class='fa-solid fa-caret-right'></i>";
  }
});
