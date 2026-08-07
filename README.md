# THRIVE Frontend

해커톤 프론트엔드 (HTML/CSS/JS). 화면 폭 **402px** 기준.

## 실행

VS Code **Live Server** 확장으로 `index.html`을 열면 됩니다.
(모듈 번들러 없이 순수 HTML/CSS/JS로 동작)

## 구조

```
repo/
├── index.html                  # 진입점 (라우팅 진입)
├── src/
│   ├── pages/
│   │   ├── auth/               # 로그인, 회원가입
│   │   ├── home/               # 홈
│   │   ├── record/               # 기록
│   │   └── mypage/               # 마이페이지
│   ├── components/              # 탭바, 입력필드, 점수표시 등 공통 컴포넌트
│   │   ├── tab-bar.js
│   │   ├── score-display.js
│   ├── styles/
│   │   ├── reset.css
│   │   ├── variables.css        # 색상/타이포 토큰
│   │   └── common.css
│   ├── scripts/
│   └── assets/
│       └── icons/
├── .gitignore
├── .prettierrc
└── README.md
```

## 컴포넌트 사용법

모든 컴포넌트는 전역 `THRIVE` 네임스페이스에 함수로 등록됩니다.
페이지 HTML에 스타일 3개 + 필요한 컴포넌트 스크립트를 불러온 뒤 사용하세요.

### 하단 탭바
```js
const tabbar = THRIVE.createTabBar({ active: "home" }); // "record" | "home" | "mypage"
app.append(tabbar);
```
실제 이동 경로는 `src/components/tab-bar.js`의 `TABS` 배열에서 수정.

### 입력 필드
```js
const email = THRIVE.createInputField({
  name: "email", label: "이메일", type: "email", hint: "로그인 이메일"
});
form.append(email);
email.getValue();                    // 값 읽기
email.setError("이미 가입된 이메일입니다");  // 오류 표시
email.clearError();                  // 오류 해제
```

## 새 화면 만들 때 기본 뼈대

```html
<div class="app">
  <!-- 헤더 자리 (다른 팀원 컴포넌트가 들어올 위치) -->
  <main class="app__body"><!-- 화면 내용 --></main>
  <div id="tabbar"></div>
</div>
```
`.app`(402px 세로 스택) 안에 `.app__body`(스크롤) → 탭바 순서.
헤더 컴포넌트가 준비되면 `.app__body` 위에 그대로 끼워 넣으면 됩니다.
(`--header-height: 56px` 토큰은 정렬 참고용으로 남겨둠)

## TODO (백엔드 연동)

현재는 화면만. 백엔드가 대부분 서버 렌더링(HTML) 방식이라
API 연동 시 해당 뷰들의 JSON 응답 여부/CORS/CSRF 정리 필요.
