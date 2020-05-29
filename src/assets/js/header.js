const header = document.querySelector("#jsHeader");
const headerHeight = header.getBoundingClientRect().height;

const headerScroll = () => {
  if (window.scrollY > headerHeight) {
    header.classList.add("header-dark");
  } else {
    header.classList.remove("header-dark");
  }
};

function init() {
  document.addEventListener("scroll", headerScroll);
}

if (header) {
  init();
}
