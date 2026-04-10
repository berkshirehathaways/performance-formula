/* ═══════════════════════════════════════════════
   COMPASS — engine.js  v3
   프롬프트 완전 정렬:
   · 목표 타입 분류 (Outcome / Process / Identity)
   · 9요소 전체 분석
   · 곱셈 구조 기반 병목 탐지
   · 시스템 맵 (Strengths / Constraints / Unknowns)
   · 상호작용 체인 분석
   · Leading Indicators 도메인 특화
   · 3단계 100일 계획 (Stabilize / Build / Integrate)
   · 성찰 기반 재계산 루프
   Pure functions — no DOM access
═══════════════════════════════════════════════ */

/* ── GOAL TYPE CLASSIFIER ───────────────────── */
function classifyGoalType(goal) {
  const t = detectGoalType(goal);
  return { type: t, meta: GOAL_TYPES[t] || GOAL_TYPES.outcome };
}

/* ── FACTOR ANALYSIS ────────────────────────── */
function analyseFactors(factors) {
  return FACTORS.map(meta => {
    const f     = factors[meta.key] || { score: 5, reflection: '' };
    const score = f.score;
    let type;
    if      (score <= 3) type = 'bottleneck';
    else if (score >= 7) type = 'strength';
    else                 type = 'neutral';
    return { factor: meta, score, type, reflection: f.reflection || '',
             insight: type === 'bottleneck' ? meta.lowMsg : meta.highMsg };
  }).sort((a, b) => {
    const ord = { bottleneck: 0, neutral: 1, strength: 2 };
    return ord[a.type] - ord[b.type];
  });
}

/* ── MULTIPLICATIVE BOTTLENECK SCORE ────────── */
/**
 * 곱셈 구조에서 가장 낮은 요소가 전체를 제한한다.
 * 단순 평균 대신 최소값을 병목 지수로 사용.
 */
function computeBottleneck(factorAnalysis) {
  const sorted  = [...factorAnalysis].sort((a, b) => a.score - b.score);
  const bottom  = sorted[0];
  const second  = sorted[1];
  const avgAll  = factorAnalysis.reduce((s, f) => s + f.score, 0) / factorAnalysis.length;

  return {
    primary:   bottom,
    secondary: second,
    avgScore:  Math.round(avgAll * 10) / 10,
    // 만약 최솟값이 5 미만이면 명확한 병목
    hasClear:  bottom.score < 5,
    // 퍼포먼스 잠재력 손실 = (avgScore - minScore) / avgScore
    lossRatio: Math.round(((avgAll - bottom.score) / avgAll) * 100),
  };
}

/* ── SYSTEM MAP ─────────────────────────────── */
/**
 * Strengths / Constraints / Unknowns 세 버킷으로 분류
 */
function buildSystemMap(factorAnalysis) {
  const strengths   = factorAnalysis.filter(f => f.type === 'strength');
  const constraints = factorAnalysis.filter(f => f.type === 'bottleneck');
  // score 5 또는 reflection이 비어있는 중간 요소 = 불확실
  const unknowns    = factorAnalysis.filter(f =>
    f.type === 'neutral' &&
    (!f.reflection || (f.reflection && f.reflection.length < 10))
  );

  return { strengths, constraints, unknowns };
}

/* ── IMPACT CHAINS ──────────────────────────── */
function computeImpactChains(factorAnalysis) {
  const byKey = {};
  factorAnalysis.forEach(f => { byKey[f.factor.key] = f; });

  return factorAnalysis
    .filter(f => f.type === 'bottleneck')
    .flatMap(({ factor, score }) =>
      (factor.affects || [])
        .filter(targetKey => byKey[targetKey])
        .map(targetKey => {
          const sev = score <= 2 ? 'high' : score <= 4 ? 'mid' : 'low';
          return {
            from:      factor,
            to:        byKey[targetKey].factor,
            fromScore: score,
            toScore:   byKey[targetKey].score,
            severity:  sev,
            message:   _impactMsg(factor.label, byKey[targetKey].factor.label, sev),
          };
        })
    );
}

