/**
 * content.js — fetches data/*.json from the GitHub repo and renders
 * dynamic content on public-facing pages.
 *
 * Usage: add data-content="news|events|grants" to a container element,
 * then include this script. Or call the render functions directly.
 */

(function () {
  var REPO_RAW = 'https://raw.githubusercontent.com/sarvsop-crypto/ngo/main/data/';

  function fetchJSON(file, cb) {
    fetch(REPO_RAW + file + '.json?_=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(cb)
      .catch(function () { cb([]); });
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p[2] + '.' + p[1] + '.' + p[0];
  }

  /* ── News ─────────────────────────────────────────────────── */
  function renderNewsHome(items, container) {
    var featured = items.find(function (n) { return n.featured; }) || items[0];
    var rest = items.filter(function (n) { return n !== featured; }).slice(0, 3);

    var html = '<div class="top-story-grid">'
      + '<article class="top-story-main">'
      + '<span class="tag">' + featured.category + ' · ' + fmtDate(featured.date) + '</span>'
      + '<h3>' + featured.title + '</h3>'
      + '<p>' + featured.excerpt + '</p>'
      + '<a class="btn" href="news.html">Batafsil o\'qish</a>'
      + '</article>'
      + '<div class="top-story-list">';

    rest.forEach(function (n) {
      html += '<a class="news-item" href="news.html">'
        + '<span class="tag">' + n.category + ' · ' + fmtDate(n.date) + '</span>'
        + '<h4>' + n.title + '</h4>'
        + '<p>' + n.excerpt + '</p>'
        + '</a>';
    });

    html += '</div></div>';
    container.innerHTML = html;
  }

  function renderNewsPage(items, container) {
    if (!items.length) { container.innerHTML = '<p style="color:rgba(180,220,255,.5)">Yangiliklar topilmadi.</p>'; return; }
    var html = '<div class="news-grid">';
    items.forEach(function (n) {
      html += '<article class="news-card">'
        + '<span class="tag">' + n.category + ' · ' + fmtDate(n.date) + '</span>'
        + '<h3>' + n.title + '</h3>'
        + '<p>' + n.excerpt + '</p>'
        + '</article>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  /* ── Events ───────────────────────────────────────────────── */
  function renderEventsHome(items, upcomingEl, pastEl) {
    var upcoming = items.filter(function (e) { return e.status === 'upcoming'; });
    var past     = items.filter(function (e) { return e.status === 'past'; });

    function listHTML(arr) {
      return arr.map(function (e) {
        return '<div class="item"><h4>' + e.title + '</h4>'
          + '<p>' + e.dateLabel + (e.location ? ' · ' + e.location : '')
          + (e.participants ? ' · ' + e.participants + ' ishtirokchi' : '')
          + (e.deadline ? ' · Ariza: ' + e.deadlineLabel : '') + '</p></div>';
      }).join('');
    }

    if (upcomingEl) upcomingEl.innerHTML = listHTML(upcoming);
    if (pastEl)     pastEl.innerHTML     = listHTML(past);
  }

  function renderEventsPage(items, container) {
    if (!items.length) { container.innerHTML = '<p style="color:rgba(180,220,255,.5)">Tadbirlar topilmadi.</p>'; return; }
    var upcoming = items.filter(function (e) { return e.status === 'upcoming'; });
    var past     = items.filter(function (e) { return e.status === 'past'; });

    function sectionHTML(arr, label) {
      if (!arr.length) return '';
      var rows = arr.map(function (e) {
        return '<article class="card">'
          + '<span class="tag">' + e.dateLabel + (e.status === 'upcoming' ? ' · Rejalashtirilgan' : ' · Bo\'lib o\'tdi') + '</span>'
          + '<h3>' + e.title + '</h3>'
          + '<p>' + e.description + '</p>'
          + (e.location ? '<p style="font-size:13px;color:rgba(180,220,255,.5);margin-top:6px"><ph-map-pin weight="fill" style="font-size:13px"></ph-map-pin> ' + e.location + '</p>' : '')
          + (e.deadline ? '<p style="font-size:13px;color:#00b4d8;margin-top:4px">Ariza muddati: ' + e.deadlineLabel + '</p>' : '')
          + '</article>';
      }).join('');
      return '<h2 class="section-title" style="margin-top:32px">' + label + '</h2><div class="cards">' + rows + '</div>';
    }

    container.innerHTML = sectionHTML(upcoming, 'Rejalashtirilgan tadbirlar') + sectionHTML(past, 'Bo\'lib o\'tgan tadbirlar');
  }

  /* ── Grants ───────────────────────────────────────────────── */
  function renderGrantsPage(items, container) {
    if (!items.length) { container.innerHTML = '<p style="color:rgba(180,220,255,.5)">Faol grant yoki tanlov mavjud emas.</p>'; return; }
    var html = '<div class="cards">';
    items.forEach(function (g) {
      html += '<article class="card">'
        + '<span class="tag">' + g.category + (g.status === 'active' ? ' · Faol' : ' · Yopilgan') + '</span>'
        + '<h3>' + g.title + '</h3>'
        + '<p>' + g.description + '</p>'
        + (g.amount ? '<p style="font-size:13px;color:#00b4d8;margin-top:8px">Miqdor: ' + g.amount + '</p>' : '')
        + (g.deadlineLabel ? '<p style="font-size:13px;color:rgba(180,220,255,.6);margin-top:4px">Muddat: ' + g.deadlineLabel + '</p>' : '')
        + '<a class="btn" href="service-request.html" style="margin-top:14px;display:inline-block">Ariza topshirish</a>'
        + '</article>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  /* ── Auto-init on page load ───────────────────────────────── */
  function init() {
    // Home page — news
    var newsHomeEl = document.getElementById('dynamic-news-home');
    if (newsHomeEl) fetchJSON('news', function (items) { renderNewsHome(items, newsHomeEl); });

    // Home page — events
    var upcomingEl = document.getElementById('dynamic-events-upcoming');
    var pastEl     = document.getElementById('dynamic-events-past');
    if (upcomingEl || pastEl) fetchJSON('events', function (items) { renderEventsHome(items, upcomingEl, pastEl); });

    // news.html full page
    var newsPageEl = document.getElementById('dynamic-news-page');
    if (newsPageEl) fetchJSON('news', function (items) { renderNewsPage(items, newsPageEl); });

    // events.html full page
    var eventsPageEl = document.getElementById('dynamic-events-page');
    if (eventsPageEl) fetchJSON('events', function (items) { renderEventsPage(items, eventsPageEl); });

    // projects.html grants
    var grantsEl = document.getElementById('dynamic-grants-page');
    if (grantsEl) fetchJSON('grants', function (items) { renderGrantsPage(items, grantsEl); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
