(function () {
  function startPlayer(box) {
    var video = box.querySelector('video');
    var layer = box.querySelector('.play-layer');
    var stream = box.getAttribute('data-stream');

    if (!video || !stream) {
      return;
    }

    function playVideo() {
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (layer) {
      layer.classList.add('is-hidden');
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = stream;
      }
      playVideo();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!box.hlsReady) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        box.hlsReady = true;
        box.hlsInstance = hls;
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
      } else {
        playVideo();
      }
    }
  }

  var boxes = Array.prototype.slice.call(document.querySelectorAll('.player-wrap[data-stream]'));

  boxes.forEach(function (box) {
    var layer = box.querySelector('.play-layer');
    var video = box.querySelector('video');

    if (layer) {
      layer.addEventListener('click', function () {
        startPlayer(box);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!box.hlsReady && !video.src) {
          startPlayer(box);
        }
      });
    }
  });
})();
