(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var active = 0;

  function showSlide(index) {
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
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var filterChips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var currentFilter = 'all';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applySearch() {
    var keyword = normalize(searchInputs.map(function (input) {
      return input.value;
    }).join(' '));

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-channel')
      ].join(' '));
      var byKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var byFilter = currentFilter === 'all' || haystack.indexOf(normalize(currentFilter)) !== -1;
      card.classList.toggle('is-hidden-card', !(byKeyword && byFilter));
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', applySearch);
  });

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (item) {
        item.classList.remove('is-active');
      });
      chip.classList.add('is-active');
      currentFilter = chip.getAttribute('data-filter-value') || 'all';
      applySearch();
    });
  });
})();
