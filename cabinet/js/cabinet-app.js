(function () {
  var iconsScript = document.createElement('script');
  iconsScript.src = 'https://unpkg.com/@phosphor-icons/web@2.1.1';
  document.head.appendChild(iconsScript);

  var NAV = [
    {
      label: 'Asosiy',
      items: [
        { href: 'cabinet-dashboard.html', label: 'Dashboard' },
        { href: 'cabinet-organization.html', label: 'Hududiy kabinet' },
        { href: 'cabinet-applications.html', label: 'Arizalar' },
        { href: 'cabinet-approvals.html', label: 'Tasdiqlashlar' }
      ]
    },
    {
      label: 'Reyestr',
      items: [
        { href: 'cabinet-nnt-data.html', label: "NNT ma'lumotlari" },
        { href: 'cabinet-documents.html', label: 'Hujjatlar' },
        { href: 'cabinet-reports.html', label: 'Hisobotlar' },
        { href: 'cabinet-audit.html', label: 'Audit jurnali' }
      ]
    },
    {
      label: 'Kontent',
      items: [
        { href: 'cabinet-news.html', label: 'Yangiliklar' },
        { href: 'cabinet-events.html', label: 'Tadbirlar' },
        { href: 'cabinet-grants.html', label: 'Grantlar' },
        { href: 'cabinet-notifications.html', label: 'Bildirishnomalar' }
      ]
    },
    {
      label: 'Tizim',
      items: [
        { href: 'cabinet-calendar.html', label: 'Kalendar' },
        { href: 'cabinet-support.html', label: 'Murojaatlar' },
        { href: 'cabinet-api.html', label: 'API va integratsiya' },
        { href: 'cabinet-settings.html', label: 'Sozlamalar' }
      ]
    }
  ];

  function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'cabinet-dashboard.html';
  }

  function buildNavPanel(currentPage) {
    var html =
      '<aside class="cab-nav-panel card">' +
      '<h3>Kabinet bo\'limlari</h3>' +
      '<nav class="cab-menu">';

    NAV.forEach(function (section) {
      html += '<div class="cab-menu-group">' + section.label + '</div>';
      section.items.forEach(function (item) {
        var active = item.href === currentPage ? ' active' : '';
        html += '<a class="' + active.trim() + '" href="' + item.href + '">' + item.label + '</a>';
      });
    });

    html += '</nav></aside>';
    return html;
  }

  function updateDateChip() {
    var dateChip = document.getElementById('js-date');
    if (!dateChip) return;
    var d = new Date();
    var months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    dateChip.textContent = d.getFullYear() + '-yil, ' + d.getDate() + '-' + months[d.getMonth()];
  }

  function init() {
    var app = document.querySelector('.app');
    if (!app) return;

    var main = app.querySelector('.main');
    if (!main || main.querySelector('.cab-layout')) return;

    var currentPage = getCurrentPage();
    var originalChildren = Array.prototype.slice.call(main.childNodes);

    var layout = document.createElement('div');
    layout.className = 'cab-layout';

    var navWrap = document.createElement('div');
    navWrap.innerHTML = buildNavPanel(currentPage);

    var content = document.createElement('div');
    content.className = 'cab-main-content';

    originalChildren.forEach(function (node) {
      content.appendChild(node);
    });

    layout.appendChild(navWrap.firstElementChild);
    layout.appendChild(content);

    main.appendChild(layout);

    updateDateChip();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
