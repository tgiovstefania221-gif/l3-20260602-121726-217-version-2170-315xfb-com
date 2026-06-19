(function () {
  function initMoviePlayer(source) {
    var video = document.getElementById("movie-player");
    var overlay = document.querySelector("[data-play-overlay]");
    var hls = null;
    var loaded = false;
    if (!video || !source) {
      return;
    }
    function load() {
      if (!loaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            maxBufferLength: 30,
            capLevelToPlayerSize: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        loaded = true;
      }
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      video.setAttribute("controls", "controls");
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }
    if (overlay) {
      overlay.addEventListener("click", load);
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        load();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }
  window.initMoviePlayer = initMoviePlayer;
})();
