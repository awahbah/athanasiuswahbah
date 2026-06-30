(function () {
  "use strict";
  /* Gate reveals on this class so that if JS fails, nothing stays hidden. */
  document.documentElement.classList.add("js-reveal");

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- adaptive nav (dark over hero/page-head, light over body) ---------- */
  var nav = document.querySelector("nav.site");
  var hero = document.querySelector("header.hero, header.page-head");
  if (nav) {
    if (!hero) {
      nav.classList.add("scrolled");
    } else {
      var onScroll = function () {
        var trigger = hero.offsetHeight - 80;
        if (window.scrollY > trigger) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------- reveals + stat count-up ---------- */
  var reveals = Array.prototype.slice.call(
    document.querySelectorAll(".reveal"),
  );

  function renderStat(el, value) {
    var suffix = el.getAttribute("data-suffix") || "";
    el.innerHTML =
      String(value) + (suffix ? '<span class="u">' + suffix + "</span>" : "");
  }

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    var dur = 1100,
      start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      renderStat(el, Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll(".num[data-count]").forEach(function (el) {
      renderStat(el, parseInt(el.getAttribute("data-count"), 10));
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");
        var stat = el.querySelector
          ? el.querySelector(".num[data-count]")
          : null;
        if (stat) countUp(stat);
        else if (el.matches && el.matches(".num[data-count]")) countUp(el);
        io.unobserve(el);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  reveals.forEach(function (el) {
    io.observe(el);
  });
})();
