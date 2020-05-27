import axios from "axios";
import moment from "moment";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const getDateFormat = () => {
  const nowDate = new Date();
  return moment(nowDate, "YYYYMMDD").fromNow();
};

const delComment = (event) => {
  const btn = event.target;
  const commentColume = btn.parentNode;
  const commentBox = commentColume.parentNode;
  const li = commentBox.parentNode;

  commentList.removeChild(li);

  decreaseNumber();
};

const addComment = (avatar, name, comment) => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  const commentBox = document.createElement("div");
  const firstCommentColumn = document.createElement("div");
  const secondCommentColumn = document.createElement("div");
  const nameSpan = document.createElement("span");
  const symbolSpan = document.createElement("span");
  const dateSpan = document.createElement("span");
  const spaceSpan = document.createElement("span");
  const delIcon = document.createElement("i");
  const p = document.createElement("p");

  img.classList.add("s-avatar");
  commentBox.classList.add("video__comments-box");
  firstCommentColumn.classList.add("comment__colume");
  secondCommentColumn.classList.add("comment__colume");
  delIcon.classList.add("fas", "fa-trash-alt");

  img.src = avatar;
  nameSpan.innerHTML = name;
  symbolSpan.innerHTML = "&nbsp;•&nbsp;";
  dateSpan.innerHTML = getDateFormat();
  spaceSpan.innerHTML = "&nbsp;";
  delIcon.addEventListener("click", delComment);
  p.innerHTML = comment;

  secondCommentColumn.appendChild(p);
  firstCommentColumn.appendChild(nameSpan);
  firstCommentColumn.appendChild(symbolSpan);
  firstCommentColumn.appendChild(dateSpan);
  firstCommentColumn.appendChild(spaceSpan);
  firstCommentColumn.appendChild(delIcon);
  commentBox.appendChild(firstCommentColumn);
  commentBox.appendChild(secondCommentColumn);
  li.appendChild(img);
  li.appendChild(commentBox);
  commentList.prepend(li);

  increaseNumber();
};

const sendComment = async (avatar, name, comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(avatar, name, comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentAvatar = addCommentForm.querySelector("img");
  const commentName = addCommentForm.querySelector("span");
  const commentInput = addCommentForm.querySelector("input");
  const avatar = commentAvatar.src;
  const name = commentName.textContent;
  const comment = commentInput.value;
  sendComment(avatar, name, comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
