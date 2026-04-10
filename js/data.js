/* ═══════════════════════════════════════════════
   COMPASS — data.js  v5
   Performance Formula System
   Performance = Energy(CAP) × Luck × Social Cap
               × VTK × VEK × Practice × Habit
               × Tools × Meta-cog

   STRICT SEQUENTIAL FLOW:
   · Each element explored ONE AT A TIME
   · Planning LOCKED until ALL 9 complete
   · No auto-advance — user must click "Next"
═══════════════════════════════════════════════ */

const STORAGE_KEY = 'compass_v5';

const defaultSession = () => ({
  version: 5,
  currentStep: 0,
  completedSteps: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  reviewCount: 0,
  lastReviewAt: null,

  /* ── Step 1 — Goal ── */
  goal:              '',
  goalWhy:           '',
  goalType:          '',   // 'outcome' | 'process' | 'identity'
  goalDomain:        '',
  goalTypeConfirmed: false,

  /* ── Step 2 — Context ── */
  currentSituation: '',
  constraints:      '',
  desiredOutcome:   '',

  /* ── Step 3 — Formula Element Review (ONE AT A TIME) ── */
  // currentElementIdx: which element is being reviewed (0-8)
  currentElementIdx: 0,
  // completedElements: list of element keys that have been reviewed
  completedElements: [],
  // planningLocked: MUST be false before plan generation
  planningLocked: true,

  // Luck special data
  luckData: {
    selfBeliefScore:  0,       // 1-5: "나는 운이 좋은 사람이다" 자기인식 점수
    contextDirection: '',      // 'tailwind' | 'headwind' | 'neutral'
    selfBelief:       false,   // 운 자기인식
    positioning:      false,   // 포지셔닝
    readiness:        false,   // 기회 준비도
    recognition:      false,   // 기회 인식력
  },

  // Per-element data
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
  // Energy sub-scales (removed from UI — CAP is acronym only)
  energySub: { physical: 5, cognitive: 5, emotional: 5 },

  /* ── Step 4 — Synthesis ── */
  systemMap: {
    strengths:   [],
    constraints: [],
    unknowns:    [],
  },
  bottleneck:          '',
  bottleneckConfirmed: null,

  /* ── Step 5 — System Formation ── */
  leverageConfirmed: null,
  system: {
    northStar: '',
    drivers:   [],
    signals:   [],
    practices: [],
  },

  /* ── Step 6 — 100-Day Plan (LOCKED until all 9 done) ── */
  planDurationDays: 100, // 기본 100일, 필요 시 14/30/60/100 선택
  plan: {
    phase1: { name: '', emoji: '', days: '', intent: '', focus: '', actions: [] },
    phase2: { name: '', emoji: '', days: '', intent: '', focus: '', actions: [] },
    phase3: { name: '', emoji: '', days: '', intent: '', focus: '', actions: [] },
  },

  /* ── Step 6 — Phase별 주간 회고 루프 ── */
  // phaseWeeklyLogs: 각 Phase(1/2/3) 별로 주(week) 단위 체크인 배열
  // 각 항목: { week: 1, phaseKey: 'phase1', date: timestamp,
  //            progress: 1-5, wins: '', struggles: '', nextAction: '' }
  phaseWeeklyLogs: {
    phase1: [],   // Stabilize (Day 1-33)  — 주당 1회, 최대 ~5주
    phase2: [],   // Build     (Day 34-67) — 주당 1회, 최대 ~5주
    phase3: [],   // Integrate (Day 68-100)— 주당 1회, 최대 ~5주
  },

  /* ── Step 7 — Reflection ── */
  reflectionUseful:  '',
  reflectionAdjust:  '',
  reflectionHarder:  '',
  reflectionCommit:  '',
  weeklyCheckins:    [],
});

/* ── Storage ──────────────────────────────────── */
const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSession();
      return Storage._merge(defaultSession(), JSON.parse(raw));
    } catch { return defaultSession(); }
  },
  save(s) {
    try {
      s.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch { }
  },
  clear() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  },
  _merge(d, s) {
    const r = { ...d };
    for (const k of Object.keys(s)) {
      if (s[k] !== null && typeof s[k] === 'object' && !Array.isArray(s[k])
        && d[k] !== null && typeof d[k] === 'object' && !Array.isArray(d[k])) {
        r[k] = Storage._merge(d[k], s[k]);
      } else {
        r[k] = s[k];
      }
    }
    return r;
  },
};

