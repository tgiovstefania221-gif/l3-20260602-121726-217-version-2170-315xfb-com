import { H as Hls } from './hls-vendor.js';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return '00:00';
  }
  var minutes = Math.floor(seconds / 60);
  var rest = Math.floor(seconds % 60);
  return String(minutes).padStart(2, '0') + ':' + String(rest).padStart(2, '0');
}

function bindPlayer(shell) {
  var video = shell.querySelector('video');
  var startButton = shell.querySelector('[data-player-toggle]');
  var playButton = shell.querySelector('[data-player-play]');
  var muteButton = shell.querySelector('[data-player-mute]');
  var fullscreenButton = shell.querySelector('[data-player-fullscreen]');
  var progress = shell.querySelector('[data-player-progress]');
  var timeLabel = shell.querySelector('[data-player-time]');
  var source = (video && video.dataset.videoSrc) || (startButton && startButton.dataset.videoSrc);
  var hlsInstance = null;
  var attached = false;

  if (!video || !source) {
    return;
  }

  function attachSource() {
    if (attached) {
      return;
    }
    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function play() {
    attachSource();
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  function togglePlay() {
    if (video.paused) {
      play();
    } else {
      video.pause();
    }
  }

  function updateButtons() {
    shell.classList.toggle('playing', !video.paused);
    if (playButton) {
      playButton.textContent = video.paused ? '播放' : '暂停';
    }
  }

  function updateTime() {
    var duration = video.duration || 0;
    var current = video.currentTime || 0;
    if (progress && duration) {
      progress.value = String((current / duration) * 100);
    }
    if (timeLabel) {
      timeLabel.textContent = formatTime(current) + ' / ' + formatTime(duration);
    }
  }

  if (startButton) {
    startButton.addEventListener('click', play);
  }

  if (playButton) {
    playButton.addEventListener('click', togglePlay);
  }

  video.addEventListener('click', togglePlay);
  video.addEventListener('play', updateButtons);
  video.addEventListener('pause', updateButtons);
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('durationchange', updateTime);

  if (progress) {
    progress.addEventListener('input', function () {
      if (!video.duration) {
        return;
      }
      video.currentTime = (Number(progress.value) / 100) * video.duration;
    });
  }

  if (muteButton) {
    muteButton.addEventListener('click', function () {
      video.muted = !video.muted;
      muteButton.textContent = video.muted ? '取消静音' : '静音';
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', function () {
      if (shell.requestFullscreen) {
        shell.requestFullscreen();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });

  updateButtons();
  updateTime();
}

document.querySelectorAll('[data-player]').forEach(bindPlayer);
