---
description: "리뷰 중 발견한 오류, 심각한 문제, 개선 사항을 이 프로젝트에 기록하는 기준입니다."
---

# 리뷰 로깅

리뷰 로그는 **이 프로젝트 안**에 남긴다.

`.ai-prompts/`는 `.claude` 문서를 작성할 때 참고하는 스타터 저장소(Git 서브모듈)다. 프로젝트 산출물은 이 디렉토리에 저장하지 않는다.

## 기록 위치

```text
.ai/reviews/<category>/YYYY-MM-DD-{slug}.md
```

| 디렉토리 | 용도 |
|---|---|
| `.ai/reviews/audit/` | 코드 오류, critical, error, improvement 리뷰 |
| `.ai/reviews/feature/` | 미구현 기능 갭 분석, 기능 추가 계획 |
| `.ai/reviews/design/` | AI 하네스, Agent 구조, 지침 파일 설계 기록 |
| `.ai/reviews/feedback/` | 사용자가 남긴 AI 작업 방식 피드백 |

## 기록 대상

- 오류(`error`): lint 실패, build 실패, 런타임 오류, 재현 가능한 동작 오류
- 심각한 문제(`critical`): 보안 위험, 권한 우회, 데이터 손실, 배포 실패 가능성
- 개선 사항(`improvement`): 품질, 유지보수성, 문서 명확성 개선 항목
- AI 설계, 작업 방식에 대한 피드백, 개선점

사용자가 "기록으로 남겨줘", "AI 피드백", "AI 개선점"처럼 기록을 명시적으로 요청하면 대화 답변과 별도로 위 경로에 `.md` 파일을 작성한다.

## 로그 형식

```md
## Review Log

- 날짜:
- 작업:
- 심각도: error | critical | improvement
- 분류:
- 위치:
- 내용:
- 재현 방법:
- 영향 범위:
- 제안 조치:
- 상태: open | resolved | deferred | rejected
- 사용자 승인 필요 여부:
```

## [금지사항]

- `.ai-prompts/` 내부에 이 프로젝트의 리뷰 로그를 남기지 않는다.
- 실패한 lint, build, 테스트를 improvement로 낮춰 기록하지 않는다.
- critical 항목을 사용자 승인 없이 resolved 처리하지 않는다.
- 기록 대상에 해당하는 항목을 로그 없이 구두 보고만 하고 넘어가지 않는다.
