(function () {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('playButton');

    if (!video || !button) {
        return;
    }

    var source = video.getAttribute('data-src');
    var hlsInstance = null;
    var initialized = false;

    function initializePlayer() {
        if (initialized || !source) {
            return;
        }

        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = source;
    }

    function playVideo() {
        initializePlayer();
        button.classList.add('hidden');
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('hidden');
            });
        }
    }

    button.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('hidden');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            button.classList.remove('hidden');
        }
    });
    video.addEventListener('ended', function () {
        button.classList.remove('hidden');
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
