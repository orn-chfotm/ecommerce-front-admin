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

```text
src/
  app/        Next.js 라우팅, 레이아웃, 전역 설정, 엔트리 포인트
  pages/      페이지 단위 화면 조합
  widgets/    페이지를 구성하는 큰 UI 블록
  features/   운영자 액션과 유스케이스 단위 기능
  entities/   도메인 모델 중심 UI, 타입, 로직
  shared/     재사용 UI, API client, 유틸리티, 설정
```

현재 존재하는 레이어는 `src/app`뿐이다. 나머지 레이어는 **필요해질 때 생성**한다.

`public/`은 FSD 레이어가 아니라 Next.js 정적 자산 디렉토리이므로 `src` 밖 프로젝트 루트에 둔다.

## 의존 방향

- `app` → `pages`, `shared`의 프로젝트 설정
- `pages` → `widgets`, `features`, `entities`, `shared`
- `widgets` → `features`, `entities`, `shared`
- `features` → `entities`, `shared`
- `entities` → `shared`
- `shared` → 다른 FSD 레이어에 의존하지 않는다.

## 프레임워크 규칙

- 일반적인 Next.js 지식이 아니라 Next.js `16.2.4` 기준으로 판단한다.
- Next.js 라우팅, 레이아웃, 메타데이터, 서버/클라이언트 컴포넌트 동작, 설정, 빌드 동작을 변경하기 전에는 `node_modules/next/dist/docs/`의 관련 가이드를 읽는다.
  - 현재 설치본에는 이 디렉토리가 없다. 디렉토리가 없으면 추측하지 말고 `npm run build`로 실제 동작을 확인한 뒤 결과를 보고한다.
- 라우팅은 `src/app`의 App Router 디렉토리 매핑만 사용한다.

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
- `src/app` 밖에 별도 라우팅 규칙을 만들지 않는다.
- `public/`을 `src` 안으로 옮기지 않는다.
- 사용될 곳이 정해지지 않은 FSD 레이어 디렉토리를 미리 만들지 않는다.
- 작업이 아키텍처 정리를 명시적으로 요구하지 않는 한 FSD 레이어 사이에서 파일을 이동하지 않는다.
- 사용자 승인 없이 `tsconfig.json`의 `paths`나 `src/app`의 위치를 변경하지 않는다.
- 사용자가 요청하지 않는 한 상태 관리 라이브러리, 요청 라이브러리, 포매터, 테스트 프레임워크를 새로 도입하지 않는다.
- 하나의 사용 사례만을 위해 범용 공통 유틸리티를 만들지 않는다.
- 이 문서와 코드가 충돌하면 추측으로 진행하지 않는다. 멈추고 충돌 내용을 먼저 보고한다.
