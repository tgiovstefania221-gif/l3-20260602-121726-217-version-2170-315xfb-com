import { H as Hls } from "./hls-vendor-dru42stk.js";

const video = document.querySelector(".movie-video");
const button = document.querySelector("[data-play-button]");
let hlsInstance = null;
let initialized = false;

function setButtonText(text) {
  if (!button) {
    return;
  }

  const label = button.querySelector("em");
  if (label) {
    label.textContent = text;
  }
}

function attachStream() {
  if (!video || initialized) {
    return;
  }

  const source = video.dataset.src || "";
  if (!source) {
    setButtonText("暂无可播放内容");
    return;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
    initialized = true;
    return;
  }

  if (Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });
    hlsInstance.loadSource(source);
    hlsInstance.attachMedia(video);
    hlsInstance.on(Hls.Events.ERROR, function (_event, data) {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hlsInstance.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hlsInstance.recoverMediaError();
      } else {
        hlsInstance.destroy();
        hlsInstance = null;
        initialized = false;
        setButtonText("重新播放");
      }
    });
    initialized = true;
    return;
  }

  video.src = source;
  initialized = true;
}

async function playVideo() {
  if (!video || !button) {
    return;
  }

  attachStream();

  try {
    await video.play();
    button.classList.add("hide");
  } catch (_error) {
    button.classList.remove("hide");
    setButtonText("再次点击播放");
  }
}

if (button && video) {
  button.addEventListener("click", playVideo);
  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener("play", function () {
    button.classList.add("hide");
  });
  video.addEventListener("pause", function () {
    if (!video.ended) {
      button.classList.remove("hide");
    }
  });
}
