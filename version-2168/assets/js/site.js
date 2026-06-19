(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-header-search]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  });

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initializeFilters() {
    var list = document.querySelector('[data-card-list]');
    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var emptyState = document.querySelector('[data-empty-state]');
    var searchInput = document.querySelector('[data-page-search]');
    var filters = {
      type: 'all',
      year: 'all'
    };

    var query = new URLSearchParams(window.location.search).get('q');
    if (query && searchInput) {
      searchInput.value = query;
    }

    function cardMatchesSearch(card, text) {
      if (!text) {
        return true;
      }
      var haystack = [
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.textContent
      ].join(' ');
      return normalize(haystack).indexOf(text) !== -1;
    }

    function cardMatchesFilter(card, type, value) {
      if (!value || value === 'all') {
        return true;
      }
      if (type === 'year' && value === 'older') {
        return Number(card.dataset.year || 0) <= 2022;
      }
      return normalize(card.dataset[type]).indexOf(normalize(value)) !== -1;
    }

    function apply() {
      var text = normalize(searchInput ? searchInput.value : '');
      var shown = 0;
      cards.forEach(function (card) {
        var visible = cardMatchesSearch(card, text) &&
          cardMatchesFilter(card, 'type', filters.type) &&
          cardMatchesFilter(card, 'year', filters.year);
        card.style.display = visible ? '' : 'none';
        if (visible) {
          shown += 1;
        }
      });
      if (emptyState) {
        emptyState.style.display = shown ? 'none' : 'block';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', apply);
    }

    document.querySelectorAll('[data-filter-type]').forEach(function (button) {
      button.addEventListener('click', function () {
        var type = button.dataset.filterType;
        filters[type] = button.dataset.filterValue;
        document.querySelectorAll('[data-filter-type="' + type + '"]').forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });

    apply();
  }

  function initializeHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  initializeFilters();
  initializeHero();
})();
