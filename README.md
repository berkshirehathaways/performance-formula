# ◎ Compass — 나만의 퍼포먼스 시스템

> **Performance Formula:**  
> `Performance = Energy(CAP) × Luck × Social Cap × VTK × VEK × Practice × Habit × Tools × Meta-cog`

---

## 현재 완성된 기능

### ✅ 엄격한 순차 플로우 (Strict Sequential Flow)
- **Step 0** 웰컴 화면 — 공식 소개, 4단계 여정 미리보기
- **Step 1** 목표 설정 — 목표 입력, 타입 분류 (결과/과정/정체성), 도메인 자동 감지
- **Step 2** 현황 파악 — 현재 상황, 제약, 원하는 결과
- **Step 3** 9요소 순차 진단 (엄격 시행)
  - **에너지(Energy/CAP) → 맥락(Luck) → 사회적 자본(Social Cap) → 암묵지(VTK) → 명시지(VEK) → 연습(Practice) → 습관(Habit) → 도구(Tools) → 메타인지(Meta-cog)** 순서 고정
  - 한 번에 한 요소만 표시
  - 각 요소: 간략 설명 → 성찰 질문 → 자기점검 질문 → 슬라이더 → 성찰 텍스트
  - 사용자가 "다음 요소" 버튼을 직접 클릭해야만 진행
  - 공식 바(Formula Bar)가 항상 상단에 표시되며 현재 요소 하이라이트
  - 9개 완료 전까지 100일 계획 잠금(🔒)
- **Step 4** 시스템 매핑 — 강점/제약/불확실 분류, 병목 선택 (대화형)
- **Step 5** 레버리지 & 시스템 형성 — 북극성 목표, 핵심 드라이버, 측정 신호
- **Step 6** 100일 계획 — Phase 1(Stabilize) / Phase 2(Build) / Phase 3(Integrate)
  - **Phase별 주간 회고 루프 (NEW)**: 각 Phase 카드 내부에 주차 탭(1~5주) 내장
    - 이번 주 진행도 (⭐ 별점 1~5)
    - 이번 주 잘 된 것
    - 어려웠던 것 / 조정할 것
    - 다음 주 한 가지 행동
    - "회고 저장" 버튼 → 탭에 ✓ 뱃지 + 진행 바 업데이트
- **Step 7** 성찰 & 재진단 — 요소별 재진단 버튼, 주간 체크인
  - **Phase별 주간 회고 현황 요약 (NEW)**: Stabilize/Build/Integrate 각 Phase의 완료 주차 수 + 진행 바
  - "→ 100일 계획으로 이동해 회고 작성" 버튼으로 Step 6 이동 가능
- **Step 8** 시스템 완성 요약 — 전체 공식 현황, 레버리지, 계획 요약

### ✅ 핵심 behavioral contract
- **NO auto-advance** — 모든 단계 사용자가 수동으로 진행
- **Planning LOCK** — 9요소 미완료 시 Step 6(100일 계획) 접근 차단 (Lock Gate UI)
- **Formula Bar** — Step 3 전체에서 `P = Energy × Luck × … × Meta-cog` 항상 표시
- **Element brief** — 각 요소 시작시 간략한 영어 설명 (Energy=CAP, VTK=tacit 등) 항상 표시
- **Self-check** — 3개 자기점검 질문 기본 노출 (collapse 없음)
- **Revisit** — 성찰 단계에서 요소별 재진단 버튼 제공
- **State persistence** — localStorage 자동 저장 (compass_v5 키)

---

## 기능 진입점 (Entry URIs)

| 경로 | 기능 |
|------|------|
| `index.html` | 메인 앱 (단일 페이지, 8단계 플로우) |
| `index.html` + localStorage `compass_v5` 존재 | 이전 세션 이어서 진행 |