function _impactMsg(from, to, sev) {
  const word = sev === 'high' ? '심각하게' : sev === 'mid' ? '상당히' : '어느 정도';
  return `${from}의 제약이 ${to}를 ${word} 제한할 수 있습니다.`;
}

/* ── LEVERAGE POINTS ────────────────────────── */
function getTopLeveragePoints(factorAnalysis) {
  const bottlenecks = factorAnalysis.filter(f => f.type === 'bottleneck');
  const strengths   = factorAnalysis.filter(f => f.type === 'strength');
  const neutrals    = factorAnalysis.filter(f => f.type === 'neutral');

  const out = [];
  out.push(...bottlenecks.slice(0, 2));
  if (!bottlenecks.length) out.push(...neutrals.slice(-2));
  if (strengths.length)  out.push(strengths[0]);
  else if (out.length < 2) out.push(...neutrals.slice(0, 1));
  return out.slice(0, 4);
}

/* ── SYSTEM FORMATION ───────────────────────── */
function buildNorthStar(goal, desiredOutcome, goalType) {
  if (!goal) return '목표를 향한 지속적인 성장';
  const prefix = goalType === 'identity' ? '나는 ' : '';
  return desiredOutcome ? `${prefix}${goal} — ${desiredOutcome}` : `${prefix}${goal}`;
}

function buildDrivers(factorAnalysis) {
  return factorAnalysis.map(({ factor, type }) => ({
    ...factor,
    role:      type === 'strength' ? 'accelerator' : type === 'bottleneck' ? 'focus' : 'neutral',
    roleLabel: type === 'strength' ? '가속 요소'   : type === 'bottleneck' ? '집중 개선' : '성장 여지',
  }));
}

/* ── LEADING INDICATORS (맞춤형 신호) ────────── */
function buildSignals(factorAnalysis, goal, domain) {
  const bottlenecks = factorAnalysis.filter(f => f.type === 'bottleneck');

  // 요소 × 도메인 신호 매트릭스
  const bank = {
    energy:        { fitness:'훈련 전후 에너지 수준 (1-10)', writing:'글쓰기 전 집중도 점수', career:'업무 집중 피크 타임 기록', learning:'학습 세션 집중 유지 시간', general:'주간 에너지 평균 (1-10)' },
    context:       { general:'이번 주 맥락적 기회/방해 요소 메모' },
    social:        { general:'피드백 수신 횟수 / 지원 접촉 횟수' },
    tacit:         { fitness:'실전 감각 향상 체감 점수', writing:'글쓰기 흐름 느낌 점수', general:'직관적 판단 자신감 점수' },
    explicit:      { learning:'학습한 개념 적용 횟수', general:'새로 배운 것을 설명한 횟수' },
    practice:      { fitness:'의도적 훈련 세션 완료 수', writing:'집중 글쓰기 세션 수', career:'연습·시뮬레이션 횟수', learning:'능동적 회상 세션 수', general:'의도적 연습 세션 완료 수' },
    habits:        { fitness:'운동 루틴 완료율 (%)', writing:'매일 글쓰기 완료 일수', general:'핵심 습관 완료율 (%)' },
    tools:         { general:'집중 방해 요소 발생 횟수' },
    metaAwareness: { general:'주간 성찰 노트 작성 여부' },
  };

  const signals = [];
  bottlenecks.forEach(({ factor }) => {
    const b = bank[factor.key];
    if (b) signals.push(b[domain] || b['general']);
  });

  if (goal) signals.push(`"${goal.slice(0, 22)}${goal.length > 22 ? '…' : ''}" 주간 진행 체감 (1-10)`);

  // 항상 메타인지 신호 포함
  if (!signals.includes(bank.metaAwareness.general)) signals.push(bank.metaAwareness.general);

  const fallbacks = ['주간 에너지 평균 (1-10)', '핵심 습관 완료율 (%)', '피드백 수신 횟수'];
  fallbacks.forEach(f => { if (signals.length < 3 && !signals.includes(f)) signals.push(f); });

  return signals.slice(0, 5);
}

