## Review Log

- 날짜: 2026-09-23
- 작업: project-architecture.md 전면 수정 후 `npm run lint` 실행
- 심각도: error
- 분류: lint 설정 오류
- 위치: `eslint.config.mjs` (`rules` 블록)
- 내용: 규칙 이름이 `import/no-restricted.paths`로 작성되어 있다. 올바른 이름은 `import/no-restricted-paths`다. ESLint가 설정 검증 단계에서 실패해 lint가 전혀 실행되지 않고, FSD 레이어 zone 검사도 동작하지 않는다.
- 재현 방법: `npm run lint`
  ```text
  TypeError: Key "rules": Key "import/no-restricted.paths": Could not find "no-restricted.paths" in plugin "import".
  ```
- 영향 범위: 프로젝트 전체 lint. 레이어 의존 방향 검사.
- 제안 조치: 규칙 이름을 `import/no-restricted-paths`로 수정한다. zone 내용(`./src/pages` 포함)은 그대로 둔다.
- 상태: open
- 사용자 승인 필요 여부: 필요 (`eslint.config.mjs` 변경은 승인 필수 항목)
