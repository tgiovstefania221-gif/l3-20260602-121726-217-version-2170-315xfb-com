(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-site-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        function activate(next) {
            index = next;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                activate(i);
            });
        });
        window.setInterval(function () {
            activate((index + 1) % slides.length);
        }, 5200);
    }

    function getCardText(card) {
        return [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-year') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-genre') || '',
            card.textContent || ''
        ].join(' ').toLowerCase();
    }

    function setupSearchSort() {
        var input = document.querySelector('[data-search-input]');
        var select = document.querySelector('[data-sort-select]');
        var grid = document.querySelector('[data-card-list]');
        var empty = document.querySelector('[data-empty-state]');
        if (!grid) {
            return;
        }
        var cards = Array.prototype.slice.call(grid.children);
        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var visibleCount = 0;
            cards.forEach(function (card) {
                var matched = !keyword || getCardText(card).indexOf(keyword) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visibleCount += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visibleCount === 0);
            }
        }
        function sortCards() {
            var value = select ? select.value : 'default';
            var ordered = cards.slice();
            if (value === 'year-desc') {
                ordered.sort(function (a, b) {
                    return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                });
            } else if (value === 'year-asc') {
                ordered.sort(function (a, b) {
                    return Number(a.getAttribute('data-year')) - Number(b.getAttribute('data-year'));
                });
            } else if (value === 'title-asc') {
                ordered.sort(function (a, b) {
                    return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
                });
            } else {
                ordered = cards.slice();
            }
            ordered.forEach(function (card) {
                grid.appendChild(card);
            });
            apply();
        }
        if (input) {
            input.addEventListener('input', apply);
        }
        if (select) {
            select.addEventListener('change', sortCards);
        }
        apply();
    }

    function playVideo(box) {
        var video = box.querySelector('video');
        var poster = box.querySelector('[data-player-poster]');
        var source = box.getAttribute('data-src');
        if (!video || !source) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.src) {
                video.src = source;
            }
            video.play();
        } else if (window.Hls && window.Hls.isSupported()) {
            if (!video._hlsReady) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
                video._hlsReady = true;
                video._hlsInstance = hls;
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play();
                });
            } else {
                video.play();
            }
        }
        if (poster) {
            poster.classList.add('is-hidden');
        }
    }

    function setupPlayers() {
        var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        boxes.forEach(function (box) {
            var poster = box.querySelector('[data-player-poster]');
            var video = box.querySelector('video');
            if (poster) {
                poster.addEventListener('click', function () {
                    playVideo(box);
                });
            }
            if (video) {
                video.addEventListener('play', function () {
                    var source = box.getAttribute('data-src');
                    if (!video.src && source) {
                        playVideo(box);
                    }
                });
            }
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearchSort();
        setupPlayers();
    });
})();
