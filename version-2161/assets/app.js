(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobilePanel.classList.toggle('is-open');
            menuButton.classList.toggle('is-open', isOpen);
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var active = 0;
        var timer = null;

        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        };

        var startTimer = function () {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(active - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(active + 1);
                startTimer();
            });
        }

        startTimer();
    }

    var filterPanel = document.querySelector('[data-filter-panel]');

    if (filterPanel) {
        var textInput = filterPanel.querySelector('[data-filter-text]');
        var typeSelect = filterPanel.querySelector('[data-filter-type]');
        var yearSelect = filterPanel.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-list] .movie-card'));
        var empty = document.querySelector('[data-filter-empty]');

        var applyFilter = function () {
            var keyword = (textInput.value || '').trim().toLowerCase();
            var type = typeSelect.value;
            var decade = yearSelect.value;
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                var cardType = card.getAttribute('data-type') || '';
                var year = parseInt(card.getAttribute('data-year') || '0', 10);
                var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                var typeMatch = !type || cardType.indexOf(type) !== -1;
                var yearMatch = true;

                if (decade === '2020') {
                    yearMatch = year >= 2020;
                } else if (decade === '2010') {
                    yearMatch = year >= 2010 && year < 2020;
                } else if (decade === '2000') {
                    yearMatch = year >= 2000 && year < 2010;
                } else if (decade === '1990') {
                    yearMatch = year > 0 && year < 2000;
                }

                var matched = keywordMatch && typeMatch && yearMatch;
                card.hidden = !matched;

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        };

        [textInput, typeSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
    }

    var searchForm = document.querySelector('[data-search-form]');
    var searchInput = document.querySelector('[data-search-input]');
    var searchResults = document.querySelector('[data-search-results]');
    var searchEmpty = document.querySelector('[data-search-empty]');

    if (searchForm && searchInput && searchResults && Array.isArray(window.SEARCH_INDEX)) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        searchInput.value = query;

        var cardTemplate = function (item) {
            return [
                '<article class="movie-card">',
                '    <a class="poster-link" href="' + item.url + '" aria-label="' + escapeHtml(item.title) + '">',
                '        <img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
                '        <span class="poster-shade"></span>',
                '        <span class="play-mark">▶</span>',
                '        <span class="year-badge">' + escapeHtml(item.year) + '</span>',
                '    </a>',
                '    <div class="movie-card-body">',
                '        <h2><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h2>',
                '        <p>' + escapeHtml(item.oneLine) + '</p>',
                '        <div class="movie-meta">',
                '            <span>' + escapeHtml(item.region) + '</span>',
                '            <span>' + escapeHtml(item.type) + '</span>',
                '        </div>',
                '    </div>',
                '</article>'
            ].join('');
        };

        var renderSearch = function (value) {
            var keyword = (value || '').trim().toLowerCase();
            var results = window.SEARCH_INDEX.filter(function (item) {
                if (!keyword) {
                    return true;
                }

                return item.searchText.indexOf(keyword) !== -1;
            }).slice(0, 240);

            searchResults.innerHTML = results.map(cardTemplate).join('');

            if (searchEmpty) {
                searchEmpty.hidden = results.length !== 0;
            }
        };

        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var value = searchInput.value.trim();
            var nextUrl = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
            window.history.replaceState(null, '', nextUrl);
            renderSearch(value);
        });

        renderSearch(query);
    }

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var message = player.querySelector('[data-player-message]');
        var stream = player.getAttribute('data-stream');
        var loaded = false;
        var hls = null;

        if (!video || !button || !stream) {
            return;
        }

        var showMessage = function (text) {
            if (message) {
                message.textContent = text;
                message.hidden = false;
            }
        };

        var prepare = function () {
            if (loaded) {
                return;
            }

            loaded = true;

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage('视频加载失败，请稍后重试');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else {
                showMessage('视频加载失败，请稍后重试');
            }
        };

        var start = function () {
            prepare();
            button.classList.add('is-hidden');
            video.controls = true;
            var playRequest = video.play();

            if (playRequest && typeof playRequest.catch === 'function') {
                playRequest.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        };

        button.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