/* ── PRACTICES (핵심 실천 항목) ──────────────── */
function buildPractices(factorAnalysis, goalType, domain) {
  const bottlenecks = factorAnalysis.filter(f => f.type === 'bottleneck');
  const practices   = [];

  const practiceBank = {
    energy:        ['수면 루틴 고정 (취침·기상 일정화)', '에너지 피크 시간대에 핵심 작업 배치', '신체 활성화 루틴 (일 10-20분)'],
    context:       ['외부 기회·위협 주 1회 스캔 및 메모', '맥락 변화에 맞게 전략 유연하게 조정'],
    social:        ['피드백을 줄 수 있는 1명과 격주 연결', '같은 목표의 커뮤니티 1곳 참여'],
    tacit:         ['실전 경험 의도적으로 늘리기 (주 1회 이상)', '경험 후 즉시 "무엇을 느꼈나" 기록'],
    explicit:      ['핵심 지식 갭 리스트 작성 및 우선순위 지정', '배운 개념을 자기 언어로 설명하는 연습'],
    practice:      ['의도적 연습: 약점 집중 + 즉각 피드백', '연습 세션 목표 사전 정의 + 사후 검토'],
    habits:        ['핵심 습관 1개 설계 → 30일 고착화', '기존 루틴에 새 행동 연결 (습관 스태킹)'],
    tools:         ['작업 공간 방해 요소 3가지 제거', '집중 트리거 (도구, 공간, 의식) 설계'],
    metaAwareness: ['주 1회 15분 성찰 루틴 캘린더 고정', '"무엇이 작동했나 / 무엇을 바꿀까" 2가지로 성찰'],
  };

  bottlenecks.forEach(({ factor }) => {
    const bank = practiceBank[factor.key];
    if (bank) practices.push(bank[0]);
  });
  // 항상 메타인지 실천 포함
  if (!practices.includes(practiceBank.metaAwareness[0])) practices.push(practiceBank.metaAwareness[0]);

  return practices.slice(0, 5);
}

/* ── 100-DAY PLAN ───────────────────────────── */
/**
 * 3단계: Stabilize → Build → Integrate
 * 각 단계에 'intent'(학습 의도) 명시
 */
