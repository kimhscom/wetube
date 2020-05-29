const arrowUp = document.querySelector(".arrow-up");

const scrollTop = () => {
  window.scrollTo(0, 0);
};

function init() {
  arrowUp.addEventListener("click", scrollTop);
}

if (arrowUp) {
  init();
}
