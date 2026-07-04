(function () {
  function initBlogFilters() {
    var filter = document.querySelector(".post-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".post-card[data-tags]"));
    var empty = document.querySelector(".post-filter__empty");

    if (!filter || cards.length === 0) {
      return;
    }

    var buttons = Array.prototype.slice.call(filter.querySelectorAll("[data-filter-tag]"));

    function showTag(tag) {
      var visibleCount = 0;

      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.filterTag === tag));
      });

      cards.forEach(function (card) {
        var tags = (card.dataset.tags || "").split("|");
        var isVisible = tag === "all" || tags.indexOf(tag) !== -1;

        card.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = visibleCount !== 0;
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        showTag(button.dataset.filterTag);
      });
    });

    showTag("all");
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initBlogFilters);
  } else {
    document.addEventListener("DOMContentLoaded", initBlogFilters);
  }
})();
