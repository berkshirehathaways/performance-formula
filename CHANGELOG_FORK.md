# Fork Changelog

## 2026-04-10

### Added
- Step 0에 목표 유형별 완성 예시 미리보기 블록 추가
- Step 0에 로컬 자동저장 안내 문구 추가
- Step 3에 목표 컨텍스트 스트립(북극성/목표) 추가
- Step 5에 계획 기간 프리셋(14/30/60/100일) 추가
- 인수인계 문서 `HANDOFF.md` 추가
- 의사결정 로그 `DECISIONS.md` 추가

### Changed
- 저장 표시를 순간 토스트형에서 `자동저장 HH:MM` 지속 노출로 변경
- 계획 기간을 기본 100일 유지 + 선택형 기간으로 확장
- Step 6/7/요약 문구를 선택된 기간 기준으로 동기화
- Phase 주차 분배를 기간 기반 계산으로 전환

### Fixed
- `buildSystemMap` unknown 분류가 사용자 reflection을 보지 않던 버그 수정
- `buildSystem` plan 생성 경로에서 safe guard 적용
- `signals/practices` 렌더링 escape 적용으로 출력 안전성 보강
- CSS `var(--font-sans)` 미정의 토큰을 `var(--font)`로 수정

### Guardrails Kept
- Step 3 순차 진단 구조 유지
- 9요소 완료 전 planning lock 유지
- 자동 진행 금지(수동 클릭 전환) 유지
