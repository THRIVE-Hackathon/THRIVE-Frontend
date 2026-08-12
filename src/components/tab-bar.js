/* ===== tab-bar.js : 하단 탭바 컴포넌트 =====
 * 사용법:
 *   const tabbar = THRIVE.createTabBar({ active: "home" });
 *   appEl.append(tabbar);
 *
 * 옵션:
 *   active     {"record"|"home"|"mypage"}  현재 활성 탭 (기본 "home")
 *   onNavigate {function(key, href)}       이동 가로채기(옵션, SPA/데모용)
 *
 * href 경로는 실제 폴더 구조가 정해지면 아래 TABS만 수정하면 됨.
 */
(function () {
  const NS = (window.THRIVE = window.THRIVE || {});

  // 명세서 탭 순서: 기록 · 메인 · 설정
  const TABS = [
    { key: "record", label: "기록", href: "../record/trip-list.html", icon: iconRecord },
    { key: "home",   label: "메인", href: "../home/index.html",       icon: iconHome },
    { key: "mypage", label: "설정", href: "../mypage/profile.html",   icon: iconSettings },
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

  /* --- 아이콘(채움형, 26px, fill=currentColor로 활성/비활성 색 상속) --- */
  function iconHome() {
    return (
      '<svg class="app-tabbar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M11.34 3.3 3.64 9.6a1 1 0 0 0-.37.77V20a1 1 0 0 0 1 1H9v-5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V21h4.73a1 1 0 0 0 1-1v-9.63a1 1 0 0 0-.37-.77l-7.7-6.3a1 1 0 0 0-1.26 0Z"/>' +
      "</svg>"
    );
  }
  function iconRecord() {
    return (
      '<svg class="app-tabbar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M6 3.5h12A1.5 1.5 0 0 1 19.5 5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Zm3 4.25a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H9Z"/>' +
      "</svg>"
    );
  }
  function iconSettings() {
    return (
      '<svg class="app-tabbar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M5 3.5h14A1.5 1.5 0 0 1 20.5 5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5Zm7 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-4 9.6c0-2.24 1.98-3.6 4-3.6s4 1.36 4 3.6v.4H8v-.4Z"/>' +
      "</svg>"
    );
  }
})();