/* ── Session ──────────────────────────────────── */
const Session = {
  _data: null,
  init()       { this._data = Storage.load(); return this._data; },
  get(path)    { return path.split('.').reduce((o, k) => o?.[k], this._data); },
  set(path, v) {
    const keys = path.split('.');
    let ref = this._data;
    for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
    ref[keys[keys.length - 1]] = v;
    this._save();
  },
  markStepComplete(i) {
    if (!this._data.completedSteps.includes(i)) {
      this._data.completedSteps.push(i);
      this._save();
    }
  },
  setStep(i)   { this._data.currentStep = i; this._save(); },
  all()        { return this._data; },
  reset()      { this._data = defaultSession(); Storage.clear(); },
  _save()      { Storage.save(this._data); },

  /* ── Element-Step helpers ── */
  markElementComplete(key) {
    const done = this._data.completedElements || [];
    if (!done.includes(key)) {
      done.push(key);
      this._data.completedElements = done;
    }
    // Update planningLocked
    this._data.planningLocked = done.length < FACTORS.length;
    this._save();
  },
  isPlanningUnlocked() {
    return (this._data.completedElements || []).length >= FACTORS.length;
  },
  getElementProgress() {
    const done = this._data.completedElements || [];
    return { done: done.length, total: FACTORS.length, pct: Math.round((done.length / FACTORS.length) * 100) };
  },
};

/* ═══════════════════════════════════════════════
   PERFORMANCE FORMULA
   Performance = Energy(CAP) × Luck × Social Cap
               × VTK × VEK × Practice × Habit
               × Tools × Meta-cog
═══════════════════════════════════════════════ */

const FORMULA_DISPLAY = [
  { key: 'energy',        label: 'Energy(CAP)', short: 'Energy' },
  { key: 'context',       label: 'Luck',        short: 'Luck' },
  { key: 'social',        label: 'Social Cap',  short: 'Social' },
  { key: 'tacit',         label: 'VTK',         short: 'VTK' },
  { key: 'explicit',      label: 'VEK',         short: 'VEK' },
  { key: 'practice',      label: 'Practice',    short: 'Practice' },
  { key: 'habits',        label: 'Habit',       short: 'Habit' },
  { key: 'tools',         label: 'Tools',       short: 'Tools' },
  { key: 'metaAwareness', label: 'Meta-cog',    short: 'Meta' },
];

