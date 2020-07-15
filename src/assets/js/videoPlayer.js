import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const controls = document.querySelector(".videoPlayer__controls");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const progress = document.getElementById("jsProgress");
const progressBar = document.getElementById("jsProgressBar");

let hideTimeout = null;

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

const hideControls = () => {
  controls.style.transform = "translateY(45px)";
  progress.style.transform = "translateY(45px)";
  videoContainer.style.cursor = "none";
};

const showControls = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
  controls.style.transform = "translateY(0)";
  progress.style.transform = "translateY(0)";
  videoContainer.style.cursor = "default";
  hideTimeout = setTimeout(hideControls, 3000);
};

const handleProgress = () => {
  if (!progress.getAttribute("max"))
    progress.setAttribute("max", videoPlayer.duration);
  progress.value = videoPlayer.currentTime;
  progressBar.style.width =
    Math.floor((videoPlayer.currentTime / videoPlayer.duration) * 100) + "%";
};

const clickProgress = (event) => {
  const pos =
    (event.layerX - event.target.offsetLeft) / event.target.offsetWidth;
  videoPlayer.currentTime = pos * videoPlayer.duration;
};

const handlePlayClick = () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
};

const handleKeyDown = (event) => {
  const { code } = event;
  if (code === "Space") {
    handlePlayClick();
  }
};

const handleVolumeClick = () => {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
};

const exitFullScreen = () => {
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

const goFullScreen = () => {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
};

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

const getCurrentTime = () => {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
};

const setTotalTime = async () => {
  let duration;
  if (!isFinite(videoPlayer.duration)) {
    const blob = await fetch(videoPlayer.src).then((response) =>
      response.blob()
    );
    duration = await getBlobDuration(blob);
  } else {
    duration = videoPlayer.duration;
  }
  const totalTimeString = formatDate(duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 1000);
};

const handleEnded = () => {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
};

const handleDrag = (event) => {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
};

const init = () => {
  videoPlayer.volume = 0.5;
  videoPlayer.addEventListener("timeupdate", handleProgress);
  progress.addEventListener("click", clickProgress);
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScrnBtn.addEventListener("click", goFullScreen);
  window.onload = () => {
    setTotalTime();
  };
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
  document.addEventListener("keydown", handleKeyDown);
  videoContainer.addEventListener("mousemove", showControls);
  videoContainer.addEventListener("mouseleave", hideControls);
  videoPlayer.addEventListener("click", handlePlayClick);
};

if (videoContainer) {
  init();
}
