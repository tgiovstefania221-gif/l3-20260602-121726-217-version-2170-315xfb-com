(function () {
  const root = document.body.dataset.root || "./";
  const menuButton = document.querySelector("[data-menu-button]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  document.querySelectorAll("[data-search-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = form.querySelector("input[name='q']");
      const query = input ? input.value.trim() : "";
      const url = root + "search.html" + (query ? "?q=" + encodeURIComponent(query) : "");
      window.location.href = url;
    });
  });

  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  let active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === active);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === active);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.dataset.heroDot || "0"));
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  const libraryInput = document.querySelector("[data-library-search]");
  const libraryYear = document.querySelector("[data-library-year]");
  const cards = Array.from(document.querySelectorAll("[data-library-grid] .movie-card"));
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";

  if (libraryInput && initialQuery) {
    libraryInput.value = initialQuery;
  }

  function filterLibrary() {
    if (!cards.length) {
      return;
    }

    const query = libraryInput ? libraryInput.value.trim().toLowerCase() : "";
    const year = libraryYear ? libraryYear.value : "";

    cards.forEach(function (card) {
      const haystack = [
        card.dataset.title || "",
        card.dataset.genre || "",
        card.dataset.region || "",
        card.dataset.year || ""
      ].join(" ").toLowerCase();
      const yearMatch = !year || card.dataset.year === year;
      const queryMatch = !query || haystack.indexOf(query) !== -1;
      card.style.display = yearMatch && queryMatch ? "" : "none";
    });
  }

  if (libraryInput) {
    libraryInput.addEventListener("input", filterLibrary);
  }

  if (libraryYear) {
    libraryYear.addEventListener("change", filterLibrary);
  }

  filterLibrary();
})();
