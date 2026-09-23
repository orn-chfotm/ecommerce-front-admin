---
description: "이커머스 관리자 프론트엔드의 FSD 아키텍처 규칙과 Next.js 스택 기준입니다."
---

# 프로젝트 아키텍처

## 대상

이 저장소는 **이커머스 관리자(admin) 프론트엔드**다. `package.json`의 `name`은 `ecommerce-api-admin`이다.

사용자 대상 스토어 프론트가 아니다. 화면과 도메인 용어는 운영자 관점으로 판단한다.

## 기술 스택과 설정

| 항목 | 값 | 출처 |
|---|---|---|
| Next.js | `16.2.4` | `package.json` |
| React | `19.2.4` | `package.json` |
| TypeScript | `strict` | `tsconfig.json` |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/postcss`) | `postcss.config.mjs` |
| Lint | `eslint` + `eslint-config-next` | `eslint.config.mjs` |
| 경로 별칭 | `@/*` → `./src/*` | `tsconfig.json` |

## FSD 구조

도메인과 애플리케이션 코드는 `src` 아래에 배치하고 Feature-Sliced Design(FSD) 구조를 따른다.
단, **FSD `pages` 레이어는 사용하지 않는다.** 페이지 조합은 `src/app`의 라우트가 담당한다.

```text
src/
  app/        FSD app 레이어 + Next.js App Router (라우팅, 레이아웃, 프로바이더, 전역 스타일)
  widgets/    여러 페이지에서 독립적으로 쓰이는 큰 UI 블록 (헤더, 사이드바 등)
  features/   운영자 액션과 유스케이스 단위 기능 (동사적 개념)
  entities/   도메인 모델 중심 UI, 타입, 로직 (명사적 개념)
  shared/     재사용 UI, API client, 유틸리티, 설정
  proxy.ts    앱 전체 요청 처리 (Next.js 16 Proxy, 필요해질 때 생성)
```

레이어 디렉토리는 **필요해질 때 생성**한다.

`public/`은 FSD 레이어가 아니라 Next.js 정적 자산 디렉토리이므로 `src` 밖 프로젝트 루트에 둔다.

### `pages` 레이어를 두지 않는 이유

- Next.js는 `src/pages`를 Pages Router 디렉토리로 인식한다. `src/app`과 함께 두면 라우팅이 양쪽으로 잡힌다.
- 현재 규모에서는 `page.tsx`가 features/widgets를 직접 조합해도 충분하다. 별도 화면 계층은 `page.tsx`와 역할이 겹친다.
- `eslint.config.mjs`의 `import/no-restricted-paths` 설정에는 `./src/pages` zone이 **의도적으로 남아 있다.** 수정하지 않는다.

## app 레이어

FSD app 레이어의 책임(라우터 설정, 진입점, 전역 상태, 전역 스타일, 프로바이더)을 Next.js App Router로 수행한다.
라우트 폴더 트리 전체를 app 레이어의 "라우팅" segment로 본다.

```text
src/app/
  layout.tsx                 진입점: <html>, 프로바이더 적용
  globals.css                전역 스타일
  _providers/                전역 프로바이더 ("use client" 래퍼)
  (public)/                  비로그인 영역 (로그인 등)
    auth/login/page.tsx
  (protected)/               운영자 인증 필요 영역
    layout.tsx               관리자 공통 틀: widgets 배치
    products/
      page.tsx               라우트: metadata, params, 데이터 조회, features/widgets 조합
      _components/           이 라우트 전용 배치와 클라이언트 상태 연결
```

### app에 두는 것

- 라우트 선언: params/searchParams 해석, `metadata`, segment config
- 페이지 조합: features/widgets 배치, 서버에서 조회한 데이터를 props로 전달
- 레이아웃 틀과 라우팅 경계: `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- 전역 프로바이더, 전역 스타일

### app에 두지 않는 것

- API 호출, 입력 검증, 도메인 로직 → `features` / `entities`
- 여러 페이지에서 재사용되는 UI 블록 → `widgets` 또는 `features`

### 라우트 폴더 규칙

- 라우트 폴더에는 Next.js 규칙 파일(`page`, `layout`, `loading`, `error`, `not-found` 등)과 private folder(`_` 접두사)만 둔다.
- `page.tsx`는 서버 컴포넌트로 유지한다. 클라이언트 동작이 필요하면 `_components`의 `"use client"` 컴포넌트로 분리한다.
- `_components`에는 **해당 라우트에서만 쓰는** 배치와 클라이언트 상태 연결만 둔다.
- 다른 라우트에서도 필요해지면 `_components`에서 import하지 않고 `widgets` 또는 `features`로 올린다.

### 화면 구성 기준

| 상황 | 처리 위치 |
|---|---|
| feature 하나 + 제목/배치 | `page.tsx`에서 직접 조합 |
| 여러 라우트에서 같은 기능 사용 | 기능은 `features`/`widgets`에 두고 각 `page.tsx`에서 직접 사용 |
| 서버에서 조회한 데이터 전달 | `page.tsx` |
| 필터, 정렬, 페이지 번호 등 공유 상태 | URL searchParams로 연결하고 `page.tsx`에서 읽음 |
| URL에 두기 어려운 일시 상태 연결 (선택 항목 등) | 라우트의 `_components` (`"use client"`) |
| 여러 페이지에서 독립적으로 쓰이는 큰 블록 | `widgets` |

feature끼리는 서로 import할 수 없으므로 feature 간 연결은 항상 `app`(또는 `widgets`)에서 한다.

### 인증 영역

- `(public)`, `(protected)` route group으로 인증 필요 여부를 구분한다. route group 이름은 URL에 포함되지 않는다.
- `(protected)/layout.tsx`만으로 접근을 막지 않는다. layout은 페이지 이동 시 다시 렌더링되지 않는다. (`node_modules/next/dist/docs/01-app/02-guides/authentication.md`)
- 요청 단계 리다이렉트는 `src/proxy.ts`에서, 실제 권한 확인은 데이터 요청 단계에서 한다.

## 의존 방향

- `app` → `widgets`, `features`, `entities`, `shared`
- `widgets` → `features`, `entities`, `shared`
- `features` → `entities`, `shared`
- `entities` → `shared`
- `shared` → 다른 FSD 레이어에 의존하지 않는다.
- 같은 레이어의 다른 slice는 import하지 않는다.

## 프레임워크 규칙

- 일반적인 Next.js 지식이 아니라 Next.js `16.2.4` 기준으로 판단한다.
- Next.js 라우팅, 레이아웃, 메타데이터, 서버/클라이언트 컴포넌트 동작, 설정, 빌드 동작을 변경하기 전에는 `node_modules/next/dist/docs/`의 관련 가이드를 읽는다.
  - 가이드로 확인되지 않는 동작은 추측하지 말고 `npm run build`로 실제 동작을 확인한 뒤 결과를 보고한다.
- 라우팅은 `src/app`의 App Router 디렉토리 매핑만 사용한다.

## 재검토 조건

아래 상황이 반복되면 페이지 조합 계층(`src/views`) 도입을 재검토하고 사용자 승인을 받는다. 이름은 Next.js와 충돌하므로 `src/pages`를 쓰지 않는다.

- `_components`에 API 호출이나 도메인 로직이 섞이기 시작할 때
- 라우트 폴더 안의 `_components`가 커져서 라우트 구조를 파악하기 어려울 때

## 변경 범위

- 요청된 동작에 필요한 레이어만 수정한다.
- 실제 호출 지점이 두 곳 이상 필요하거나 해당 코드 주변의 기존 패턴이 요구할 때만 추상화를 추가한다.
- 현재 변경으로 인해 사용되지 않게 된 import, 변수, 파일만 제거한다.

## 검증

- 코드를 변경하면 `npm run lint`를 실행한다. 단, 사용자가 명시적으로 실행하지 말라고 요청한 경우에는 생략한다.
- 변경이 라우팅, 레이아웃, 빌드 동작에 영향을 주면 `npm run build`를 실행한다.
- 검증 명령을 실행할 수 없으면 명령과 정확한 이유를 보고한다.

## [금지사항]

- 상위 레이어를 하위 레이어에서 import하지 않는다. (`shared`가 `entities`를, `entities`가 `features`를 import하지 않는다)
- 국소 구현을 편하게 만들기 위해 역방향 import를 만들지 않는다.
- 하위 레이어에서 `src/app`의 `_components`, `_providers`를 import하지 않는다.
- `src/pages`에 코드를 두지 않는다.
- 라우트 폴더에 private folder가 아닌 일반 폴더로 UI, hooks, 유틸리티를 두지 않는다.
- `_components`에 API 호출, 입력 검증, 도메인 로직을 두지 않는다.
- `src/app` 밖에 별도 라우팅 규칙을 만들지 않는다.
- `public/`을 `src` 안으로 옮기지 않는다.
- 사용될 곳이 정해지지 않은 FSD 레이어 디렉토리를 미리 만들지 않는다.
- 작업이 아키텍처 정리를 명시적으로 요구하지 않는 한 FSD 레이어 사이에서 파일을 이동하지 않는다.
- 사용자 승인 없이 `tsconfig.json`의 `paths`나 `src/app`의 위치를 변경하지 않는다.
- 사용자 승인 없이 `eslint.config.mjs`의 레이어 zone 설정을 변경하지 않는다.
- 사용자가 요청하지 않는 한 상태 관리 라이브러리, 요청 라이브러리, 포매터, 테스트 프레임워크를 새로 도입하지 않는다.
- 하나의 사용 사례만을 위해 범용 공통 유틸리티를 만들지 않는다.
- 이 문서와 코드가 충돌하면 추측으로 진행하지 않는다. 멈추고 충돌 내용을 먼저 보고한다.