function generatePlan(session) {
  const { goal, factors, desiredOutcome, goalType } = session;
  const totalDays      = Math.min(100, Math.max(14, parseInt(session.planDurationDays || 100, 10)));
  const domain         = session.goalDomain || detectDomain(goal);
  const factorAnalysis = analyseFactors(factors);
  const bottlenecks    = factorAnalysis.filter(f => f.type === 'bottleneck');
  const strengths      = factorAnalysis.filter(f => f.type === 'strength');
  const goalG          = goal ? `"${goal.slice(0, 28)}${goal.length > 28 ? '…' : ''}"` : '목표';

  const actionBank = _buildActionBank(domain, goal);

  /* ── Phase 1: Stabilize — 인식과 관찰 ── */
  const phase1 = [];
  const p1Focus = bottlenecks.length > 0 ? bottlenecks.slice(0, 2) : factorAnalysis.slice(0, 2);
  p1Focus.forEach(({ factor }) => { const a = actionBank[factor.key]; if (a) phase1.push(a[0]); });
  if (!p1Focus.find(f => f.factor.key === 'energy')) phase1.push(actionBank.energy[0]);
  phase1.push(`${goalG} 현재 상태 베이스라인 기록 시작`);
  phase1.push('9요소 각각에 대한 주간 관찰 일지 시작');

  /* ── Phase 2: Build — 핵심 드라이버 강화 ── */
  const phase2 = [];
  bottlenecks.slice(0, 3).forEach(({ factor }) => { const a = actionBank[factor.key]; if (a?.[1]) phase2.push(a[1]); });
  if (!bottlenecks.find(f => f.factor.key === 'practice')) phase2.push(actionBank.practice[1]);
  if (!bottlenecks.find(f => f.factor.key === 'metaAwareness')) phase2.push(actionBank.metaAwareness[0]);
  phase2.push(`${goalG} 중간 점검 및 시스템 재조정`);

  /* ── Phase 3: Integrate — 일관성과 통합 ── */
  const phase3 = [];
  strengths.slice(0, 2).forEach(({ factor }) => { const a = actionBank[factor.key]; if (a?.[2]) phase3.push(a[2]); });
  if (!phase3.length) phase3.push(actionBank.habits[2]);
  phase3.push(actionBank.metaAwareness[1]);
  phase3.push(`${goalG} ${totalDays}일 성과 리뷰 및 다음 사이클 설계`);

  const p1End = Math.max(1, Math.round(totalDays / 3));
  const p2End = Math.max(p1End + 1, Math.round((totalDays * 2) / 3));
  const phaseDays = {
    phase1: `1일 ~ ${p1End}일`,
    phase2: `${p1End + 1}일 ~ ${p2End}일`,
    phase3: `${p2End + 1}일 ~ ${totalDays}일`,
  };

  return {
    phase1: {
      name: 'Stabilize',  nameKo: '안정화',
      emoji: '🌱', days: phaseDays.phase1,
      intent: '패턴 인식과 시스템 관찰',
      focus:  '인식 · 관찰 · 기초 구조 확립',
      phaseDesc: '지금 무슨 일이 일어나고 있는지 이해하는 단계입니다. 행동하기 전에 먼저 당신의 시스템을 관찰하세요.',
      actions: phase1.slice(0, 4),
    },
    phase2: {
      name: 'Build',  nameKo: '구축',
      emoji: '🔥', days: phaseDays.phase2,
      intent: '레버리지 발견과 핵심 드라이버 강화',
      focus:  '역량 심화 · 핵심 요소 집중 개선',
      phaseDesc: '어디에 집중해야 가장 큰 변화가 생기는지 파악했습니다. 이제 그 지점을 집중적으로 강화합니다.',
      actions: phase2.slice(0, 4),
    },
    phase3: {
      name: 'Integrate', nameKo: '통합',
      emoji: '🚀', days: phaseDays.phase3,
      intent: '일관성 확보와 개선을 자연스럽게 만들기',
      focus:  '시스템화 · 자동화 · 지속 가능한 통합',
      phaseDesc: '개별 행동들이 하나의 통합된 시스템으로 작동하게 만드는 단계입니다. 이제 개선이 자연스러워집니다.',
      actions: phase3.slice(0, 4),
    },
  };
}

