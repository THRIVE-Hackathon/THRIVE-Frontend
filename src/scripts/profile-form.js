/* ===== profile-form.js : 프로필 입력(A3) 폼 로직 =====
 *
 * 전제 및 동작 방식은 auth-form.js 와 동일한 "점진적 향상":
 *   - JS 없이도: 브라우저 기본 제출 → 서버 검증으로 최종 판정 (안전망)
 *   - JS 있으면: 즉시 검증 / 실시간 조건 표시 / 제출 버튼 활성화 / UX 개선
 *
 * [메시지 노출 규칙] (auth.css 와 동일)
 *   - 중립(닉네임 빈 값): 안내 문구('2~10자') 로 복원 → 회색
 *   - 틀림: 빨강(.field__msg--error)
 *   - 맞음: 초록(.is-ok)
 *   - 셀렉트 힌트('필수 항목입니다')는 미선택 시 회색으로 유지, 제출 오류 시 빨강.
 *
 * 폼 식별:  <form data-auth="profile">
 * 데모 모드: <form ... data-demo="true"> 이면 실제 POST를 막고
 *            data-home 경로(홈)로 이동만 시연. (FA305)
 *            → Django 연동 시 data-demo 속성만 제거하면 그대로 POST되고,
 *              서버가 Profile 생성 후 홈으로 리다이렉트한다.
 *
 * 서버 오류 주입(서버 재렌더 시):
 *   - 필드 오류: <div class="field" data-field="nickname" data-server-error="문구">
 */
(function () {
  "use strict";

  var NS = (window.THRIVE = window.THRIVE || {});

  var NICK_MIN = 2;
  var NICK_MAX = 10;

  /* ---------- .field 메시지 헬퍼 (auth-form.js 와 동일 구조) ---------- */
  function msgOf(fieldEl) {
    return fieldEl ? fieldEl.querySelector(".field__msg") : null;
  }
  function inputOf(fieldEl) {
    return fieldEl ? fieldEl.querySelector(".field__input") : null;
  }
  function selectOf(fieldEl) {
    return fieldEl ? fieldEl.querySelector(".field__select") : null;
  }
  function setFieldError(fieldEl, text) {
    if (!fieldEl) return;
    var msg = msgOf(fieldEl);
    fieldEl.classList.add("has-error");
    if (msg) {
      msg.classList.add("field__msg--error");
      msg.classList.remove("is-ok");
      msg.textContent = text || "";
    }
  }
  function setFieldOk(fieldEl, text) {
    if (!fieldEl) return;
    var msg = msgOf(fieldEl);
    fieldEl.classList.remove("has-error");
    if (msg) {
      msg.classList.remove("field__msg--error");
      msg.classList.add("is-ok");
      msg.textContent = text || "";
    }
  }
  // 중립 상태: 클래스 제거 + 안내 문구(힌트)로 복원 → 회색
  function setHint(fieldEl, text) {
    if (!fieldEl) return;
    var msg = msgOf(fieldEl);
    fieldEl.classList.remove("has-error");
    if (msg) {
      msg.classList.remove("field__msg--error", "is-ok");
      msg.textContent = text || "";
    }
  }
  function fieldByName(form, name) {
    return form.querySelector('[data-field="' + name + '"]');
  }

  /* ---------- 서버가 주입한 오류 자동 표시 (auth-form.js 와 동일) ---------- */
  function applyServerErrors(form) {
    var fields = form.querySelectorAll("[data-field]");
    Array.prototype.forEach.call(fields, function (f) {
      var err = f.getAttribute("data-server-error");
      if (err) setFieldError(f, err);
    });
  }

  /* =========================================================
   *  프로필 입력 (A3)
   * ========================================================= */
  function initProfile(form) {
    var nickField = fieldByName(form, "nickname");
    var genderField = fieldByName(form, "gender");
    var ageField = fieldByName(form, "age-group");

    var nickInput = inputOf(nickField);
    var genderSelect = selectOf(genderField);
    var ageSelect = selectOf(ageField);
    var submitBtn = form.querySelector('button[type="submit"]');

    function nickLen() {
      return nickInput ? nickInput.value.trim().length : 0;
    }
    // FA301: 2~10자
    function nickOk() {
      var n = nickLen();
      return n >= NICK_MIN && n <= NICK_MAX;
    }
    function genderOk() {
      return !!genderSelect && genderSelect.value !== "";
    }
    function ageOk() {
      return !!ageSelect && ageSelect.value !== "";
    }

    // FA301 닉네임 실시간 표시 (빈 값→'2~10자' 회색 / 2~10자→초록 / 그 외→빨강)
    function refreshNick() {
      if (!nickInput) return;
      var n = nickLen();
      if (n === 0) {
        setHint(nickField, "2~10자");
      } else if (nickOk()) {
        setFieldOk(nickField, "사용 가능한 닉네임입니다");
      } else {
        setFieldError(nickField, "닉네임은 2~10자로 입력해주세요");
      }
    }

    // FA305 예외: 세 조건 충족 시에만 [프로필 완료] 활성화
    function refreshSubmit() {
      if (!submitBtn) return;
      submitBtn.disabled = !(nickOk() && genderOk() && ageOk());
    }

    if (nickInput) {
      nickInput.addEventListener("input", function () {
        refreshNick();
        refreshSubmit();
      });
    }
    if (genderSelect) {
      genderSelect.addEventListener("change", function () {
        // 선택되면 오류 상태 해제(선택 전 회색 힌트로 복원)
        if (genderOk()) setHint(genderField, "필수 항목입니다");
        refreshSubmit();
      });
    }
    if (ageSelect) {
      ageSelect.addEventListener("change", function () {
        if (ageOk()) setHint(ageField, "필수 항목입니다");
        refreshSubmit();
      });
    }

    // 초기 상태 반영(모두 중립, 버튼 비활성)
    refreshSubmit();

    form.addEventListener("submit", function (e) {
      var ok = true;

      if (!nickOk()) {
        setFieldError(nickField, "닉네임은 2~10자로 입력해주세요");
        ok = false;
      }
      if (!genderOk()) {
        setFieldError(genderField, "성별을 선택해주세요");
        ok = false;
      }
      if (!ageOk()) {
        setFieldError(ageField, "연령대를 선택해주세요");
        ok = false;
      }

      if (!ok) {
        e.preventDefault();
        return;
      }

      // 데모 모드: 실제 전송을 막고 홈으로 이동만 시연 (FA305)
      if (form.dataset.demo === "true") {
        e.preventDefault();
        var home = form.getAttribute("data-home") || "../../../index.html";
        window.location.href = home;
        return;
      }
      // 그 외: 네이티브 제출 → Django 뷰가 Profile 생성 후 홈으로 리다이렉트
    });
  }

  /* ---------- 초기화 ---------- */
  NS.initProfileForm = function initProfileForm(root) {
    var scope = root || document;
    var forms = scope.querySelectorAll('form[data-auth="profile"]');
    Array.prototype.forEach.call(forms, function (form) {
      applyServerErrors(form);
      initProfile(form);
    });
  };

  if (document.readyState !== "loading") NS.initProfileForm();
  else
    document.addEventListener("DOMContentLoaded", function () {
      NS.initProfileForm();
    });
})();