/* ═══════════════════════════════════════════════
   9 PERFORMANCE ELEMENTS — FULL DEFINITION
═══════════════════════════════════════════════ */
const FACTORS = [
  {
    key:     'energy',
    label:   '에너지',
    labelEn: 'Energy (CAP)',
    formulaLabel: 'Energy(CAP)',
    icon:    '⚡',
    color:   '#7c6fff',
    desc:    '인지 명료함 · 감정적 몰입 · 신체적 준비 상태',

    brief: '에너지(CAP)는 퍼포먼스의 총 용량입니다. 인지(Cognitive), 감정(Affective), 신체(Physical) 세 차원의 상태가 모든 역량의 발휘 가능성을 결정합니다.',

    definition:  '에너지는 단순한 피로가 아닙니다. 퍼포먼스에 영향을 미치는 세 차원 — 인지(Cognitive), 감정(Affective), 신체(Physical) — 의 현재 상태를 의미합니다.',
    importance:  '에너지는 퍼포먼스 용량(CAP)을 설정합니다. 아무리 좋은 역량과 습관이 있어도 에너지가 없으면 발휘할 수 없습니다. 모든 요소의 곱셈 기반입니다.',
    examples:    '낮음: 집중이 흐트러지고, 쉽게 지치며, 동기가 생기지 않는 상태\n높음: 깨어있고 집중되며, 도전에 설레고 회복이 빠른 상태',
    selfCheck:   [
      '이 목표를 생각할 때 에너지가 생기나요, 아니면 소진되나요?',
      '최근 일주일 중 컨디션이 좋았던 날은 며칠인가요?',
      '신체·인지·감정 중 어느 에너지가 가장 취약한가요?',
    ],
    reflectPrompt: '이 목표를 추구할 때 에너지가 어떤 영향을 미치고 있나요?',
    subScales: [],  // kept for schema compatibility
    affects: ['practice', 'habits', 'metaAwareness'],
    lowMsg:  '에너지가 낮으면 다른 모든 요소의 효과가 반감됩니다.',
    highMsg: '높은 에너지는 모든 요소를 가속합니다.',
  },
  {
    key:     'context',
    label:   '맥락 · 운',
    labelEn: 'Luck / Context',
    formulaLabel: 'Luck',
    icon:    '🌐',
    color:   '#4ecdc4',
    desc:    '타이밍 · 외부 환경 · 기회 인식 · 운을 만드는 능력',

    brief: 'Luck은 단순한 "운"이 아닙니다. 운을 기다리는 사람과 운을 만드는 사람은 다릅니다. 운이 좋은 사람은 "나는 운이 좋은 사람이다"라는 자기 인식이 있고, 기회를 알아보며, 유리한 위치에 자신을 지속적으로 놓습니다. 운도 설계할 수 있습니다.',

    definition:  '운(Luck)은 두 층위로 구성됩니다.\n\n① 외부 맥락 — 내가 통제할 수 없는 요인: 시대적 흐름, 산업 환경, 조직 문화, 타이밍, 우연한 만남. 같은 노력도 맥락에 따라 결과가 10배 차이 납니다.\n\n② 운 감수성 — 기회를 알아보고, 포착하고, 활용하는 능력. "운이 좋은 사람"은 같은 상황에서 더 많은 기회를 발견합니다. 이것은 훈련 가능한 능력입니다.\n\n핵심 통찰: "나는 운이 좋은 사람이다"라고 믿는 사람은 실제로 더 많은 행운을 경험합니다. 자기 인식이 주의를 바꾸고, 주의가 현실을 바꿉니다.',
    importance:  '퍼포먼스 공식에서 Luck이 포함된 이유: 아무리 에너지(CAP), 지식(VTK·VEK), 연습(Practice)이 뛰어나도 맥락이 맞지 않으면 성과가 나지 않습니다. 반대로 운이 좋은 사람은 같은 실력으로도 더 큰 결과를 만듭니다.\n\n운은 두 가지 방향으로 작동합니다:\n· 순풍 — 유리한 맥락이 노력을 증폭시킵니다\n· 역풍 — 불리한 맥락은 노력을 낭비하게 만듭니다\n\n현재 맥락을 정확히 인식하면 "어디에 에너지를 쏟을지"가 명확해집니다.',
    examples:    '운을 기다리는 사람: "언젠가 좋은 기회가 오겠지" — 수동적 대기, 기회를 알아보지 못함\n운을 만드는 사람: 꾸준히 노출을 만들고, 약한 연결(weak tie)을 유지하며, 기회가 왔을 때 바로 잡을 준비가 되어 있음\n\n불리한 맥락의 예: 역풍이 부는 산업, 성장이 막힌 조직, 잘못된 타이밍에 시작한 프로젝트\n유리한 맥락의 예: 성장 중인 분야에서의 포지셔닝, 레버리지를 주는 커뮤니티, 시대적 흐름과 정렬된 목표',
    selfCheck:   [
      '"나는 운이 좋은 사람이다" — 이 말에 몇 점(1-5점)을 주겠나요? 그 이유는?',
      '지금 이 목표를 둘러싼 외부 맥락은 순풍인가요, 역풍인가요?',
      '최근 6개월 안에 "운 좋게" 일어난 일이 있나요? 그것이 우연이었나요, 준비된 것이었나요?',
    ],
    reflectPrompt: '"나는 운이 좋은 사람이다" — 이 문장이 지금 나에게 얼마나 사실인가요?',
    luckItems: [
      { key: 'selfBelief',   label: '운 자기인식',   icon: '🪞', question: '"나는 운이 좋은 사람이다"라는 믿음이 있나요?' },
      { key: 'positioning',  label: '포지셔닝',      icon: '📍', question: '유리한 위치에 나를 지속적으로 놓고 있나요?' },
      { key: 'readiness',    label: '기회 준비도',   icon: '⚡', question: '기회가 왔을 때 바로 잡을 준비가 되어 있나요?' },
      { key: 'recognition',  label: '기회 인식력',   icon: '👁', question: '같은 상황에서 남들이 못 보는 기회를 발견하나요?' },
    ],
    affects: ['social', 'tools', 'metaAwareness'],
    lowMsg:  '운이 낮다고 느껴지면, 먼저 "나는 운이 좋은 사람이다"라는 자기 인식부터 점검하세요. 인식이 주의를 바꾸고, 주의가 기회를 만듭니다.',
    highMsg: '유리한 맥락과 높은 운 감수성이 노력을 증폭시키고 있습니다. 이 순풍을 최대한 활용하세요.',
  },
  {
    key:     'social',
    label:   '사회적 자본',
    labelEn: 'Social Capital',
    formulaLabel: 'Social Cap',
    icon:    '🤝',
    color:   '#f7c59f',
    desc:    '멘토 · 동료 · 커뮤니티 · 피드백 시스템',

    brief: 'Social Cap은 사회적 자본(Social Capital)입니다 — 멘토의 지혜, 동료의 자극, 커뮤니티의 소속감, 솔직한 피드백 시스템. 좋은 사회적 자본 하나가 수년의 독학을 대체할 수 있습니다.',

    definition:  '사회적 자본(Social Capital)은 주변 사람들이 당신의 퍼포먼스에 미치는 영향 — 멘토의 지혜, 동료의 자극, 커뮤니티의 소속감, 피드백의 질 — 입니다.',
    importance:  '우리는 주변 사람들의 평균이 됩니다. 좋은 사회적 자본은 보이지 않는 성장 시스템입니다. 피드백 없는 성장은 맹점을 만들어냅니다.',
    examples:    '약한 자본: 혼자 모든 것을 해결, 진행 상황을 아무도 모름\n강한 자본: 멘토가 있고, 함께 성장하는 동료가 있으며, 솔직한 피드백을 주는 사람이 있음',
    selfCheck:   [
      '나의 성장을 응원하고 솔직한 피드백을 줄 수 있는 사람이 있나요?',
      '나보다 이 목표를 먼저 달성한 사람과 연결되어 있나요?',
      '주변 환경이 이 목표를 향한 행동을 강화하고 있나요, 약화시키고 있나요?',
    ],
    reflectPrompt: '이 목표와 관련해 당신을 지지하는 사람들이 있나요?',
    affects: ['explicit', 'tacit'],
    lowMsg:  '좋은 사회적 연결 하나가 수년의 독학을 대체할 수 있습니다.',
    highMsg: '강한 사회적 자본이 성장을 가속합니다.',
  },
  {
    key:     'tacit',
    label:   '암묵지',
    labelEn: 'Tacit Knowledge',
    formulaLabel: 'VTK',
    icon:    '🌊',
    color:   '#a8d8ea',
    desc:    '경험으로 쌓인 직관 · 몸에 밴 감각',

    brief: 'VTK는 암묵지(Tacit Knowledge)입니다 — 책으로 배울 수 없고 직접 경험해야만 쌓이는 지식. 상황을 보는 순간 최적 판단이 직관적으로 떠오르는 것이 바로 VTK입니다.',

    definition:  'VTK(Visceral/Tacit Knowledge) = 암묵지. "해봐야 아는 것"입니다. 책으로 배울 수 없고 직접 경험을 통해서만 체득되는 패턴 인식, 직관, 감각적 판단력입니다.',
    importance:  '최상위 퍼포머와 그렇지 않은 사람의 핵심 차이는 암묵지입니다. 명시지는 빠르게 복사할 수 있지만, 암묵지는 오직 경험을 통해서만 쌓입니다.',
    examples:    '낮음: 이론은 알지만 실전에서 막힘, 판단이 느리고 불확실함\n높음: 상황을 보는 순간 최적 행동이 직관적으로 떠오름',
    selfCheck:   [
      '이 목표 영역에서 얼마나 많은 실전 경험을 가지고 있나요?',
      '이 분야에서 "직관적으로 판단"할 수 있는 부분이 있나요?',
      '경험이 부족해서 막히는 부분이 있나요?',
    ],
    reflectPrompt: '이 목표 영역에서 직접 경험으로 쌓인 감각은 어느 정도인가요?',
    affects: ['practice', 'metaAwareness'],
    lowMsg:  '암묵지는 의도적 실천과 반복 경험으로만 쌓입니다.',
    highMsg: '풍부한 암묵지가 실전 판단력을 높이고 있습니다.',
  },
  {
    key:     'explicit',
    label:   '명시지',
    labelEn: 'Explicit Knowledge',
    formulaLabel: 'VEK',
    icon:    '📚',
    color:   '#b8e0d2',
    desc:    '언어화된 지식 · 프레임워크 · 방법론',

    brief: 'VEK는 명시지(Explicit Knowledge)입니다 — 책, 강의, 멘토링으로 전달될 수 있는 지식. 개념·이론·프레임워크·방법론이 여기에 해당합니다. 올바른 방향을 설정하는 지식 기반입니다.',

    definition:  'VEK(Verbal/Explicit Knowledge) = 명시지. "배워서 아는 것"입니다. 책, 강의, 멘토링을 통해 전달될 수 있는 개념, 이론, 프레임워크, 방법론입니다.',
    importance:  '명시지는 올바른 방향을 설정합니다. 어떻게 해야 하는지 알아야 노력이 낭비되지 않습니다. 단, 명시지만으로는 충분하지 않습니다.',
    examples:    '낮음: 무엇을 공부해야 할지 모름, 정보가 너무 많아서 혼란\n높음: 핵심 원칙을 이해하고, 좋은 자료와 멘토에 접근 가능',
    selfCheck:   [
      '이 목표에 필요한 핵심 지식 중 모르는 것이 무엇인지 알고 있나요?',
      '좋은 학습 자료와 멘토에 접근할 수 있나요?',
      '배운 것을 실제에 적용할 때 어떤 갭을 느끼나요?',
    ],
    reflectPrompt: '이 목표를 위해 알아야 할 것과 현재 알고 있는 것 사이의 갭은?',
    affects: ['practice', 'tacit'],
    lowMsg:  '올바른 방향을 모르면 노력이 낭비됩니다.',
    highMsg: '탄탄한 지식 기반이 방향을 명확하게 합니다.',
  },
  {
    key:     'practice',
    label:   '연습 품질',
    labelEn: 'Practice Quality',
    formulaLabel: 'Practice',
    icon:    '🔁',
    color:   '#c9cba3',
    desc:    '의도적이고 구조화된 반복 · 피드백 루프',

    brief: 'Practice는 의도적 연습입니다 — 편안한 수준을 살짝 넘는 난이도에서, 약점을 집중 공략하며, 즉각적인 피드백과 함께 하는 훈련. 많이 하는 것이 아니라 제대로 하는 것입니다.',

    definition:  '연습 품질은 단순 반복과 다릅니다. 의도적 연습(deliberate practice)은 현재 수준을 살짝 넘는 난이도에서, 즉각적인 피드백과 함께, 약점에 집중하며 이루어지는 훈련입니다.',
    importance:  '10,000시간의 법칙은 단순 반복이 아닌 "의도적 연습"에 관한 것입니다. 같은 1시간도 어떻게 쓰느냐가 결과를 결정합니다.',
    examples:    '낮은 품질: 편안한 수준에서 반복, 피드백 없음\n높은 품질: 불편한 영역을 타겟, 즉각 피드백, "오늘 무엇이 나아졌나" 확인',
    selfCheck:   [
      '연습할 때 의도적으로 불편한 영역을 건드리고 있나요?',
      '연습 후 무엇이 나아졌는지 확인하는 루틴이 있나요?',
      '피드백 루프가 얼마나 빠른가요?',
    ],
    reflectPrompt: '지금 하고 있는 연습의 질은 어떤가요?',
    affects: ['tacit', 'habits'],
    lowMsg:  '연습의 양보다 질이 중요합니다.',
    highMsg: '높은 품질의 연습이 복리로 쌓이고 있습니다.',
  },
  {
    key:     'habits',
    label:   '습관',
    labelEn: 'Habits',
    formulaLabel: 'Habit',
    icon:    '🌱',
    color:   '#95d5b2',
    desc:    '자동화된 행동 · 인지 비용 없는 루틴',

    brief: 'Habit은 의지력 없이 자동으로 실행되는 행동입니다 — 아침 루틴, 학습 습관, 성찰 루틴. 좋은 습관은 인지 비용을 줄이고 중요한 일에 에너지를 집중할 수 있게 만듭니다.',

    definition:  '습관은 의지력을 소모하지 않고 자동으로 실행되는 행동입니다. 좋은 습관 시스템은 "하려고 노력하지 않아도 자연스럽게 되는 것"을 만들어냅니다.',
    importance:  '의지력은 유한한 자원입니다. 습관화된 행동은 인지 비용이 거의 없기 때문에 중요한 곳에 에너지를 집중할 수 있게 합니다.',
    examples:    '낮음: 매번 의지력으로만 실행, 루틴 붕괴 후 복구 어려움\n높음: 아침 루틴, 학습, 성찰이 자동화되어 있음',
    selfCheck:   [
      '이 목표와 연결된 행동 중 자동으로 하는 것이 있나요?',
      '의지력 없이도 실행할 수 있는 루틴이 있나요?',
      '좋은 습관 형성을 방해하는 나쁜 습관이 있나요?',
    ],
    reflectPrompt: '이 목표를 향한 행동 중 습관으로 자동화된 것이 얼마나 있나요?',
    affects: ['energy', 'metaAwareness'],
    lowMsg:  '하나의 작은 습관이 시스템을 바꿀 수 있습니다.',
    highMsg: '탄탄한 습관이 무의식적 성과를 만들고 있습니다.',
  },
  {
    key:     'tools',
    label:   '도구 · 환경',
    labelEn: 'Tools / Environment',
    formulaLabel: 'Tools',
    icon:    '🏛',
    color:   '#e9c46a',
    desc:    '물리적 공간 · 디지털 도구 · 환경 설계',

    brief: 'Tools는 도구와 환경 설계입니다 — 작업 공간, 디지털 환경, 사용하는 시스템 전반. 좋은 환경 설계는 의지력보다 신뢰할 수 있습니다. 좋은 행동을 기본값(default)으로 만드세요.',

    definition:  '도구와 환경은 행동을 쉽게 또는 어렵게 만드는 보이지 않는 설계자입니다. 물리적 공간, 디지털 환경, 사용하는 도구 모두 포함됩니다.',
    importance:  '환경 설계는 의지력보다 신뢰할 수 있습니다. 좋은 행동을 기본값(default)으로 만들고 나쁜 행동의 마찰을 높이는 것이 핵심입니다.',
    examples:    '나쁜 환경: 책상이 어수선, 알림이 계속 울림\n좋은 환경: 집중 공간 분리, 도구가 손에 닿는 위치, 방해 요소가 제거됨',
    selfCheck:   [
      '지금 작업 공간이 집중을 돕나요, 방해하나요?',
      '이 목표를 위해 최적화된 도구를 사용하고 있나요?',
      '환경을 바꾸면 행동이 자연스럽게 달라질 것 같은 부분이 있나요?',
    ],
    reflectPrompt: '이 목표를 위한 물리적·디지털 환경은 어떻게 설정되어 있나요?',
    affects: ['habits', 'energy'],
    lowMsg:  '환경 설계 하나가 열 가지 의지력 노력보다 효과적입니다.',
    highMsg: '환경이 자연스럽게 성과를 지원하고 있습니다.',
  },
  {
    key:     'metaAwareness',
    label:   '메타인지',
    labelEn: 'Meta-Cognition',
    formulaLabel: 'Meta-cog',
    icon:    '🪞',
    color:   '#c77dff',
    desc:    '자기 시스템 인식 · 패턴 관찰 · 방향 교정',

    brief: 'Meta-cog는 메타인지(Meta-Cognition)입니다 — 나의 사고·학습·퍼포먼스 패턴을 관찰하는 능력. 이것은 성과 공식 전체의 운영체제(OS)입니다. 메타인지가 없으면 같은 실수를 반복합니다.',

    definition:  '메타인지는 "나의 사고와 행동을 관찰하는 능력"입니다. 자신의 퍼포먼스 패턴을 인식하고, 무엇이 작동하고 무엇이 안 되는지를 학습하며, 방향을 교정하는 능력입니다.',
    importance:  '메타인지는 시스템의 OS(운영체제)입니다. 이것이 없으면 같은 실수를 반복하고, 좋은 전략도 잘못 실행됩니다. 성찰 루프가 빠를수록 성장 속도가 빨라집니다.',
    examples:    '낮음: 왜 안 됐는지 모름, 같은 패턴 반복\n높음: 자신의 에너지 패턴을 앎, 실패에서 빠르게 배움',
    selfCheck:   [
      '지난 달 무엇이 잘됐고 왜 그랬는지 설명할 수 있나요?',
      '자신의 퍼포먼스 패턴을 파악하고 있나요?',
      '성찰이 시스템의 일부로 자리잡혀 있나요?',
    ],
    reflectPrompt: '자신의 성장 과정을 얼마나 의식적으로 관찰하고 있나요?',
    affects: ['explicit', 'practice', 'habits'],
    lowMsg:  '메타인지 없이는 노력이 방향을 잃습니다.',
    highMsg: '높은 메타인지가 학습 속도를 가속하고 방향을 교정합니다.',
  },
];

