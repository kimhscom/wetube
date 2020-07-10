import axios from "axios";

const delCommentBtn = document.getElementsByClassName("del__Comment");
const commentNumber2 = document.getElementById("jsCommentNumber");

const decreaseComment = () => {
  commentNumber2.innerHTML = parseInt(commentNumber2.innerHTML, 10) - 1;
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

const init = () => {
  Array.from(delCommentBtn).forEach((currentComment) => {
    currentComment.addEventListener("click", delComment);
  });
};

if (delCommentBtn) {
  init();
}
