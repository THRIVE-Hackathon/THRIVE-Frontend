/* ===== tab-bar.js : 하단 탭바 컴포넌트 =====
 * 사용법:
 *   const tabbar = THRIVE.createTabBar({ active: "home" });
 *   appEl.append(tabbar);
 *
 * 옵션:
 *   active     {"record"|"home"|"mypage"}  현재 활성 탭 (기본 "home")
 *   onNavigate {function(key, href)}       이동 가로채기(옵션).
 *              지정하면 기본 링크 이동을 막고 콜백만 실행. (SPA/데모용)
 *
 * href 경로는 실제 폴더 구조가 정해지면 아래 TABS만 수정하면 됨.
 */
(function () {
  const NS = (window.THRIVE = window.THRIVE || {});

  // 명세서 탭 순서: 기록 · 홈 · 내 정보
  const TABS = [
    { key: "record", label: "기록", href: "../record/trip-list.html", icon: iconRecord },
    { key: "home", label: "홈", href: "../home/index.html", icon: iconHome },
    { key: "mypage", label: "내 정보", href: "../mypage/profile.html", icon: iconUser },
  ];

  NS.createTabBar = function createTabBar(opts) {
    opts = opts || {};
    const active = opts.active || "home";
    const onNavigate = opts.onNavigate;

    const nav = document.createElement("nav");
    nav.className = "app-tabbar";
    nav.setAttribute("aria-label", "메인 내비게이션");

    TABS.forEach(function (tab) {
      const item = document.createElement("a");
      item.className = "app-tabbar__item";
      item.href = tab.href;
      item.dataset.key = tab.key;

      if (tab.key === active) {
        item.classList.add("is-active");
        item.setAttribute("aria-current", "page");
      }

      item.innerHTML =
        tab.icon() +
        '<span class="app-tabbar__label">' + tab.label + "</span>";

      item.addEventListener("click", function (e) {
        if (typeof onNavigate === "function") {
          e.preventDefault();
          onNavigate(tab.key, tab.href);
        }
      });

      nav.appendChild(item);
    });

    return nav;
  };

  /* --- 아이콘(24px, currentColor로 활성/비활성 색 상속) --- */
  function iconHome() {
    return (
      '<svg class="app-tabbar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M3 10.5L12 3l9 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M5 9.5V20h14V9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
    );
  }
  function iconRecord() {
    return (
      '<svg class="app-tabbar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>' +
      '<path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      "</svg>"
    );
  }
  function iconUser() {
    return (
      '<svg class="app-tabbar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/>' +
      '<path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      "</svg>"
    );
  }
})();