/* ── Goal Type Definitions ──────────────────── */
const GOAL_TYPES = {
  outcome: {
    label:   '결과 목표',
    labelEn: 'Outcome Goal',
    icon:    '🏆',
    color:   '#f7c59f',
    desc:    '달성하고 싶은 구체적인 결과나 성취',
    examples:'수영 1km 기록 단축, 책 출판, 연봉 협상 성공',
    coaching:'결과 목표는 "완료" 기준이 명확합니다. 결과를 만드는 과정을 역설계하는 것이 핵심입니다.',
  },
  process: {
    label:   '과정 목표',
    labelEn: 'Process Direction',
    icon:    '🔄',
    color:   '#4ecdc4',
    desc:    '특정 행동이나 방식을 꾸준히 실천하는 것',
    examples:'매일 글쓰기, 주 5회 운동, 매주 성찰 루틴',
    coaching:'과정 목표는 "일관성"이 핵심입니다. 결과보다 행동에 집중하면 더 지속 가능합니다.',
  },
  identity: {
    label:   '정체성 방향',
    labelEn: 'Identity Direction',
    icon:    '🧭',
    color:   '#7c6fff',
    desc:    '되고 싶은 모습이나 자기 인식의 변화',
    examples:'"작가가 되고 싶다", "건강한 사람이 되고 싶다", "리더로 성장하고 싶다"',
    coaching:'정체성 방향은 가장 깊은 동기와 연결됩니다. "나는 ___ 하는 사람이다"라는 인식이 나침반이 됩니다.',
  },
};

