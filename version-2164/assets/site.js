(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var siteNav = document.querySelector('[data-site-nav]');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            siteNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var activeIndex = 0;

        var showSlide = function (index) {
            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        };

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 6500);
        }
    }

    var searchInput = document.querySelector('[data-search-input]');
    var resultCount = document.querySelector('[data-result-count]');
    var searchableCards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));

    if (searchInput && searchableCards.length) {
        var updateSearch = function () {
            var keyword = searchInput.value.trim().toLowerCase();
            var visible = 0;

            searchableCards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var matched = !keyword || haystack.indexOf(keyword) !== -1;

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (resultCount) {
                resultCount.textContent = '当前显示 ' + visible + ' 部影片';
            }
        };

        searchInput.addEventListener('input', updateSearch);
        updateSearch();
    }
})();
