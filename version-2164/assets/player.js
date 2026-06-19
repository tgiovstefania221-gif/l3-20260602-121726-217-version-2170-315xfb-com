import { H as Hls } from './hls-vendor-dru42stk.js';

var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-src]'));

var startPlayer = function (player) {
    var video = player.querySelector('video');
    var src = player.getAttribute('data-video-src');

    if (!video || !src) {
        return;
    }

    player.classList.add('is-playing');

    if (player.getAttribute('data-loaded') === 'true') {
        video.play().catch(function () {});
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        player.setAttribute('data-loaded', 'true');
        video.play().catch(function () {});
        return;
    }

    if (Hls && Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            player.setAttribute('data-loaded', 'true');
            video.play().catch(function () {});
        });
        return;
    }

    video.src = src;
    player.setAttribute('data-loaded', 'true');
    video.play().catch(function () {});
};

players.forEach(function (player) {
    var button = player.querySelector('[data-play-button]');
    var video = player.querySelector('video');

    if (button) {
        button.addEventListener('click', function () {
            startPlayer(player);
        });
    }

    if (video) {
        video.addEventListener('click', function () {
            startPlayer(player);
        });
    }
});
