/* ============================================================
   공통 레이아웃 — 메뉴(nav)와 푸터(footer)를 여기 한 곳에서만 관리합니다.

   각 HTML 파일에는 <site-nav></site-nav> / <site-footer></site-footer>
   한 줄만 들어 있고, 실제 내용은 아래 SITE 객체에서 나옵니다.
   → 메뉴를 바꾸려면 이 파일의 SITE.nav 배열만 고치면 6개 페이지에 모두 반영됩니다.

   빌드 도구나 서버가 필요 없습니다. index.html을 더블클릭해도 그대로 작동합니다.
   ============================================================ */

const SITE = {
  /* ---- 연구실 정보 ---- */
  name: 'NABI Lab',
  at: '@ KAIST',
  logo: 'images/nabi-logo-color.svg',
  tagline: 'Nanoscale Bioengineering Laboratory',
  affiliation: 'Department of Biological Sciences, KAIST, South Korea',
  email: 'yoonsung@kaist.ac.kr',

  /* ---- 상단 메뉴: [파일명, 표시할 이름] ----
     순서를 바꾸거나 항목을 추가/삭제하면 모든 페이지에 바로 반영됩니다. */
  nav: [
    ['index.html', 'Home'],
    ['research.html', 'Research'],
    ['publications.html', 'Publications'],
    ['team.html', 'Team'],
    ['patents.html', 'Patents'],
  ],

  /* ---- 푸터 가운데 칸 ---- */
  footerPages: [
    ['research.html', 'Research'],
    ['publications.html', 'Publications'],
    ['team.html', 'Team'],
    ['patents.html', 'Patents'],
  ],

};

/* 현재 보고 있는 파일 이름 (메뉴 강조에 사용) */
const CURRENT = location.pathname.split('/').pop() || 'index.html';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- 요소를 만들어 자기 자신을 그 내용으로 교체 ----------
   <site-nav> 태그가 DOM에 남지 않으므로 기존 CSS(sticky 등)가 그대로 작동합니다. */
function swap(el, html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  el.replaceWith(...t.content.childNodes);
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    const links = SITE.nav.map(([href, label]) => {
      const active = href === CURRENT ? ' class="active"' : '';
      return `      <li><a href="${href}"${active}>${esc(label)}</a></li>`;
    }).join('\n');

    swap(this, `
<nav class="nav">
  <a class="nav-logo" href="index.html">
    <img class="logo-mark" src="${SITE.logo}" alt="" width="22" height="28">
    <span class="logo-text">${esc(SITE.name)} <span class="at">${esc(SITE.at)}</span></span>
  </a>
  <ul class="nav-links">
${links}
  </ul>
</nav>`);
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const li = (list) => list
      .map(([href, label]) => `        <li><a href="${href}">${esc(label)}</a></li>`)
      .join('\n');

    swap(this, `
<footer class="footer">
  <div class="footer-inner">
    <div>
      <h4>${esc(SITE.name)}</h4>
      <p>
        <strong>${esc(SITE.tagline)}</strong><br>
        ${esc(SITE.affiliation)}
      </p>
    </div>
    <div>
      <h4>Pages</h4>
      <ul>
${li(SITE.footerPages)}
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    © ${new Date().getFullYear()} ${esc(SITE.name)}, KAIST. All rights reserved.
  </div>
</footer>`);
  }
}

customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
