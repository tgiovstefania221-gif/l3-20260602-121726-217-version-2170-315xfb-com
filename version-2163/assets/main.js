(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  function initFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll("[data-filter-grid]"));
    if (!grids.length) {
      return;
    }
    var input = document.querySelector("[data-filter-input]");
    var region = document.querySelector("[data-filter-region]");
    var year = document.querySelector("[data-filter-year]");
    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var selectedRegion = region ? region.value : "";
      var selectedYear = year ? year.value : "";
      grids.forEach(function (grid) {
        Array.prototype.slice.call(grid.querySelectorAll(".movie-card")).forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre")
          ].join(" ").toLowerCase();
          var matchText = !q || text.indexOf(q) !== -1;
          var matchRegion = !selectedRegion || card.getAttribute("data-region") === selectedRegion;
          var matchYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
          card.classList.toggle("is-hidden", !(matchText && matchRegion && matchYear));
        });
      });
    }
    [input, region, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      }
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return "<article class=\"movie-card\">" +
      "<a class=\"poster\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">" +
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\">" +
      "<span class=\"duration\">" + escapeHtml(movie.duration) + "</span>" +
      "<span class=\"poster-shade\"><span>立即观看</span></span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<a class=\"movie-title\" href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a>" +
      "<p>" + escapeHtml(movie.one_line) + "</p>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "<div class=\"card-meta\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.rating) + "</span></div>" +
      "</div>" +
      "</article>";
  }

  function initSearch() {
    var results = document.getElementById("search-results");
    if (!results || !window.MOVIES) {
      return;
    }
    var input = document.querySelector("[data-search-input]");
    var form = document.querySelector("[data-search-form]");
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    if (input) {
      input.value = initial;
    }
    function render() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var list = window.MOVIES.filter(function (movie) {
        if (!q) {
          return true;
        }
        return [movie.title, movie.region, movie.year, movie.type, movie.genre, movie.one_line, (movie.tags || []).join(" ")]
          .join(" ")
          .toLowerCase()
          .indexOf(q) !== -1;
      }).slice(0, 120);
      results.innerHTML = list.map(movieCard).join("");
    }
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        render();
      });
    }
    if (input) {
      input.addEventListener("input", render);
    }
    render();
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initSearch();
  });
})();
