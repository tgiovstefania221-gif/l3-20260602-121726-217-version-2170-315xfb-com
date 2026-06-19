(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('img[data-fallback-title]').forEach(function (image) {
        image.addEventListener('error', function () {
            image.classList.add('is-missing');
            image.setAttribute('aria-hidden', 'true');
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        var showSlide = function (nextIndex) {
            activeIndex = nextIndex % slides.length;
            slides.forEach(function (slide, index) {
                slide.classList.toggle('active', index === activeIndex);
            });
            dots.forEach(function (dot, index) {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5800);
        }
    }

    document.querySelectorAll('[data-search-input]').forEach(function (input) {
        var root = input.closest('main') || document;
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card], .rank-item'));

        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var haystack = card.textContent.toLowerCase() + ' ' + Array.prototype.map.call(card.attributes, function (attr) {
                    return attr.value;
                }).join(' ').toLowerCase();

                card.classList.toggle('hidden', keyword && haystack.indexOf(keyword) === -1);
            });
        });
    });
})();
