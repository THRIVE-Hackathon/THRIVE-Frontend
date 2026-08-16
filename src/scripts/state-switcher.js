/* ===== state-switcher.js : 라우팅 테스트용 임시 플로팅 스위처 =====
 *
 * 목적: 백엔드 연동 전, 로그인 여부 / 여정 상태를 자유롭게 바꿔가며
 *       index.html 의 자동 라우팅이 올바른 화면으로 보내는지 눈으로 확인.
 *
 * 저장 위치: localStorage
 *   thrive_auth        "true" | "false"
 *   thrive_trip_status "" | "before" | "inflight" | "recovering"
 *     "" (빈 값)  = 로그인은 했지만 등록된 여정 없음
 *     "before"    = 여정 등록됨, 아직 출발 전
 *     "inflight"  = 비행 중
 *     "recovering"= 착륙 후 회복 루틴 진행 중
 *   ※ "landed"(착륙 직후 점수 확인) 상태는 해당 화면이 아직 제작되지 않아
 *      스위처에서 잠시 제외했습니다. 화면 제작 후 옵션만 추가하면 됩니다.
 *
 * 사용법(각 페이지 </body> 직전):
 *   <script>window.THRIVE_ROOT = "../../../index.html";</script>  ← 그 페이지에서 루트 index.html 로 가는 상대경로
 *   <script src="{경로}/state-switcher.js"></script>
 *
 * 적용 시 THRIVE_ROOT 로 이동 → index.html 의 라우팅 로직이 새 상태에 맞는 화면으로 다시 분기.
 *
 * [연동 시 삭제 안내]
 *   실제 로그인/여정 상태를 서버(세션)가 판단하게 되면, 이 스위처와
 *   각 페이지의 <script src=".../state-switcher.js"> 포함 줄을 전부 제거하세요.
 */
(function () {
  "use strict";

  var ROOT = window.THRIVE_ROOT || "./index.html";

  var STATUS_OPTIONS = [
    { value: "", label: "여정 없음" },
    { value: "before", label: "비행 전 (before)" },
    { value: "inflight", label: "비행 중 (inflight)" },
    { value: "recovering", label: "회복 중 (recovering)" },
  ];

  function getAuth() {
    return localStorage.getItem("thrive_auth") === "true";
  }
  function getStatus() {
    return localStorage.getItem("thrive_trip_status") || "";
  }
  function apply(auth, status) {
    localStorage.setItem("thrive_auth", auth ? "true" : "false");
    localStorage.setItem("thrive_trip_status", status || "");
    window.location.href = ROOT;
  }

  function build() {
    var wrap = document.createElement("div");
    wrap.id = "thrive-switcher";
    wrap.style.cssText =
      "position:fixed;right:16px;bottom:16px;z-index:99999;font-family:var(--font-sans, sans-serif);";

    // 토글 버튼
    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.textContent = "🧪 상태";
    toggleBtn.style.cssText =
      "width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;" +
      "background:var(--color-accent,#693fcf);color:#fff;font-size:12px;font-weight:700;" +
      "box-shadow:0 4px 12px rgba(0,0,0,.25);";

    // 패널
    var panel = document.createElement("div");
    panel.style.cssText =
      "display:none;position:absolute;right:0;bottom:64px;width:240px;" +
      "background:var(--color-surface,#fff);border:1px solid var(--color-border,#dbdfe5);" +
      "border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:14px;";

    var title = document.createElement("p");
    title.textContent = "라우팅 테스트 스위처";
    title.style.cssText = "font-weight:700;font-size:13px;margin:0 0 10px;";
    panel.appendChild(title);

    // 로그인 여부
    var authLabel = document.createElement("label");
    authLabel.style.cssText =
      "display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:10px;cursor:pointer;";
    var authInput = document.createElement("input");
    authInput.type = "checkbox";
    authInput.checked = getAuth();
    authLabel.appendChild(authInput);
    authLabel.appendChild(document.createTextNode("로그인 상태"));
    panel.appendChild(authLabel);

    // 여정 상태
    var statusSel = document.createElement("select");
    statusSel.style.cssText =
      "width:100%;padding:6px 8px;font-size:13px;margin-bottom:10px;" +
      "border:1px solid var(--color-border-strong,#c8ccd2);border-radius:8px;";
    STATUS_OPTIONS.forEach(function (opt) {
      var o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === getStatus()) o.selected = true;
      statusSel.appendChild(o);
    });
    panel.appendChild(statusSel);

    // 적용 버튼
    var applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.textContent = "적용하고 라우팅 확인";
    applyBtn.style.cssText =
      "width:100%;padding:10px;border:none;border-radius:8px;cursor:pointer;" +
      "background:var(--color-accent,#693fcf);color:#fff;font-weight:600;font-size:13px;";
    applyBtn.addEventListener("click", function () {
      apply(authInput.checked, statusSel.value);
    });
    panel.appendChild(applyBtn);

    // 현재 값 표시
    var current = document.createElement("p");
    current.style.cssText = "margin-top:8px;font-size:11px;color:var(--color-text-muted,#8a8f98);";
    current.textContent =
      "현재: auth=" + getAuth() + ", status=" + (getStatus() || "(없음)");
    panel.appendChild(current);

    toggleBtn.addEventListener("click", function () {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    wrap.appendChild(panel);
    wrap.appendChild(toggleBtn);
    document.body.appendChild(wrap);
  }

  if (document.readyState !== "loading") build();
  else document.addEventListener("DOMContentLoaded", build);
})();