/* ── ACTION BANK (도메인 특화) ──────────────── */
function _buildActionBank(domain, goal) {
  const g = goal ? `"${goal.slice(0, 28)}${goal.length > 28 ? '…' : ''}"` : '목표';

  const fitness = {
    energy:        ['수면 루틴 고정 + 훈련 전 활성화 루틴 시작', '에너지 피크 시간대에 핵심 훈련 배치', '운동 후 충분한 회복 루틴 설계'],
    context:       ['훈련 환경·장소 평가 및 최적화', '시즌·컨디션에 맞게 훈련 강도 조정', '외부 코칭·대회 맥락 활용 계획'],
    social:        ['코치 또는 트레이너 정기 피드백 확보', '훈련 파트너 또는 챌린지 그룹 연결', '커뮤니티 진행 상황 공유'],
    tacit:         ['실전 훈련 중 몸의 피드백 관찰 기록', '감각적 판단력 향상을 위한 의식적 훈련', '경험 후 즉시 느낌 노트 작성'],
    explicit:      [`${g} 목표 기록 분석 및 핵심 기술 요소 파악`, '전문 자료 및 코치 조언 체계화', '기술 원리 이해 → 적용 → 검증 사이클'],
    practice:      ['베이스라인 측정 + 약점 파악 시작', '의도적 훈련: 약점 집중 + 즉각 피드백', '점진적 과부하로 훈련 강도 체계화'],
    habits:        ['훈련 루틴 캘린더 블로킹', '준비 루틴 자동화 (장비, 영양, 시간)', '훈련 일지 1줄 기록 습관화'],
    tools:         ['훈련 환경 최적화 (장소, 장비, 측정 도구)', '분석 도구 도입 (기록, 영상 등)', '회복 환경 설계 (수면, 이완)'],
    metaAwareness: ['주간 훈련 성찰 일지 시작', '"무엇이 나아졌나" 패턴 추적', '100일 후 목표와 현재 갭 재검토'],
  };

  const writing = {
    energy:        ['글쓰기 전 에너지 루틴 설계', '오전 골든 타임 글쓰기 블록 확보', '인지 피로 구간엔 리서치·편집으로 전환'],
    context:       ['독자와 플랫폼 맥락 파악', '글쓰기 트렌드 및 피드백 환경 평가', '출판·공유 채널 탐색'],
    social:        ['베타 리더 1명 확보', '글쓰기 동료와 피드백 교환 루틴', '글쓰기 커뮤니티 참여'],
    tacit:         ['좋은 글 50편 분석 및 패턴 추출', '글 쓴 후 "무엇이 작동했나" 즉시 메모', '글쓰기 감각 루틴 개발'],
    explicit:      ['핵심 글쓰기 원칙 체계화', '구조·논리·어휘 집중 학습', '피드백 분류 및 재훈련'],
    practice:      ['매일 30분 초안 작성 (퀄리티 무시)', '의도적 글쓰기: 특정 기술 집중 훈련', '쓴 글 소리 내어 읽고 흐름 점검'],
    habits:        ['매일 같은 시간 글쓰기 루틴 고정', '최소 200단어 규칙 (시작 장벽 제거)', '글쓰기 전 의식(ritual) 설계'],
    tools:         ['글쓰기 전용 공간 + 방해 차단', '풀스크린 편집기 + 알림 끄기', '참고 자료 즉시 접근 체계화'],
    metaAwareness: ['글 작성 후 핵심 메시지 1줄 정리', '독자 반응 패턴 분석', '월간 글쓰기 스타일 변화 검토'],
  };

  const learning = {
    energy:        ['학습 전 신체 활성화 루틴', '최적 집중 시간대 파악 및 핵심 학습 배치', '집중 저하 신호 인식 → 즉시 휴식'],
    context:       ['학습 목적과 활용 맥락 명확화', '최신 트렌드 및 관련 커뮤니티 파악', '학습 환경 최적화'],
    social:        ['스터디 그룹 또는 학습 파트너 연결', '전문가 질문 채널 확보', '진행 상황 공유 구조 생성'],
    tacit:         ['배운 내용 즉시 실제 문제에 적용', '직관 개발을 위한 패턴 인식 훈련', '경험 기반 예시 수집'],
    explicit:      [`${g} 커리큘럼 역설계 및 지식 지도 작성`, '메타인지 학습: 아는 것과 모르는 것 구분', '파인만 기법으로 이해도 검증'],
    practice:      ['능동적 회상 (플래시카드, 퀴즈) 적용', '배운 내용을 실제 문제에 적용', '스페이스드 리피티션 도입'],
    habits:        ['매일 학습 블록 캘린더 고정', '"오늘의 학습 목표" 1문장 작성 루틴', '학습 완료 후 짧은 정리 노트'],
    tools:         ['학습 전용 공간 + 방해 제거 프로토콜', 'SNS 차단 앱 + 딥워크 환경 구축', '지식 관리 시스템 도입'],
    metaAwareness: ['학습 후 "오늘 배운 것 3가지" 기록', '주간 학습 리뷰: 이해 vs 암기 비율', '월간 지식 지도 업데이트'],
  };

  const general = {
    energy:        ['수면 루틴 고정: 취침·기상 일정화', '에너지 피크 시간대에 핵심 작업 배치', '주 3회 이상 신체 활동으로 에너지 기반 확보'],
    context:       ['현재 맥락의 기회와 위협 파악', '외부 환경 변화 주 1회 스캔', '맥락에 맞는 전략적 포지셔닝'],
    social:        ['같은 방향의 동료 1명 연결', '격주 진행 상황 공유 파트너 설정', '멘토에게 월 1회 피드백 요청'],
    tacit:         ['실전 경험 의도적으로 늘리기', '경험 후 즉시 느낌과 관찰 기록', '패턴 인식 능력 개발'],
    explicit:      [`${g} 핵심 지식 갭 파악 및 우선순위 지정`, '매일 30분 핵심 학습 블록 확보', '학습 → 실습 → 피드백 사이클'],
    practice:      ['연습 세션 목표를 구체적으로 정의', '의도적 연습: 약점 집중 반복 훈련', '연습 후 "오늘 무엇이 나아졌나" 메모'],
    habits:        ['핵심 습관 1개 설계 → 30일 유지', '기존 습관에 새 행동 연결', '습관 추적으로 연속 달성 시각화'],
    tools:         ['작업 공간 방해 요소 3가지 제거', '집중 모드 트리거 설계', '필요 도구 즉시 접근 가능한 위치 배치'],
    metaAwareness: ['주 1회 15분 성찰 블록 고정', '"잘된 것 / 개선할 것" 2가지 질문으로 성찰', '월간 리뷰: 계획 vs 실제 갭 분석'],
  };

  const banks = { fitness, writing, learning, general };
  const selected = banks[domain] || banks.general;

  // career/creativity/social 도메인은 general에서 시작
  return selected;
}