/* ── Domain Keywords ────────────────────────── */
const DOMAIN_KEYWORDS = {
  fitness:    ['수영', '운동', '체력', '마라톤', '달리기', '근력', '다이어트', '헬스', '요가', '필라테스', '자전거'],
  writing:    ['글쓰기', '글', '작문', '에세이', '블로그', '책', '소설', '콘텐츠', '저작'],
  career:     ['커리어', '승진', '이직', '취업', '스타트업', '창업', '리더십', '관리', '사업'],
  learning:   ['공부', '학습', '시험', '자격증', '언어', '코딩', '프로그래밍', '개발', '영어'],
  creativity: ['창의', '디자인', '예술', '음악', '그림', '사진', '영상', '작곡'],
  social:     ['발표', '프레젠테이션', '소통', '인간관계', '네트워킹', '팀', '대화'],
};

function detectDomain(goal) {
  if (!goal) return 'general';
  const g = goal.toLowerCase();
  for (const [domain, kws] of Object.entries(DOMAIN_KEYWORDS)) {
    if (kws.some(k => g.includes(k))) return domain;
  }
  return 'general';
}

function detectGoalType(goal) {
  if (!goal) return null;
  const identityKw = ['되고 싶', '되어 있', '사람이 되', '되는 것', '성장하', '변하고', '바뀌'];
  const processKw  = ['매일', '매주', '꾸준히', '습관', '루틴', '하기', '실천', '주 ', '일 '];
  if (identityKw.some(k => goal.includes(k))) return 'identity';
  if (processKw.some(k => goal.includes(k)))  return 'process';
  return 'outcome';
}

/* ── Step Meta ──────────────────────────────── */
const STEP_META = [
  { id: 0, label: '시작',        title: '시작하기' },
  { id: 1, label: '목표 설정',   title: '목표 & 분류' },
  { id: 2, label: '현황 파악',   title: '현황 파악' },
  { id: 3, label: '요소 진단',   title: '성과 공식 진단' },
  { id: 4, label: '시스템 매핑', title: '시스템 매핑' },
  { id: 5, label: '레버리지',    title: '레버리지 & 시스템' },
  { id: 6, label: '100일 계획',  title: '100일 계획' },
  { id: 7, label: '성찰',        title: '성찰 & 진화' },
  { id: 8, label: '완성',        title: '시스템 완성' },
];
