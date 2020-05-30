const header = document.querySelector("#jsHeader");
const headerHeight = header.getBoundingClientRect().height;
const headerToggleBtn = document.querySelector(".header__toggle-btn");
const toggleMenu = header.querySelector(".toggle-menu");

const headerScroll = () => {
  if (window.scrollY > headerHeight) {
    header.classList.add("header-dark");
  } else {
    header.classList.remove("header-dark");
  }
};

const handleToggle = () => {
  toggleMenu.classList.toggle("open");
};

function init() {
  document.addEventListener("scroll", headerScroll);
  headerToggleBtn.addEventListener("click", handleToggle);
}

if (header) {
  init();
}