### 앱 내부 플로우 (JavaScript Steps)
| Step | 설명 |
|------|------|
| `step0` | 웰컴 + 공식 소개 |
| `step1` | 목표 설정 + 타입 분류 |
| `step2` | 현황/상황 파악 |
| `step3` | 9요소 순차 진단 (currentElementIdx: 0-8) |
| `step4` | 시스템 매핑 + 병목 확인 |
| `step5` | 레버리지 + 시스템 형성 |
| `step6` | 100일 계획 (planning lock 해제 후만 접근) |
| `step7` | 성찰 루프 + 요소 재진단 |
| `step8` | 시스템 완성 요약 |

---

## 데이터 모델

### Session (localStorage: `compass_v5`)

```javascript
{
  version: 5,
  currentStep: 0,          // 0-8
  currentElementIdx: 0,    // 0-8 (Step 3 내부 순서)
  completedElements: [],   // 완료된 요소 키 배열
  planningLocked: true,    // completedElements.length < 9 이면 true
  
  goal: '',
  goalType: '',            // 'outcome' | 'process' | 'identity'
  goalDomain: '',          // 'fitness' | 'writing' | 'career' | 'learning' | 'creativity' | 'social' | 'general'
  
  factors: {
    energy:        { score: 5, reflection: '', confirmed: false },
    context:       { score: 5, reflection: '', confirmed: false },
    social:        { score: 5, reflection: '', confirmed: false },
    tacit:         { score: 5, reflection: '', confirmed: false },
    explicit:      { score: 5, reflection: '', confirmed: false },
    practice:      { score: 5, reflection: '', confirmed: false },
    habits:        { score: 5, reflection: '', confirmed: false },
    tools:         { score: 5, reflection: '', confirmed: false },
    metaAwareness: { score: 5, reflection: '', confirmed: false },
  },
  energySub: { physical: 5, cognitive: 5, emotional: 5 },
  
  system: { northStar, drivers, signals, practices },
  plan: { phase1, phase2, phase3 },
  
  reflectionUseful: '',
  reflectionAdjust: '',
  reflectionHarder: '',
  reflectionCommit: '',
  weeklyCheckins: [],
  reviewCount: 0,
}
```

### 9 Performance Elements (FACTORS 배열 순서)
| 순서 | 키 | formulaLabel | 설명 |
|------|----|-----------|----|
| 1 | `energy` | Energy(CAP) | Cognitive + Affective + Physical |
| 2 | `context` | Luck | 타이밍 · 외부 환경 · 기회 |
| 3 | `social` | Social Cap | Social Capital — 멘토 · 동료 · 피드백 |
| 4 | `tacit` | VTK | Tacit Knowledge — 경험으로 쌓인 암묵지 |
| 5 | `explicit` | VEK | Explicit Knowledge — 언어화된 명시지 |
| 6 | `practice` | Practice | 의도적 연습 품질 |
| 7 | `habits` | Habit | 자동화된 습관 |
| 8 | `tools` | Tools | 도구 · 환경 설계 |
| 9 | `metaAwareness` | Meta-cog | 메타인지 |

---

## 파일 구조

```
index.html              HTML shell (header, progress bar, nav, modal)
css/
  style.css             Design tokens + layout + components (v6 additions)
  animations.css        Keyframe animations
js/
  data.js               세션 데이터 모델, Storage, FACTORS, FORMULA_DISPLAY
  engine.js             순수 함수: 분석, 병목, 시스템맵, 100일 계획 생성
  ui.js                 UI 컨트롤러: progress, nav, toast, step 전환
  steps.js              스텝 렌더러 (StepRenderers + Nav + helpers)
  main.js               앱 부트스트랩 + 이벤트 연결
```

---

## 미구현 / 다음 단계 제안

### 미구현
- 사용자 계정 시스템 (서버 필요)
- 다중 세션 (목표 여러 개 동시 관리)
- PDF 내보내기
- 알림/리마인더

### 추천 다음 단계
1. **주간 체크인 알림** — Web Notifications API 활용 가능
2. **공유 기능** — URL에 세션 상태 인코딩
3. **다크/라이트 모드 토글**
4. **요소 점수 이력 추적** — 시간에 따른 성장 차트

---

## 배포

**Publish 탭에서 퍼블리시** — 원클릭으로 라이브 사이트 배포