/* ── STRETCH & RECOVERY ─────────────────────── */
function buildStretchRecovery(factorAnalysis) {
  const bottlenecks = factorAnalysis.filter(f => f.type === 'bottleneck');
  const tips = [
    '성장은 도전과 회복의 리듬에서 나옵니다.',
    '매 3-4일 고강도 작업 후 의식적인 회복 시간을 설계하세요.',
    '소진 신호 (집중 불가, 짜증, 무기력)를 조기에 인식하세요.',
  ];
  if (bottlenecks.find(f => f.factor.key === 'energy')) {
    tips.unshift('에너지가 낮은 상태에서는 회복이 더욱 중요합니다. 먼저 회복 루틴을 설계하세요.');
  }
  return tips;
}

/* ── REFLECTION ANALYSIS ────────────────────── */
function analyseReflection(session) {
  const text = ((session.reflectionUseful || '') + ' ' + (session.reflectionAdjust || '')).toLowerCase();
  const adjustments = [];

  const map = [
    { kws: ['에너지', '피곤', '지침', '소진', '체력', '수면'],                key: 'energy',        msg: '에너지 루틴을 더 강화하세요.' },
    { kws: ['맥락', '환경', '타이밍', '운', '기회', '상황'],                  key: 'context',       msg: '맥락과 타이밍을 재평가해 보세요.' },
    { kws: ['혼자', '도움', '피드백', '지원', '동료', '멘토', '커뮤니티'],    key: 'social',        msg: '사회적 지원 시스템을 보강하세요.' },
    { kws: ['감각', '직관', '경험 부족', '모르겠'],                           key: 'tacit',         msg: '실전 경험을 더 쌓는 것이 도움됩니다.' },
    { kws: ['공부', '이해', '모름', '자료', '배워야'],                        key: 'explicit',      msg: '핵심 지식 갭을 파악하고 학습하세요.' },
    { kws: ['연습', '훈련', '반복', '연습량'],                                key: 'practice',      msg: '의도적 연습의 질과 빈도를 높이세요.' },
    { kws: ['습관', '루틴', '꾸준', '지속'],                                  key: 'habits',        msg: '핵심 습관을 더 단단하게 구축하세요.' },
    { kws: ['공간', '도구', '방해', '환경 정리', '장비'],                     key: 'tools',         msg: '도구와 환경을 최적화하세요.' },
    { kws: ['돌아봐', '성찰', '일지', '기록', '패턴'],                        key: 'metaAwareness', msg: '성찰 루틴의 깊이와 빈도를 높이세요.' },
  ];

  map.forEach(({ kws, key, msg }) => {
    if (kws.some(k => text.includes(k))) adjustments.push({ factor: key, suggestion: msg });
  });

  return {
    adjustments: adjustments.slice(0, 3),
    regenerate:  adjustments.length > 0,
    summary:     adjustments.length > 0
      ? `성찰 내용에서 ${adjustments.length}가지 조정 포인트를 발견했어요.`
      : '좋은 성찰이에요. 현재 시스템을 유지하며 계속 나아가세요.',
  };
}

