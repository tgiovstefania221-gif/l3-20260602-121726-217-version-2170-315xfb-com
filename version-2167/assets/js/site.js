(function () {
    var menuButton = document.querySelector('.mobile-menu-button');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        var prev = carousel.querySelector('.hero-prev');
        var next = carousel.querySelector('.hero-next');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startAutoPlay() {
            stopAutoPlay();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function stopAutoPlay() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startAutoPlay();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startAutoPlay();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startAutoPlay();
            });
        }

        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        startAutoPlay();
    }

    var controls = document.querySelector('[data-catalog-controls]');
    var grid = document.querySelector('[data-movie-grid]');
    var emptyState = document.querySelector('[data-empty-state]');

    if (controls && grid) {
        var searchInput = document.getElementById('filter-search');
        var categorySelect = document.getElementById('filter-category');
        var regionSelect = document.getElementById('filter-region');
        var typeSelect = document.getElementById('filter-type');
        var yearSelect = document.getElementById('filter-year');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        if (searchInput && initialQuery) {
            searchInput.value = initialQuery;
        }

        function normalized(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function cardText(card) {
            return [
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.year,
                card.dataset.genre,
                card.textContent
            ].join(' ').toLowerCase();
        }

        function applyFilters() {
            var query = normalized(searchInput && searchInput.value);
            var category = normalized(categorySelect && categorySelect.value);
            var region = normalized(regionSelect && regionSelect.value);
            var type = normalized(typeSelect && typeSelect.value);
            var year = normalized(yearSelect && yearSelect.value);
            var visible = 0;

            cards.forEach(function (card) {
                var matchesQuery = !query || cardText(card).indexOf(query) !== -1;
                var matchesCategory = !category || normalized(card.dataset.category) === category;
                var matchesRegion = !region || normalized(card.dataset.region) === region;
                var matchesType = !type || normalized(card.dataset.type) === type;
                var matchesYear = !year || normalized(card.dataset.year) === year;
                var show = matchesQuery && matchesCategory && matchesRegion && matchesType && matchesYear;

                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        [searchInput, categorySelect, regionSelect, typeSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        controls.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilters();
        });

        applyFilters();
    }
}());
