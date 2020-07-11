import axios from "axios";
import moment from "moment";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseComment = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const getDateFormat = () => {
  const nowDate = new Date();
  return moment(nowDate, "YYYYMMDD").fromNow();
};

const removeComment = (target) => {
  const ul = target.previousSibling.parentNode.parentNode.parentNode.parentNode;
  const li = target.previousSibling.parentNode.parentNode.parentNode;
  ul.removeChild(li);

  decreaseComment();
};

const delComment = async (event) => {
  event.preventDefault();
  const videoId = window.location.href.split("/videos/")[1];
  const { target } = event;
  const { commentid } = target.dataset;
  const respond = await axios({
    url: `/api/${videoId}/del-comment`,
    method: "POST",
    data: {
      commentid,
    },
  });
  if (respond.status === 200) {
    removeComment(target);
  }
};

const addComment = (avatar, name, comment, commentId) => {
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
  delIcon.dataset.commentid = commentId;
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
    const {
      data: { commentId },
    } = response;
    addComment(avatar, name, comment, commentId);
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
