/* ============================================================
   Lab website - 공통 스크립트
   모든 페이지에서 <script src="assets/main.js" defer></script> 로 불러옵니다.
   ============================================================ */

(function () {
  'use strict';

  /* 메뉴·푸터와 현재 페이지 강조는 assets/layout.js 가 담당합니다. */

  /* ---------- 1. 접었다 펴는 항목 ----------
     마크업: <article class="news news-expand"> ... <div class="expand-body">
     펼칠 내용이 있는 항목에만 news-expand 클래스를 붙이면 됩니다. */
  document.querySelectorAll('.news-expand').forEach(function (item) {
    var label = item.querySelector('.expand-toggle');
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-expanded', 'false');

    function flip() {
      var open = item.classList.toggle('open');
      item.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? '접기 ▲' : '자세히 보기 ▼';
    }
    item.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') return; // 링크 클릭은 그대로 통과
      flip();
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
  });

  /* ---------- 2. Publications · Patents 목록 필터 ----------
     마크업: 버튼 <button class="filter" data-filter="journal">
             항목  <article class="pub" data-type="journal">   */
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.dataset.filter;
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        document.querySelectorAll('.pub').forEach(function (pub) {
          var show = want === 'all' || (pub.dataset.type || '').split(/\s+/).includes(want);
          pub.style.display = show ? '' : 'none';
        });
        // 항목이 하나도 남지 않은 연도 헤더는 숨김
        document.querySelectorAll('.year-group').forEach(function (group) {
          var visible = group.querySelectorAll('.pub:not([style*="none"])').length;
          group.style.display = visible ? '' : 'none';
        });
      });
    });
  }

  /* ---------- 3. 히어로 슬라이드쇼 ----------
     .slideshow 안에 <img class="slide"> 를 2장 이상 넣으면 자동 순환합니다. */
  var show = document.querySelector('.slideshow');
  if (show) {
    var slides = show.querySelectorAll('.slide');
    var dotsBox = document.querySelector('.slide-dots');
    if (slides.length > 1) {
      var idx = 0;
      var dots = [];

      if (dotsBox) {
        slides.forEach(function (_, i) {
          var d = document.createElement('button');
          d.className = 'dot' + (i === 0 ? ' active' : '');
          d.setAttribute('aria-label', (i + 1) + '번째 사진');
          d.addEventListener('click', function () { go(i); });
          dotsBox.appendChild(d);
          dots.push(d);
        });
      }

      function go(n) {
        slides[idx].classList.remove('active');
        if (dots[idx]) dots[idx].classList.remove('active');
        idx = (n + slides.length) % slides.length;
        slides[idx].classList.add('active');
        if (dots[idx]) dots[idx].classList.add('active');
      }

      slides[0].classList.add('active');
      var timer = setInterval(function () { go(idx + 1); }, 5000);
      show.addEventListener('mouseenter', function () { clearInterval(timer); });
      show.addEventListener('mouseleave', function () {
        timer = setInterval(function () { go(idx + 1); }, 5000);
      });
    } else if (slides.length === 1) {
      slides[0].classList.add('active');
    }
  }

})();
