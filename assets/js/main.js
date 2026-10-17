// URO-PLAST BURN CARE — small enhancements, the site works without JS.
(function () {
  var root = document.documentElement;

  // font size (remembered per browser)
  var size = 17;
  try { size = parseInt(localStorage.getItem("fs"), 10) || 17; } catch (e) {}
  root.style.setProperty("--fs", size + "px");
  document.querySelectorAll(".fs-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      size = Math.min(23, Math.max(14, size + 2 * parseInt(b.dataset.fs, 10)));
      root.style.setProperty("--fs", size + "px");
      try { localStorage.setItem("fs", size); } catch (e) {}
    });
  });

  // mobile menu
  var btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { menu.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
    });
  }

  // topic search on home page
  var q = document.getElementById("q");
  if (q) {
    var cards = document.querySelectorAll(".topic-card"), empty = document.querySelector(".no-result");
    q.addEventListener("input", function () {
      var term = q.value.trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var hit = !term || c.dataset.search.toLowerCase().indexOf(term) > -1;
        c.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      if (term) document.getElementById("topics").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // YouTube won't play inside a page opened straight from disk (file://, error 153),
  // so show the thumbnail and open the video on YouTube instead. Online it plays in place.
  if (location.protocol === "file:") {
    document.querySelectorAll(".yt[data-id]").forEach(function (box) {
      var id = box.dataset.id;
      box.innerHTML = '<a class="yt-thumb" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">' +
        '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="วิดีโอ YouTube"><span>▶</span></a>';
    });
  }

  // back to top
  var top = document.querySelector(".to-top");
  window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 600); }, { passive: true });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // lightbox for infographics
  var lb = document.querySelector(".lightbox"), lbImg = lb.querySelector("img");
  document.querySelectorAll("img.zoom").forEach(function (img) {
    img.addEventListener("click", function () { lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; });
  });
  function close() { lb.hidden = true; lbImg.src = ""; }
  lb.addEventListener("click", function (e) { if (e.target !== lbImg) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  // highlight current section in table of contents
  var links = document.querySelectorAll(".toc a");
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove("on"); });
          map[en.target.id].classList.add("on");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