/* ── PLANNING LOCK GUARD ────────────────────── */
/**
 * Returns true only if all 9 elements have been reviewed.
 * The 100-day plan MUST NOT be generated before this returns true.
 */
function isPlanningUnlocked(session) {
  return Session.isPlanningUnlocked();
}

/**
 * Safe plan generator — respects planning lock.
 * Returns null if planning is still locked.
 */
function generatePlanSafe(session) {
  if (!isPlanningUnlocked(session)) {
    console.warn('COMPASS: Planning locked — complete all 9 elements first.');
    return null;
  }
  return generatePlan(session);
}

/* ── FULL SYSTEM BUILDER ────────────────────── */
function buildSystem(session) {
  const factorAnalysis = analyseFactors(session.factors);
  const leveragePoints = getTopLeveragePoints(factorAnalysis);
  const impactChains   = computeImpactChains(factorAnalysis);
  const bottleneckData = computeBottleneck(factorAnalysis);
  const systemMap      = buildSystemMap(factorAnalysis);
  const domain         = detectDomain(session.goal);

  Session.set('goalDomain', domain);

  const northStar = buildNorthStar(session.goal, session.desiredOutcome, session.goalType);
  const drivers   = buildDrivers(factorAnalysis);
  const signals   = buildSignals(factorAnalysis, session.goal, domain);
  const practices = buildPractices(factorAnalysis, session.goalType, domain);
  const plan      = generatePlanSafe(session) || session.plan;
  const stretch   = buildStretchRecovery(factorAnalysis);

  Session.set('system.northStar', northStar);
  Session.set('system.drivers',   drivers);
  Session.set('system.signals',   signals);
  Session.set('system.practices', practices);
  Session.set('plan',             plan);

  // 시스템맵 업데이트
  Session.set('systemMap.strengths',   systemMap.strengths.map(f => f.factor.key));
  Session.set('systemMap.constraints', systemMap.constraints.map(f => f.factor.key));
  Session.set('systemMap.unknowns',    systemMap.unknowns.map(f => f.factor.key));

  if (bottleneckData.hasClear) {
    Session.set('bottleneck', bottleneckData.primary.factor.key);
  }

  return { factorAnalysis, leveragePoints, impactChains, bottleneckData, systemMap, northStar, drivers, signals, practices, plan, stretch, domain };
}

/* ── HELPERS ────────────────────────────────── */
function scoreColor(score) {
  if (score <= 3) return 'var(--c-low)';
  if (score <= 6) return 'var(--c-mid)';
  return 'var(--c-high)';
}

function scoreLabel(score) {
  if (score <= 2) return '매우 낮음';
  if (score <= 4) return '낮음';
  if (score <= 6) return '보통';
  if (score <= 8) return '높음';
  return '매우 높음';
}

function calcEnergyScore(energySub) {
  const vals = Object.values(energySub).filter(v => typeof v === 'number');
  if (!vals.length) return 5;
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}
