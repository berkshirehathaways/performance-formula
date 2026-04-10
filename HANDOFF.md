# Compass Fork Handoff

## 목적
이 문서는 포크 버전의 변경 배경, 현재 상태, 운영 리스크를 빠르게 넘겨주기 위한 인수인계 문서다.

## 현재 기준점
- 작업 디렉터리: `/Users/stevenshin/performance-coach-fork`
- 최근 커밋: `b5b60db`
- 검증 상태: `node --check js/*.js` 통과

## 이번 변경의 핵심 의도
- 원래 구현 의도(진단 우선, lock gate, 수동 진행)를 유지한다.
- 피드백에서 확인된 이탈 원인(개념 장벽/저장 불안/목표 맥락 부재)을 최소 변경으로 낮춘다.
- 로그인/백엔드 없이도 신뢰감을 주는 UX를 먼저 확보한다.

## 반영 내용 요약
1. 온보딩 강화
- Step 0에 목표 유형별 완성 예시 미리보기 추가
- 로컬 자동저장 안내 문구 추가

2. 진단 중 맥락 강화
- Step 3 상단에 북극성/목표 스트립 추가

3. 저장 신뢰 강화
- 헤더 저장 표시를 `자동저장 HH:MM` 형태로 유지 표시

4. 기간 유연화 (기본 100일 유지)
- Step 5에서 기간 프리셋 `14/30/60/100일` 선택 추가
- Step 6/7/요약에서 선택 기간 기반 문구/주차/일수 반영

5. 안정성/품질 수정
- unknown 분류 버그 수정(메타 정의가 아닌 사용자 reflection 기준)
- plan 생성 시 safe guard 경유로 planning lock 의미 강화
- 일부 렌더링 XSS 리스크 완화(`signals/practices` escape)
- CSS 토큰 오류 수정(`--font-sans` -> `--font`)

## 변경 파일
- `js/data.js`
- `js/engine.js`
- `js/ui.js`
- `js/steps.js`
- `css/style.css`
- `IMPROVEMENT_PLAN.md`
- `HANDOFF.md` (본 문서)
- `CHANGELOG_FORK.md`
- `DECISIONS.md`

## 아직 안 한 것
- 실제 브라우저 E2E 수동 테스트
- 로그인/클라우드 저장(Supabase Auth + DB)
- JSON export/import
- 퍼널 계측(완주율/이탈률)

## 운영 리스크
1. 저장 범위
- 현재 저장은 브라우저 로컬 저장소 기준이다.
- 다른 기기/브라우저에서는 데이터가 동기화되지 않는다.

2. 기간 축소 시 의미 약화
- 100일 철학이 희석될 수 있어 기본값은 100일로 유지했다.

3. 예시 편향
- 예시를 정답처럼 따라갈 위험이 있어 자동 입력 기능은 제공하지 않았다.

## 다음 작업 추천 순서
1. 브라우저 수동 검증(모바일 포함)
2. GitHub 업로드 후 Vercel preview 배포
3. Supabase 기반 선택형 로그인 저장 PoC
