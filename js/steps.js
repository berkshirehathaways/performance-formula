/* ═══════════════════════════════════════════════
   COMPASS — steps.js  v6
   STRICT PERFORMANCE FORMULA FLOW

   Performance = Energy(CAP) × Luck × Social Cap
               × VTK × VEK × Practice × Habit
               × Tools × Meta-cog

   BEHAVIORAL CONTRACT (NON-NEGOTIABLE):
   · Step 3: ONE element at a time — strictly
             Energy → Luck → Social Cap → VTK → VEK
             → Practice → Habit → Tools → Meta-cog
   · Formula bar ALWAYS visible with current highlighted
   · Each element: brief + self-check + reflection
   · NO auto-advance — user clicks "다음 요소" manually
   · NO plan until ALL 9 elements confirmed
   · After all 9: synthesis → bottleneck → 100-day plan
   · Reflection loop: revisit any element at any time
═══════════════════════════════════════════════ */

const StepRenderers = {

  /* ══════════════════════════════════════════
     STEP 0 — WELCOME
  ══════════════════════════════════════════ */
  step0() {
    const el = createScreen();
    el.innerHTML = `
      <div class="step-eyebrow animate-in-1">Compass</div>
      <h1 class="step-headline animate-in-2">퍼포먼스 진단부터<br>시작합니다.</h1>
      <p class="step-sub animate-in-3">
        계획을 세우기 <em>전에</em>, 먼저 당신의 시스템을 이해합니다.
      </p>

      <div class="formula-intro animate-in-4" style="margin: var(--sp-xl) 0 0;">
        <p class="step-sub" style="font-size:0.92rem; color:var(--c-text-sub); line-height:1.7; margin:0;">
          9개 퍼포먼스 공식 구성 요소를 진단해<br>병목과 레버리지를 찾아 효과적인 100일 계획을 생성합니다.
        </p>
      </div>

      <div class="welcome-flow-steps animate-in-5">
        <div class="wfs-item">
          <span class="wfs-num">1</span>
          <span class="wfs-text"><strong>목표 설정</strong> — 무엇을 원하는가</span>
        </div>
        <div class="wfs-arrow">↓</div>
        <div class="wfs-item">
          <span class="wfs-num">2</span>
          <span class="wfs-text"><strong>현황 파악</strong> — 지금 어디 있는가</span>
        </div>
        <div class="wfs-arrow">↓</div>
        <div class="wfs-item wfs-highlight">
          <span class="wfs-num">3</span>
          <span class="wfs-text"><strong>9요소 순차 진단</strong> — 에너지부터 메타인지까지</span>
        </div>
        <div class="wfs-arrow">↓</div>
        <div class="wfs-item wfs-locked">
          <span class="wfs-num">🔒</span>
          <span class="wfs-text"><strong>진단 완료 후</strong> — 100일 계획 생성</span>
        </div>
      </div>

      <div class="welcome-principle animate-in-6">
        <div class="wp-icon">×</div>
        <div class="wp-text">
          <strong>곱셈 구조</strong><br>
          퍼포먼스는 곱셈입니다. 가장 낮은 요소 하나가<br>
          전체를 제한합니다 — 먼저 그 요소를 찾습니다.
        </div>
      </div>

      <div class="sample-preview-box animate-in-6">
        <div class="spb-title">👀 완성 예시 미리보기</div>
        <div class="spb-grid">
          <div class="spb-item">
            <div class="spb-head">🏆 결과 목표</div>
            <div class="spb-goal">수영 1km 기록 8% 단축</div>
            <div class="spb-out">연습/에너지 병목 개선 + 30일 루틴 완성</div>
          </div>
          <div class="spb-item">
            <div class="spb-head">🔄 과정 목표</div>
            <div class="spb-goal">매일 30분 글쓰기</div>
            <div class="spb-out">습관/도구 최적화 + 주간 회고 축적</div>
          </div>
          <div class="spb-item">
            <div class="spb-head">🧭 정체성 목표</div>
            <div class="spb-goal">나는 꾸준히 배우는 사람</div>
            <div class="spb-out">메타인지/학습 루프 강화 + 다음 사이클 설계</div>
          </div>
        </div>
      </div>

      <div class="local-save-note animate-in-6">
        💾 입력 내용은 현재 브라우저에 자동 저장됩니다.
      </div>

      <p class="step-nudge animate-in-6">
        9요소를 모두 진단해야 계획이 생성됩니다. 서두르지 않아요. ✦
      </p>
    `;
    return el;
  },

  /* ══════════════════════════════════════════
     STEP 1 — GOAL ENTRY
  ══════════════════════════════════════════ */
  step1() {
    const session  = Session.all();
    const el       = createScreen();

    el.innerHTML = `
      <div class="step-eyebrow">Step 1 · 목표 설정</div>
      <h2 class="step-headline">무엇을 이루고<br>싶으신가요?</h2>
      <p class="step-sub">한 문장이면 충분합니다. 명확성은 여정을 따라 생겨납니다.</p>

      <div class="field-group">
        <label class="field-label" for="inp-goal">목표</label>
        <input id="inp-goal" class="field-input" type="text"
          placeholder="예: 수영 기록 향상, 매일 글쓰기, 리더로 성장하기…"
          value="${escHtml(session.goal)}" maxlength="120" autocomplete="off"/>
        <div class="domain-badge" id="domain-badge"
          style="display:${session.goalDomain && session.goalDomain !== 'general' ? 'inline-block' : 'none'}">
          ${_domainLabel(session.goalDomain)}
        </div>
      </div>

      <div id="goal-type-panel" style="display:${session.goal && session.goal.length > 5 ? 'block' : 'none'}">
        <div class="coaching-note" id="goal-coaching-note"
          style="display:${session.goalType ? 'flex' : 'none'}">
          <div class="cn-icon">${session.goalType ? GOAL_TYPES[session.goalType]?.icon : ''}</div>
          <div class="cn-body">
            <strong>${session.goalType ? GOAL_TYPES[session.goalType]?.label : ''}</strong>
            ${session.goalType ? `<span class="cn-sub">${GOAL_TYPES[session.goalType]?.coaching}</span>` : ''}
          </div>
        </div>
        <div class="section-label" style="margin-bottom:var(--sp-sm)">이 목표는 어떤 유형에 가깝나요?</div>
        <div class="goal-type-grid" id="goal-type-grid">
          ${Object.entries(GOAL_TYPES).map(([k, t]) => `
            <button class="goal-type-card ${session.goalType === k ? 'selected' : ''}" data-type="${k}">
              <span class="gtc-icon">${t.icon}</span>
              <span class="gtc-label">${t.label}</span>
              <span class="gtc-desc">${t.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="field-group optional-field" id="why-group"
        style="margin-top:var(--sp-lg); display:${session.goal && session.goal.length > 5 ? 'block' : 'none'}">
        <label class="field-label" for="inp-why">
          왜 지금 이것이 중요한가요? <span class="optional-tag">선택</span>
        </label>
        <textarea id="inp-why" class="field-textarea"
          placeholder="나중에 동기가 흔들릴 때 이 답이 닻이 됩니다"
          maxlength="300">${escHtml(session.goalWhy)}</textarea>
      </div>

      <div class="micro-feedback" id="goal-feedback"
        style="display:${session.goal && session.goal.length > 5 ? 'flex' : 'none'}">
        <span class="mf-icon">✦</span>
        <span>다음 단계에서 9요소를 하나씩 진단합니다.</span>
      </div>
    `;

    const goalInp   = el.querySelector('#inp-goal');
    const typePanel = el.querySelector('#goal-type-panel');
    const whyGroup  = el.querySelector('#why-group');
    const fb        = el.querySelector('#goal-feedback');
    const badge     = el.querySelector('#domain-badge');

    goalInp.addEventListener('input', () => {
      const v = goalInp.value;
      Session.set('goal', v.trim());
      UI.setSaveIndicator('저장됨');
      const show = v.length > 5;
      typePanel.style.display = show ? 'block' : 'none';
      whyGroup.style.display  = show ? 'block' : 'none';
      fb.style.display        = show ? 'flex'  : 'none';
      const d = detectDomain(v);
      if (d !== 'general' && v.length > 3) {
        badge.textContent   = _domainLabel(d);
        badge.style.display = 'inline-block';
        Session.set('goalDomain', d);
      } else {
        badge.style.display = 'none';
      }
      if (v.length > 8 && !Session.get('goalTypeConfirmed')) {
        _applyGoalType(detectGoalType(v), el);
      }
    });

    el.querySelectorAll('.goal-type-card').forEach(btn => {
      btn.addEventListener('click', function () { _applyGoalType(this.dataset.type, el); });
    });
    el.querySelector('#inp-why').addEventListener('input', e => {
      Session.set('goalWhy', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });

    return el;
  },

  /* ══════════════════════════════════════════
     STEP 2 — CONTEXT
  ══════════════════════════════════════════ */
  step2() {
    const session   = Session.all();
    const goalText  = session.goal ? `"${escHtml(session.goal)}"` : '이 목표';
    const el        = createScreen();

    el.innerHTML = `
      <div class="step-eyebrow">Step 2 · 현황 파악</div>
      <h2 class="step-headline">지금 어떤 상황인지<br>이야기해 주세요.</h2>
      <p class="step-sub">맥락을 이해해야 올바른 진단이 가능합니다.</p>

      <div class="field-group">
        <label class="field-label" for="inp-situation">
          ${goalText}를 추구하는 지금 상황은?
        </label>
        <textarea id="inp-situation" class="field-textarea"
          placeholder="현재 어떤 상태인가요? 무엇이 잘 되고, 무엇이 어려운가요?"
          maxlength="400">${escHtml(session.currentSituation)}</textarea>
      </div>

      <div class="field-group optional-field">
        <label class="field-label" for="inp-constraints">
          제약이 있다면 <span class="optional-tag">선택</span>
        </label>
        <input id="inp-constraints" class="field-input" type="text"
          placeholder="시간, 에너지, 환경, 자원 등"
          value="${escHtml(session.constraints)}" maxlength="200"/>
      </div>

      <div class="field-group optional-field">
        <label class="field-label" for="inp-outcome">
          100일 후 어떤 모습이길 원하나요? <span class="optional-tag">선택</span>
        </label>
        <input id="inp-outcome" class="field-input" type="text"
          placeholder="구체적일수록 좋아요"
          value="${escHtml(session.desiredOutcome)}" maxlength="200"/>
      </div>

      <div class="coaching-note" id="context-coaching"
        style="display:${session.currentSituation && session.currentSituation.length > 10 ? 'flex' : 'none'}">
        <div class="cn-icon">🔬</div>
        <div class="cn-body">
          맥락을 파악했습니다.
          <span class="cn-sub">다음 단계에서 성과 공식의 9요소를 하나씩 진단합니다.</span>
        </div>
      </div>
    `;

    const sitInp   = el.querySelector('#inp-situation');
    const ctxNote  = el.querySelector('#context-coaching');
    sitInp.addEventListener('input', e => {
      Session.set('currentSituation', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
      ctxNote.style.display = e.target.value.length > 10 ? 'flex' : 'none';
    });
    el.querySelector('#inp-constraints').addEventListener('input', e => {
      Session.set('constraints', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });
    el.querySelector('#inp-outcome').addEventListener('input', e => {
      Session.set('desiredOutcome', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });

    return el;
  },

  /* ══════════════════════════════════════════
     STEP 3 — SEQUENTIAL ELEMENT DIAGNOSIS
     ─────────────────────────────────────────
     STRICT RULES:
     1. ONE element at a time — no exception
     2. Order: Energy → Luck → Social Cap → VTK
              → VEK → Practice → Habit → Tools → Meta-cog
     3. Formula bar always shows current element highlighted
     4. Self-check questions shown by default (no hide)
     5. User MUST click "다음 요소" to advance
     6. No plan generation until ALL 9 confirmed
  ══════════════════════════════════════════ */
  step3() {
    const session    = Session.all();
    const idx        = Math.min(session.currentElementIdx || 0, FACTORS.length - 1);
    const factor     = FACTORS[idx];
    const factorData = session.factors[factor.key] || { score: 5, reflection: '', confirmed: false };
    const completed  = session.completedElements || [];
    const isLast     = idx === FACTORS.length - 1;
    const isRevisit  = completed.includes(factor.key);
    const el         = createScreen();

    const score = factorData.score;
    const color = scoreColor(score);
    const pct   = ((score - 1) / 9) * 100;

    const energySubHtml = ''; // removed: CAP sub-scale UI
    const luckSpecialHtml = factor.key === 'context' ? _buildLuckSpecialHtml(session) : '';

    el.innerHTML = `
      <!-- ① Formula Bar — always visible, current highlighted -->
      ${_buildFormulaBar(idx, completed)}
      <div class="goal-context-strip">
        <span class="gcs-label">북극성 목표</span>
        <span class="gcs-goal">${escHtml(session.system?.northStar || session.goal || '목표를 입력하면 여기에 표시됩니다')}</span>
      </div>

      <!-- ② Element progress indicator -->
      <div class="element-progress-header">
        <span class="eph-step">요소 ${idx + 1} / ${FACTORS.length}</span>
        <span class="eph-name" style="color:${factor.color}">${factor.icon} ${factor.formulaLabel}</span>
        <span class="eph-lock-hint">${Session.isPlanningUnlocked() ? '✦ 진단 완료' : `🔒 ${FACTORS.length - completed.length}개 남음`}</span>
      </div>

      <!-- ③ Element Card — one at a time, conversational -->
      <div class="element-card ec-active" style="--factor-color:${factor.color}; border-left: 4px solid ${factor.color}">

        <!-- Header -->
        <div class="ec-header">
          <div class="ec-icon-wrap" style="background:${factor.color}22; border-color:${factor.color}55">
            <span class="ec-icon">${factor.icon}</span>
          </div>
          <div class="ec-title-wrap">
            <div class="ec-name">${factor.label}</div>
            <div class="ec-formula-name" style="color:${factor.color}">${factor.formulaLabel}</div>
          </div>
          ${isRevisit ? '<div class="ec-revisit-badge">재진단</div>' : ''}
        </div>

        <!-- ④ Brief explanation — always shown, concise -->
        <div class="ec-brief-box">
          <p class="ec-brief">${factor.brief}</p>
        </div>

        <!-- ⑤ Reflection prompt — main conversational question -->
        <div class="ec-prompt-box">
          <div class="ec-prompt-label">💬 생각해볼 질문</div>
          <div class="ec-prompt">"${factor.reflectPrompt}"</div>
        </div>

        <!-- ⑥ Self-check questions — shown by default -->
        <div class="ec-selfcheck-box">
          <div class="ec-selfcheck-label">📋 자기점검</div>
          <ul class="self-check-list">
            ${factor.selfCheck.map(q => `<li>${q}</li>`).join('')}
          </ul>
        </div>

        <!-- ⑦ Score slider -->
        <div class="ec-slider-section">
          <div class="ec-slider-header">
            <span class="ec-slider-title">지금 이 요소의 상태는?</span>
            <div class="ec-score-display">
              <span class="ec-score-num" id="ec-score" style="color:${color}">${score}</span>
              <span class="ec-score-lbl" id="ec-score-label" style="color:${color}">${scoreLabel(score)}</span>
            </div>
          </div>
          <div class="range-wrap">
            <input type="range" id="ec-range"
              min="1" max="10" step="1" value="${score}"
              style="background:linear-gradient(to right,${color} ${pct}%,var(--c-surface2) ${pct}%)"
              aria-label="${factor.label} 점수"/>
            <div class="slider-labels">
              <span>1 — 매우 낮음</span>
              <span>10 — 매우 높음</span>
            </div>
          </div>
          <div class="ec-score-context" id="ec-score-context">
            ${score <= 3 ? `<div class="ec-low-msg">⚠️ ${factor.lowMsg}</div>`
              : score >= 7 ? `<div class="ec-high-msg">✓ ${factor.highMsg}</div>`
              : `<div class="ec-mid-msg">이 요소는 성장 가능성이 있어요.</div>`}
          </div>
        </div>

        ${luckSpecialHtml}

        <!-- ⑧ Reflection text -->
        <div class="ec-reflection">
          <label class="ec-reflect-label" for="ec-reflect">
            이 요소에 대한 생각을 적어보세요
            <span class="optional-tag">선택</span>
          </label>
          <textarea id="ec-reflect" class="field-textarea reflect-textarea"
            placeholder="자유롭게 — 짧아도 괜찮아요"
            maxlength="400">${escHtml(factorData.reflection || '')}</textarea>
          <div class="reflect-hint">
            ${factor.examples.split('\n').map(ex => `<span class="rh-example">${ex}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- ⑨ Element navigation — user must manually advance -->
      <div class="element-nav">
        ${idx > 0 ? `
          <button class="btn-elem-back" id="btn-elem-back" type="button">
            ← ${FACTORS[idx - 1].formulaLabel}
          </button>
        ` : '<div></div>'}

        <div class="element-nav-center">
          ${isRevisit
            ? `<span class="elem-done-badge">✓ 완료됨</span>`
            : '<span class="elem-progress-dot-row">' +
              FACTORS.map((f, i) => `<span class="epd ${i < idx ? 'epd-done' : i === idx ? 'epd-current' : 'epd-pending'}" title="${f.formulaLabel}"></span>`).join('') +
              '</span>'}
        </div>

        <button class="btn-elem-next ${isLast ? 'btn-elem-finish' : ''}"
                id="btn-elem-next" type="button">
          ${isLast ? (isRevisit ? '진단 완료 ✦' : '마지막 진단 완료 →') : `${FACTORS[idx + 1].formulaLabel} →`}
        </button>
      </div>

      <!-- ⑩ Planning lock/unlock banner -->
      ${Session.isPlanningUnlocked() ? `
        <div class="planning-unlocked-banner">
          <span class="pub-icon">✦</span>
          <div>
            <strong>9요소 진단 완료!</strong>
            <span>상단 "매핑으로" 버튼을 눌러 시스템 매핑으로 이동하세요.</span>
          </div>
        </div>` : `
        <div class="planning-locked-banner">
          <span class="plb-icon">🔒</span>
          <div>
            <span>100일 계획은 </span>
            <strong>${FACTORS.length - completed.length}개 요소</strong>
            <span>를 더 진단해야 생성됩니다.</span>
          </div>
        </div>`}
    `;

    /* ── Event Listeners ── */

    // Slider
    const range       = el.querySelector('#ec-range');
    const scoreBadge  = el.querySelector('#ec-score');
    const scoreLbl    = el.querySelector('#ec-score-label');
    const scoreCtx    = el.querySelector('#ec-score-context');

    range.addEventListener('input', () => {
      const v = parseInt(range.value);
      const c = scoreColor(v), p = ((v - 1) / 9) * 100;
      scoreBadge.textContent = v;
      scoreBadge.style.color = c;
      scoreLbl.textContent   = scoreLabel(v);
      scoreLbl.style.color   = c;
      range.style.background = `linear-gradient(to right,${c} ${p}%,var(--c-surface2) ${p}%)`;
      scoreCtx.innerHTML = v <= 3
        ? `<div class="ec-low-msg">⚠️ ${factor.lowMsg}</div>`
        : v >= 7
          ? `<div class="ec-high-msg">✓ ${factor.highMsg}</div>`
          : `<div class="ec-mid-msg">이 요소는 성장 가능성이 있어요.</div>`;
      Session.set(`factors.${factor.key}.score`, v);
      UI.setSaveIndicator('저장됨');
    });

    // Reflection textarea
    const reflectTA = el.querySelector('#ec-reflect');
    reflectTA.addEventListener('input', e => {
      Session.set(`factors.${factor.key}.reflection`, e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });

    // Luck special interactions
    if (factor.key === 'context') {
      _bindLuckSpecialEvents(el, session);
    }

    // Back within elements
    const backBtn = el.querySelector('#btn-elem-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (idx > 0) {
          Session.set('currentElementIdx', idx - 1);
          UI.renderStep(3, 'back');
        }
      });
    }

    // Next element / finish — USER MUST CLICK MANUALLY
    const nextBtn = el.querySelector('#btn-elem-next');
    nextBtn.addEventListener('click', () => {
      // Save current reflection
      const reflVal = el.querySelector('#ec-reflect').value.trim();
      if (reflVal) Session.set(`factors.${factor.key}.reflection`, reflVal);

      // Mark element as confirmed/complete
      Session.markElementComplete(factor.key);
      Session.set(`factors.${factor.key}.confirmed`, true);
      UI.setSaveIndicator('저장됨');

      if (isLast) {
        // All 9 elements done → advance to synthesis (step 4)
        UI.showToast('✦ 9요소 진단 완료! 시스템 매핑으로 이동합니다.', 3000);
        Nav.next();
        UI.renderStep(Session.get('currentStep'), 'forward');
      } else {
        // Advance to next element
        const nextIdx = idx + 1;
        Session.set('currentElementIdx', nextIdx);
        UI.renderStep(3, 'forward');
        const nf = FACTORS[nextIdx];
        UI.showToast(`${nf.icon} ${nf.label} — ${nf.formulaLabel}`);
      }
    });

    return el;
  },

  /* ══════════════════════════════════════════
     STEP 4 — SYNTHESIS
     Strengths / Constraints / Unknowns
     + Bottleneck confirmation
     (ONLY reachable after all 9 elements done)
  ══════════════════════════════════════════ */
  step4() {
    const session = Session.all();

    // Guard: if somehow reached before completion
    if (!Session.isPlanningUnlocked()) {
      const el = createScreen();
      el.innerHTML = `
        <div class="step-eyebrow">Step 4 · 시스템 매핑</div>
        <div class="lock-gate">
          <div class="lg-icon">🔒</div>
          <h2 class="lg-title">아직 진단이 완료되지 않았어요.</h2>
          <p class="lg-body">9요소를 모두 진단해야 시스템 매핑이 활성화됩니다.</p>
          <div class="lg-progress">
            <div class="lg-progress-bar">
              <div class="lg-progress-fill" style="width:${((session.completedElements || []).length / FACTORS.length) * 100}%"></div>
            </div>
            <span>${(session.completedElements || []).length} / ${FACTORS.length} 완료</span>
          </div>
          <button class="btn-nav btn-primary" id="btn-go-back" type="button">
            ← 진단으로 돌아가기
          </button>
        </div>`;
      el.querySelector('#btn-go-back').addEventListener('click', () => {
        Nav.goTo(3);
        UI.renderStep(3, 'back');
      });
      return el;
    }

    const factorAnalysis = analyseFactors(session.factors);
    const systemMap      = buildSystemMap(factorAnalysis);
    const bottleneck     = computeBottleneck(factorAnalysis);
    const chains         = computeImpactChains(factorAnalysis);
    const el             = createScreen();

    const _mapSection = (title, icon, cls, items, emptyMsg) => {
      if (!items.length) return `
        <div class="smap-section smap-${cls}">
          <div class="smap-section-title">${icon} ${title}</div>
          <div class="smap-empty">${emptyMsg}</div>
        </div>`;
      return `
        <div class="smap-section smap-${cls}">
          <div class="smap-section-title">${icon} ${title}</div>
          <div class="smap-chips">
            ${items.map(({ factor, score }) => `
              <div class="smap-chip smap-${cls}-chip">
                <span>${factor.icon}</span>
                <span>${factor.label}</span>
                <span class="smap-score" style="color:${scoreColor(score)}">${score}/10</span>
              </div>
            `).join('')}
          </div>
        </div>`;
    };

    const lossMsg = bottleneck.hasClear
      ? `<strong>${bottleneck.primary.factor.icon} ${bottleneck.primary.factor.formulaLabel}</strong>(${bottleneck.primary.score}/10)이 가장 큰 제약입니다. 잠재 퍼포먼스의 약 <strong>${bottleneck.lossRatio}%가 제한</strong>되고 있어요.`
      : `전반적으로 균형 잡힌 시스템입니다. <strong>${bottleneck.primary.factor.formulaLabel}</strong>을 집중 개선하면 전체가 올라갑니다.`;

    const chainsHtml = chains.length ? `
      <div class="impact-section">
        <div class="impact-title">🔗 연쇄 제약 영향</div>
        <p class="impact-sub">낮은 요소는 연결된 요소들도 제한합니다.</p>
        <div class="impact-chain-list">
          ${chains.slice(0, 4).map(c => `
            <div class="impact-chain-item sev-${c.severity}">
              <div class="chain-row">
                <span class="chain-from">${c.from.icon} ${c.from.formulaLabel || c.from.label}</span>
                <span class="chain-arrow">→</span>
                <span class="chain-to">${c.to.icon} ${c.to.formulaLabel || c.to.label}</span>
                <span class="sev-badge sev-${c.severity}">${{high:'높음',mid:'보통',low:'낮음'}[c.severity]}</span>
              </div>
              <div class="chain-msg">${c.message}</div>
            </div>`).join('')}
        </div>
      </div>` : '';

    const confirmed = session.bottleneckConfirmed;

    el.innerHTML = `
      ${_buildFormulaBar(-1, session.completedElements || [])}

      <div class="step-eyebrow">Step 4 · 시스템 매핑</div>
      <h2 class="step-headline">진단 결과를<br>정리했어요.</h2>
      <p class="step-sub">9요소를 세 그룹으로 분류했습니다.</p>

      <div class="system-map-grid">
        ${_mapSection('강점 영역', '✅', 'strength', systemMap.strengths, '현재 명확한 강점이 없어요.')}
        ${_mapSection('제약 영역', '⚠️', 'constraint', systemMap.constraints, '명확한 제약이 없어요.')}
        ${_mapSection('불확실 영역', '？', 'unknown', systemMap.unknowns, '모든 요소가 충분히 탐색됐어요.')}
      </div>

      <div class="bottleneck-box">
        <div class="bbn-header">
          <div class="bbn-icon">⚙</div>
          <div class="bbn-title">시스템 분석</div>
        </div>
        <p class="bbn-body">${lossMsg}</p>
        <div class="multiplicative-diagram">
          <div class="md-label">P = </div>
          <div class="md-factors">
            ${factorAnalysis.map(f => `
              <div class="md-factor-dot ${f.type}"
                   style="background:${scoreColor(f.score)}22; border-color:${scoreColor(f.score)}"
                   title="${f.factor.formulaLabel}: ${f.score}/10">
                <span>${f.factor.icon}</span>
                <span class="md-score" style="color:${scoreColor(f.score)}">${f.score}</span>
              </div>
            `).join('<span class="md-times">×</span>')}
          </div>
        </div>
        <div class="multiplicative-note">
          <span class="mn-icon">×</span>
          퍼포먼스는 <strong>곱셈 구조</strong> — 가장 낮은 요소가 전체를 제한합니다.
        </div>
      </div>

      ${chainsHtml}

      <!-- Bottleneck confirmation — conversational -->
      <div class="bottleneck-confirm">
        <p class="bc-question">어떤 요소가 가장 크게 제한하고 있다고 느껴지나요?</p>
        <p class="bc-hint">직관적으로 느껴지는 것을 선택하세요. 분석 결과와 달라도 괜찮아요.</p>
        <div class="bottleneck-select-grid" id="bottleneck-select">
          ${FACTORS.map(f => `
            <button class="bns-btn ${session.bottleneck === f.key ? 'selected' : ''}"
                    data-key="${f.key}" type="button">
              <span class="bns-icon">${f.icon}</span>
              <span class="bns-label">${f.formulaLabel}</span>
              ${session.bottleneck === f.key ? '<span class="bns-check">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
        <div class="coaching-note" id="bbn-coaching"
          style="display:${confirmed !== null ? 'flex' : 'none'}">
          <div class="cn-icon">${confirmed === true ? '✦' : '💬'}</div>
          <div class="cn-body" id="bbn-coaching-text">
            ${confirmed === true
              ? '좋아요. 이 이해를 바탕으로 레버리지를 설계합니다.'
              : '괜찮아요. 시스템은 계속 정교해집니다.'}
          </div>
        </div>
        <div class="confirm-row" style="margin-top:var(--sp-md)">
          <button class="confirm-btn ${confirmed === true ? 'selected' : ''}" id="btn-bbn-yes" type="button">
            <span>✓</span> 맞아요
          </button>
          <button class="confirm-btn ${confirmed === false ? 'selected' : ''}" id="btn-bbn-no" type="button">
            <span>△</span> 조금 달라요
          </button>
        </div>
      </div>
    `;

    // Bottleneck select
    el.querySelectorAll('.bns-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        el.querySelectorAll('.bns-btn').forEach(b => {
          b.classList.remove('selected');
          const chk = b.querySelector('.bns-check');
          if (chk) chk.remove();
        });
        this.classList.add('selected');
        if (!this.querySelector('.bns-check')) {
          const chk = document.createElement('span');
          chk.className = 'bns-check';
          chk.textContent = '✓';
          this.appendChild(chk);
        }
        Session.set('bottleneck', this.dataset.key);
        UI.setSaveIndicator('저장됨');
      });
    });

    // Confirm buttons
    const coaching = el.querySelector('#bbn-coaching');
    const coachTxt = el.querySelector('#bbn-coaching-text');
    el.querySelector('#btn-bbn-yes').addEventListener('click', function () {
      Session.set('bottleneckConfirmed', true);
      el.querySelectorAll('.confirm-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      coachTxt.textContent = '좋아요. 이 이해를 바탕으로 레버리지를 설계합니다.';
      coaching.style.display = 'flex';
      coaching.querySelector('.cn-icon').textContent = '✦';
      UI.setSaveIndicator('저장됨');
    });
    el.querySelector('#btn-bbn-no').addEventListener('click', function () {
      Session.set('bottleneckConfirmed', false);
      el.querySelectorAll('.confirm-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      coachTxt.textContent = '괜찮아요. 시스템은 계속 정교해집니다.';
      coaching.style.display = 'flex';
      coaching.querySelector('.cn-icon').textContent = '💬';
      UI.setSaveIndicator('저장됨');
    });

    return el;
  },

  /* ══════════════════════════════════════════
     STEP 5 — LEVERAGE & SYSTEM FORMATION
  ══════════════════════════════════════════ */
  step5() {
    const session = Session.all();
    const sys     = buildSystem(session);
    const el      = createScreen();
    const duration = Math.min(100, Math.max(14, parseInt(session.planDurationDays || 100, 10)));

    const driverChips = sys.drivers.map(d => `
      <div class="driver-chip ${d.role === 'accelerator' ? 'strong' : d.role === 'focus' ? 'focus' : ''}">
        <span class="chip-icon">${d.icon}</span>
        <div class="chip-body">
          <span class="chip-label">${d.formulaLabel || d.label}</span>
          <span class="chip-role-label">${d.roleLabel}</span>
        </div>
      </div>`).join('');

    const signalItems  = sys.signals.map(s => `
      <div class="signal-item"><div class="signal-dot"></div><span>${escHtml(s)}</span></div>`).join('');
    const practiceItems = (sys.practices || []).map(p => `
      <div class="signal-item">
        <div class="signal-dot" style="background:var(--c-accent3)"></div><span>${escHtml(p)}</span>
      </div>`).join('');

    el.innerHTML = `
      <div class="step-eyebrow">Step 5 · 시스템 형성</div>
      <h2 class="step-headline">시스템이<br>형태를 갖추고 있어요.</h2>
      <p class="step-sub">진단 결과로 당신의 퍼포먼스 시스템이 설계됐습니다.</p>

      <div class="north-star-box">
        <div class="north-star-label">☆ 북극성 목표</div>
        <div class="north-star-text">${escHtml(sys.northStar)}</div>
        ${session.goalType ? `<div class="ns-type-tag">${GOAL_TYPES[session.goalType]?.icon} ${GOAL_TYPES[session.goalType]?.label}</div>` : ''}
      </div>
      <div class="connector-line"></div>

      <div class="duration-select-box">
        <div class="ds-title">⏱ 계획 기간 (기본 100일)</div>
        <div class="ds-options">
          ${[14, 30, 60, 100].map(d => `
            <button class="ds-btn ${duration === d ? 'selected' : ''}" data-days="${d}" type="button">${d}일</button>
          `).join('')}
        </div>
      </div>

      <div class="system-section-label">⚡ 핵심 드라이버</div>
      <div class="drivers-grid">${driverChips}</div>

      <div class="signals-box">
        <div class="signals-title">📡 맞춤형 측정 신호</div>
        <p class="signals-sub">주간으로 이 신호들을 추적하세요.</p>
        ${signalItems}
      </div>

      <div class="signals-box">
        <div class="signals-title">🔧 핵심 실천 항목</div>
        <p class="signals-sub">레버리지가 높은 구체적 행동들입니다.</p>
        ${practiceItems}
      </div>

      <div class="coaching-note" style="margin-top:var(--sp-lg)">
        <div class="cn-icon">✦</div>
        <div class="cn-body">
          ${duration}일 계획을 생성할 준비가 됐어요.
          <span class="cn-sub">9요소 진단을 기반으로 맞춤 계획이 만들어집니다.</span>
        </div>
      </div>
    `;

    el.querySelectorAll('.ds-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Session.set('planDurationDays', parseInt(btn.dataset.days, 10));
        UI.renderStep(5, 'forward');
        UI.showToast(`계획 기간을 ${btn.dataset.days}일로 조정했어요.`);
      });
    });
    return el;
  },

  /* ══════════════════════════════════════════
     STEP 6 — 100-DAY PLAN
     ONLY reachable after ALL 9 elements done
     Phase 1: Stabilize / Phase 2: Build / Phase 3: Integrate
  ══════════════════════════════════════════ */
  step6() {
    const session = Session.all();
    const duration = Math.min(100, Math.max(14, parseInt(session.planDurationDays || 100, 10)));

    // Planning lock guard — hard enforcement
    if (!Session.isPlanningUnlocked()) {
      const el = createScreen();
      el.innerHTML = `
        <div class="step-eyebrow">Step 6 · ${duration}일 계획</div>
        <div class="lock-gate">
          <div class="lg-icon">🔒</div>
          <h2 class="lg-title">계획 생성이 잠겨 있어요.</h2>
          <p class="lg-body">
            9요소를 모두 진단해야 ${duration}일 계획이 생성됩니다.<br>
            현재 <strong>${(session.completedElements || []).length} / ${FACTORS.length}</strong>개 완료됐어요.
          </p>
          <div class="lg-progress">
            <div class="lg-progress-bar">
              <div class="lg-progress-fill" style="width:${((session.completedElements || []).length / FACTORS.length) * 100}%"></div>
            </div>
          </div>
          <button class="btn-nav btn-primary" id="btn-go-diagnose" type="button">
            → 진단 계속하기
          </button>
        </div>`;
      el.querySelector('#btn-go-diagnose').addEventListener('click', () => {
        Nav.goTo(3);
        UI.renderStep(3, 'back');
      });
      return el;
    }

    const plan        = session.plan;
    const domain      = session.goalDomain || 'general';
    const domainLabel = { fitness:'운동', writing:'글쓰기', career:'커리어', learning:'학습', creativity:'창의', social:'소통', general:'일반' }[domain] || '일반';
    const stretchHints = buildStretchRecovery(analyseFactors(session.factors));
    const el          = createScreen();

    // Phase별 주간 회고 로그 불러오기
    const phaseWeeklyLogs = session.phaseWeeklyLogs || { phase1: [], phase2: [], phase3: [] };

    // 기간 기반 주차 수 (기본: 100일 -> 5/5/5주)
    const PHASE_WEEKS = _phaseWeeks(duration);

    // 주간 회고 로그 렌더 헬퍼
    function _renderWeeklyLogHtml(phaseKey, phaseIdx) {
      const logs  = phaseWeeklyLogs[phaseKey] || [];
      const total = PHASE_WEEKS[phaseIdx];
      const logsById = {};
      logs.forEach(l => { logsById[l.week] = l; });

      // 주차 탭
      const weekTabs = Array.from({ length: total }, (_, w) => {
        const wn   = w + 1;
        const done = !!logsById[wn]?.saved;
        return `<button class="wrl-week-tab ${done ? 'done' : ''}" data-week="${wn}" data-phase="${phaseKey}" type="button">
          ${done ? '✓' : wn + '주'}
        </button>`;
      }).join('');

      // 주차별 총 완료 수 배지
      const completedCount = logs.filter(l => l.saved).length;

      return `
        <div class="weekly-review-loop" data-phase="${phaseKey}">
          <div class="wrl-header">
            <span class="wrl-title">📅 주간 회고</span>
            <span class="wrl-badge">${completedCount} / ${total}주 완료</span>
          </div>
          <div class="wrl-progress-bar">
            <div class="wrl-progress-fill" style="width:${Math.round((completedCount/total)*100)}%"></div>
          </div>
          <div class="wrl-week-tabs">${weekTabs}</div>
          <div class="wrl-form-wrap" id="wrl-form-${phaseKey}" style="display:none">
            <!-- 주차별 폼은 탭 클릭 시 동적으로 채워짐 -->
          </div>
        </div>`;
    }

    const phases = ['phase1', 'phase2', 'phase3'].map((key, i) => {
      const p   = plan[key];
      const cls = ['phase-1', 'phase-2', 'phase-3'][i];
      const phaseReflect = [
        '이 단계에서 가장 집중하고 싶은 한 가지는?',
        '이 단계에서 예상되는 가장 큰 도전은?',
        '이 단계를 완료하면 어떤 변화가 느껴질까요?',
      ][i];
      const phasePurpose = [
        '기반을 만드는 시간 — 안정적인 루틴과 관찰 시스템을 구축합니다.',
        '성과를 쌓는 시간 — 핵심 역량을 집중적으로 강화합니다.',
        '통합의 시간 — 모든 요소가 자연스럽게 연결됩니다.',
      ][i];
      return `
        <div class="phase-card ${cls} ${i === 0 ? 'open' : ''}">
          <div class="phase-header" role="button" tabindex="0" aria-expanded="${i === 0}">
            <div class="phase-num">${p.emoji}</div>
            <div class="phase-meta">
              <div class="phase-name">${p.nameKo} <span class="phase-name-en">${p.name}</span></div>
              <div class="phase-days">${p.days}</div>
            </div>
            <span class="phase-toggle">▾</span>
          </div>
          <div class="phase-body">
            <div class="phase-purpose-note">${phasePurpose}</div>
            <div class="phase-intent-box">
              <span class="pi-label">목적</span>
              <span class="pi-text">${p.intent}</span>
            </div>
            <div class="phase-focus">${p.focus}</div>
            <p class="phase-desc">${p.phaseDesc}</p>
            <ul class="action-list">
              ${p.actions.map(a => `<li>${escHtml(a)}</li>`).join('')}
            </ul>
            <div class="phase-reflect-prompt">
              <span class="prp-icon">🪞</span>
              <span>${phaseReflect}</span>
            </div>

            ${_renderWeeklyLogHtml(key, i)}
          </div>
        </div>`;
    }).join('');

    el.innerHTML = `
      <div class="step-eyebrow">Step 6 · ${duration}일 계획</div>
      <h2 class="step-headline">당신만의 ${duration}일<br>여정이에요.</h2>
      <div class="domain-pill">🎯 ${domainLabel} 목표 맞춤 계획</div>

      <div class="phase-intro">
        9요소 진단을 바탕으로 만들어진 계획입니다.<br>
        각 단계에는 <strong>명확한 목적</strong>이 있어요.
      </div>

      <div class="three-phase-overview">
        <div class="tpo-item phase-1-tpo">
          <span class="tpo-emoji">🌱</span>
          <strong>Stabilize</strong>
          <span>인식 &amp; 관찰</span>
        </div>
        <span class="tpo-arrow">→</span>
        <div class="tpo-item phase-2-tpo">
          <span class="tpo-emoji">🔥</span>
          <strong>Build</strong>
          <span>핵심 강화</span>
        </div>
        <span class="tpo-arrow">→</span>
        <div class="tpo-item phase-3-tpo">
          <span class="tpo-emoji">🚀</span>
          <strong>Integrate</strong>
          <span>일관성 통합</span>
        </div>
      </div>

      <div class="plan-phases">${phases}</div>

      <div class="stretch-box">
        <div class="stretch-title">⚡ 도전과 회복의 리듬</div>
        ${stretchHints.map(h => `
          <div class="signal-item">
            <div class="signal-dot" style="background:var(--c-accent)"></div>
            <span>${h}</span>
          </div>`).join('')}
      </div>

      <div class="coaching-note" style="margin-top:var(--sp-lg)">
        <div class="cn-icon">✦</div>
        <div class="cn-body">
          계획은 살아있어요.
          <span class="cn-sub">성찰을 통해 계속 진화합니다. 다음 단계에서 첫 성찰을 시작해요.</span>
        </div>
      </div>
    `;

    el.querySelectorAll('.phase-header').forEach(header => {
      const card = header.closest('.phase-card');
      function toggle() {
        const isOpen = card.classList.contains('open');
        el.querySelectorAll('.phase-card').forEach(c => {
          c.classList.remove('open');
          c.querySelector('.phase-header').setAttribute('aria-expanded', 'false');
          c.querySelector('.phase-toggle').textContent = '▾';
        });
        if (!isOpen) {
          card.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
          header.querySelector('.phase-toggle').textContent = '▴';
        }
      }
      header.addEventListener('click', toggle);
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });

    // ── 주간 회고 탭 바인딩 ──────────────────────────────────
    function _buildWeekForm(formWrap, phaseKey, weekNum) {
      const sess     = Session.all();
      const logs     = (sess.phaseWeeklyLogs || {})[phaseKey] || [];
      const existing = logs.find(l => l.week === weekNum) || {};
      const progress = existing.progress || 3;
      const stars    = [1,2,3,4,5].map(n =>
        `<button class="wrl-star ${n <= progress ? 'on' : ''}" data-val="${n}" type="button">★</button>`
      ).join('');
      const saved    = existing.saved || false;

      formWrap.innerHTML = `
        <div class="wrl-form" data-phase="${phaseKey}" data-week="${weekNum}">
          <div class="wrl-form-title">${weekNum}주차 중간회고</div>

          <div class="wrl-field">
            <label class="wrl-label">이번 주 진행도</label>
            <div class="wrl-stars" id="wrl-stars-${phaseKey}-${weekNum}">${stars}</div>
          </div>

          <div class="wrl-field">
            <label class="wrl-label">✅ 이번 주 잘 된 것</label>
            <textarea class="wrl-textarea" id="wrl-wins-${phaseKey}-${weekNum}"
              placeholder="작은 성공, 관찰된 변화…" maxlength="300"
              rows="2">${escHtml(existing.wins || '')}</textarea>
          </div>

          <div class="wrl-field">
            <label class="wrl-label">🔧 어려웠던 것 / 조정할 것</label>
            <textarea class="wrl-textarea" id="wrl-struggles-${phaseKey}-${weekNum}"
              placeholder="예상과 달랐거나 힘든 부분…" maxlength="300"
              rows="2">${escHtml(existing.struggles || '')}</textarea>
          </div>

          <div class="wrl-field">
            <label class="wrl-label">🎯 다음 주 한 가지 행동</label>
            <input class="wrl-input" id="wrl-next-${phaseKey}-${weekNum}" type="text"
              placeholder="가장 작고 확실한 다음 액션" maxlength="120"
              value="${escHtml(existing.nextAction || '')}"/>
          </div>

          <button class="wrl-save-btn ${saved ? 'saved' : ''}" id="wrl-save-${phaseKey}-${weekNum}" type="button">
            ${saved ? '✓ 저장됨' : '회고 저장'}
          </button>
          ${saved ? `<div class="wrl-saved-date">마지막 저장: ${new Date(existing.savedAt || Date.now()).toLocaleDateString('ko-KR', {month:'long', day:'numeric'})}</div>` : ''}
        </div>`;

      // 별점 클릭
      formWrap.querySelectorAll('.wrl-star').forEach(star => {
        star.addEventListener('click', () => {
          const val = parseInt(star.dataset.val);
          formWrap.querySelectorAll('.wrl-star').forEach((s, idx) => {
            s.classList.toggle('on', idx < val);
          });
          _saveWeekLog(phaseKey, weekNum, formWrap, val);
        });
      });

      // textarea / input 변경 시 자동 저장
      ['wins','struggles'].forEach(field => {
        const ta = formWrap.querySelector(`#wrl-${field}-${phaseKey}-${weekNum}`);
        if (ta) ta.addEventListener('input', () => _saveWeekLog(phaseKey, weekNum, formWrap, null));
      });
      const nextInp = formWrap.querySelector(`#wrl-next-${phaseKey}-${weekNum}`);
      if (nextInp) nextInp.addEventListener('input', () => _saveWeekLog(phaseKey, weekNum, formWrap, null));

      // 저장 버튼
      const saveBtn = formWrap.querySelector(`#wrl-save-${phaseKey}-${weekNum}`);
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          _saveWeekLog(phaseKey, weekNum, formWrap, null, true);
        });
      }
    }

    function _saveWeekLog(phaseKey, weekNum, formWrap, forceProgress, markSaved) {
      const sess = Session.all();
      if (!sess.phaseWeeklyLogs) sess.phaseWeeklyLogs = { phase1:[], phase2:[], phase3:[] };
      if (!sess.phaseWeeklyLogs[phaseKey]) sess.phaseWeeklyLogs[phaseKey] = [];
      const logs = sess.phaseWeeklyLogs[phaseKey];
      let entry  = logs.find(l => l.week === weekNum);
      if (!entry) {
        entry = { week: weekNum, phaseKey, progress: 3, wins: '', struggles: '', nextAction: '', saved: false, savedAt: null };
        logs.push(entry);
      }
      if (forceProgress !== null && forceProgress !== undefined) entry.progress = forceProgress;
      // 별점 현재값
      const starCount = formWrap.querySelectorAll('.wrl-star.on').length;
      if (starCount > 0) entry.progress = starCount;
      entry.wins       = formWrap.querySelector(`#wrl-wins-${phaseKey}-${weekNum}`)?.value.trim() || entry.wins;
      entry.struggles  = formWrap.querySelector(`#wrl-struggles-${phaseKey}-${weekNum}`)?.value.trim() || entry.struggles;
      entry.nextAction = formWrap.querySelector(`#wrl-next-${phaseKey}-${weekNum}`)?.value.trim() || entry.nextAction;
      if (markSaved) {
        entry.saved   = true;
        entry.savedAt = Date.now();
        const btn = formWrap.querySelector(`#wrl-save-${phaseKey}-${weekNum}`);
        if (btn) { btn.textContent = '✓ 저장됨'; btn.classList.add('saved'); }
        UI.showToast(`${weekNum}주차 회고 저장 완료 ✓`);
        // 탭 뱃지 업데이트
        const tab = el.querySelector(`.wrl-week-tab[data-week="${weekNum}"][data-phase="${phaseKey}"]`);
        if (tab) { tab.textContent = '✓'; tab.classList.add('done'); }
        // 진행 바 업데이트
        const loopWrap = el.querySelector(`.weekly-review-loop[data-phase="${phaseKey}"]`);
        if (loopWrap) {
          const total = PHASE_WEEKS[['phase1','phase2','phase3'].indexOf(phaseKey)];
          const savedLogs = sess.phaseWeeklyLogs[phaseKey].filter(l => l.saved).length;
          const fill = loopWrap.querySelector('.wrl-progress-fill');
          if (fill) fill.style.width = Math.round((savedLogs/total)*100) + '%';
          const badge = loopWrap.querySelector('.wrl-badge');
          if (badge) badge.textContent = `${savedLogs} / ${total}주 완료`;
        }
      }
      Session.set('phaseWeeklyLogs', sess.phaseWeeklyLogs);
      UI.setSaveIndicator('저장됨');
    }

    // 탭 클릭 이벤트 위임
    el.querySelectorAll('.wrl-week-tabs').forEach(tabRow => {
      tabRow.addEventListener('click', e => {
        const tab = e.target.closest('.wrl-week-tab');
        if (!tab) return;
        const phaseKey = tab.dataset.phase;
        const weekNum  = parseInt(tab.dataset.week);
        const formWrap = el.querySelector(`#wrl-form-${phaseKey}`);
        if (!formWrap) return;

        // 탭 활성
        tabRow.querySelectorAll('.wrl-week-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 폼 토글: 같은 탭 클릭 시 닫기
        if (formWrap.style.display !== 'none' && formWrap.dataset.activeWeek === String(weekNum)) {
          formWrap.style.display = 'none';
          formWrap.dataset.activeWeek = '';
        } else {
          formWrap.style.display = 'block';
          formWrap.dataset.activeWeek = String(weekNum);
          _buildWeekForm(formWrap, phaseKey, weekNum);
        }
      });
    });

    return el;
  },

  /* ══════════════════════════════════════════
     STEP 7 — REFLECTION LOOP
     User can revisit any element at any time
  ══════════════════════════════════════════ */
  step7() {
    const session      = Session.all();
    const reflAnalysis = (session.reflectionUseful || session.reflectionAdjust)
      ? analyseReflection(session) : null;
    const isRevisit    = session.completedSteps.includes(7);
    const el           = createScreen();

    // Phase별 주간 회고 진행 현황 요약 카드
    const phaseLogs = session.phaseWeeklyLogs || { phase1:[], phase2:[], phase3:[] };
    const durationDays = Math.min(100, Math.max(14, parseInt(session.planDurationDays || 100, 10)));
    const weekPlan = _phaseWeeks(durationDays);
    const PHASE_INFO = [
      { key:'phase1', emoji:'🌱', name:'Stabilize', total:weekPlan[0] },
      { key:'phase2', emoji:'🔥', name:'Build',     total:weekPlan[1] },
      { key:'phase3', emoji:'🚀', name:'Integrate', total:weekPlan[2] },
    ];
    const totalSaved   = PHASE_INFO.reduce((s, p) => s + (phaseLogs[p.key]||[]).filter(l=>l.saved).length, 0);
    const totalWeeks   = weekPlan.reduce((a, b) => a + b, 0);
    const hasAnyLog    = totalSaved > 0;

    const phaseProgressHtml = `
      <div class="phase-review-summary">
        <div class="prs-header">
          <span class="prs-title">📊 Phase별 주간 회고 현황</span>
          <span class="wrl-badge">${totalSaved} / ${totalWeeks}주 완료</span>
        </div>
        <div class="prs-grid">
          ${PHASE_INFO.map(p => {
            const saved = (phaseLogs[p.key]||[]).filter(l=>l.saved).length;
            const pct   = Math.round((saved/p.total)*100);
            return `
              <div class="prs-item">
                <div class="prs-phase-top">
                  <span class="prs-emoji">${p.emoji}</span>
                  <span class="prs-phase-name">${p.name}</span>
                  <span class="prs-count">${saved}/${p.total}</span>
                </div>
                <div class="prs-bar">
                  <div class="prs-fill" style="width:${pct}%;background:${
                    p.key==='phase1'? 'var(--c-low)' : p.key==='phase2'? 'var(--c-mid)' : 'var(--c-high)'
                  }"></div>
                </div>
              </div>`;
          }).join('')}
        </div>
        ${hasAnyLog ? `
          <button class="btn-goto-plan" id="btn-goto-plan" type="button">
            → ${durationDays}일 계획으로 이동해 회고 작성
          </button>` : `
          <p class="prs-empty">${durationDays}일 계획(Step 6)에서 Phase별 주간 회고를 작성해보세요.</p>`}
      </div>`;

    const adjustHtml = reflAnalysis?.adjustments?.length ? `
      <div class="reflection-insight">
        <div class="ri-header">
          <div class="ri-icon">🔄</div>
          <div>
            <div class="ri-title">시스템 조정 제안</div>
            <div class="ri-summary">${reflAnalysis.summary}</div>
          </div>
        </div>
        ${reflAnalysis.adjustments.map(a => {
          const f = FACTORS.find(ff => ff.key === a.factor);
          return `
            <div class="ri-item">
              <div class="ri-factor">${f?.icon || ''} ${f?.formulaLabel || a.factor}</div>
              <div class="ri-suggestion">${a.suggestion}</div>
            </div>`;
        }).join('')}
        <button class="btn-recalc" id="btn-recalc" type="button">
          ✦ 성찰 내용으로 계획 업데이트
        </button>
      </div>` : '';

    const weeklyHtml = isRevisit ? `
      <div class="divider"></div>
      <div class="weekly-section">
        <div class="weekly-title">📅 주간 체크인</div>
        <p class="weekly-sub">지난 한 주를 돌아보며, 시스템에 어떤 일이 있었나요?</p>
        <textarea id="inp-weekly" class="field-textarea"
          placeholder="이번 주 진행 상황, 배운 것, 다음 주 조정할 것…"
          maxlength="500" style="min-height:80px"></textarea>
        <button class="btn-checkin" id="btn-add-checkin" type="button">
          + 체크인 저장
        </button>
        ${session.weeklyCheckins?.length ? `
          <div class="checkin-history">
            <div class="ch-title">이전 체크인 (${session.weeklyCheckins.length}회)</div>
            ${session.weeklyCheckins.slice(-3).reverse().map(c => `
              <div class="ch-item">
                <div class="ch-date">${new Date(c.date).toLocaleDateString('ko-KR', {month:'long',day:'numeric'})}</div>
                <div class="ch-note">${escHtml(c.notes)}</div>
              </div>`).join('')}
          </div>` : ''}
      </div>` : '';

    el.innerHTML = `
      <div class="step-eyebrow">Step 7 · 성찰 &amp; 자기진화</div>
      <h2 class="step-headline">잠깐 멈추고<br>돌아봐요.</h2>
      <p class="step-sub">성찰은 시스템을 더 정확하게 만드는 연료예요.</p>

      ${phaseProgressHtml}

      <div class="reflection-prompt">
        <div class="reflection-q">무엇이 달라졌나요?</div>
        <p class="reflection-hint">이 여정에서 가장 도움이 된 것은?</p>
        <textarea id="inp-useful" class="field-textarea"
          placeholder="자유롭게 — 작은 것도 괜찮아요"
          maxlength="500">${escHtml(session.reflectionUseful)}</textarea>
      </div>

      <div class="reflection-prompt">
        <div class="reflection-q">무엇이 개선됐나요?</div>
        <p class="reflection-hint">아주 작은 변화라도, 눈에 띈 것이 있나요?</p>
        <textarea id="inp-adjust" class="field-textarea"
          placeholder="어떤 부분이 조금 나아진 것 같나요?"
          maxlength="500">${escHtml(session.reflectionAdjust)}</textarea>
      </div>

      <div class="reflection-prompt optional-field">
        <div class="reflection-q">무엇이 더 어렵게 느껴지나요? <span class="optional-tag">선택</span></div>
        <p class="reflection-hint">예상보다 힘든 부분이 있다면 시스템을 조정할 수 있어요.</p>
        <textarea id="inp-harder" class="field-textarea"
          placeholder="생각보다 어려운 부분이 있다면 솔직하게…"
          maxlength="400">${escHtml(session.reflectionHarder || '')}</textarea>
      </div>

      <div class="reflection-prompt optional-field">
        <div class="reflection-q">내일 바로 시작할 한 가지 <span class="optional-tag">선택</span></div>
        <p class="reflection-hint">가장 작고, 가장 확실한 첫 행동은?</p>
        <input id="inp-commit" class="field-input" type="text"
          placeholder="예: 매일 저녁 10분 성찰 노트 쓰기"
          value="${escHtml(session.reflectionCommit)}" maxlength="120"/>
      </div>

      <!-- Revisit any element at any time -->
      <div class="revisit-box">
        <div class="revisit-title">🔄 요소 재진단</div>
        <p class="revisit-sub">시스템을 더 정교하게 만들고 싶다면 언제든 요소 진단으로 돌아갈 수 있어요.</p>
        <div class="revisit-elements-grid" id="revisit-elements-grid">
          ${FACTORS.map((f, i) => `
            <button class="rev-elem-btn" data-idx="${i}" type="button" title="${f.label}">
              <span>${f.icon}</span>
              <span class="rev-elem-label">${f.formulaLabel}</span>
            </button>
          `).join('')}
        </div>
        <button class="btn-revisit" id="btn-revisit-all" type="button">
          ← 9요소 처음부터 다시 하기
        </button>
      </div>

      ${adjustHtml}

      <div class="coaching-note" style="margin-top:var(--sp-lg)">
        <div class="cn-icon">✦</div>
        <div class="cn-body">
          이 성찰이 시스템을 더 정확하게 만들어요.
          <span class="cn-sub">완료를 누르면 시스템 요약이 생성됩니다.</span>
        </div>
      </div>

      ${weeklyHtml}
    `;

    el.querySelector('#inp-useful').addEventListener('input', e => {
      Session.set('reflectionUseful', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });
    el.querySelector('#inp-adjust').addEventListener('input', e => {
      Session.set('reflectionAdjust', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });
    el.querySelector('#inp-harder')?.addEventListener('input', e => {
      Session.set('reflectionHarder', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });
    el.querySelector('#inp-commit').addEventListener('input', e => {
      Session.set('reflectionCommit', e.target.value.trim());
      UI.setSaveIndicator('저장됨');
    });

    // Revisit individual element
    el.querySelectorAll('.rev-elem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const elemIdx = parseInt(btn.dataset.idx);
        Session.set('currentElementIdx', elemIdx);
        Nav.goTo(3);
        UI.renderStep(3, 'back');
        UI.showToast(`${FACTORS[elemIdx].icon} ${FACTORS[elemIdx].label} 재진단 시작`);
      });
    });

    // Go to 100-day plan for weekly review
    el.querySelector('#btn-goto-plan')?.addEventListener('click', () => {
      Nav.goTo(6);
      UI.renderStep(6, 'forward');
      UI.showToast('100일 계획에서 Phase별 주간 회고를 작성하세요 📅');
    });

    // Revisit all elements
    el.querySelector('#btn-revisit-all').addEventListener('click', () => {
      Session.set('currentElementIdx', 0);
      Nav.goTo(3);
      UI.renderStep(3, 'back');
      UI.showToast('요소를 다시 탐색할 수 있어요. 변경사항이 저장됩니다.');
    });

    el.querySelector('#btn-recalc')?.addEventListener('click', function () {
      buildSystem(Session.all());
      UI.showToast('✦ 계획이 성찰 내용을 반영해 업데이트됐어요!', 3000);
      this.textContent = '✓ 업데이트 완료';
      this.disabled = true;
    });

    const checkinBtn = el.querySelector('#btn-add-checkin');
    const checkinInp = el.querySelector('#inp-weekly');
    if (checkinBtn && checkinInp) {
      checkinBtn.addEventListener('click', () => {
        const notes = checkinInp.value.trim();
        if (!notes) { UI.showToast('체크인 내용을 먼저 입력해 주세요.'); return; }
        const ex = Session.get('weeklyCheckins') || [];
        ex.push({ date: Date.now(), notes });
        Session.set('weeklyCheckins', ex);
        Session.set('reviewCount', (Session.get('reviewCount') || 0) + 1);
        Session.set('lastReviewAt', Date.now());
        checkinInp.value = '';
        UI.showToast(`📅 ${ex.length}번째 체크인 저장!`);
        UI.renderStep(7, 'forward');
      });
    }

    return el;
  },

  /* ══════════════════════════════════════════
     STEP 8 — SUMMARY
  ══════════════════════════════════════════ */
  stepSummary() {
    const session        = Session.all();
    const factorAnalysis = analyseFactors(session.factors);
    const leveragePoints = getTopLeveragePoints(factorAnalysis);
    const bottleneck     = computeBottleneck(factorAnalysis);
    const reviewCount    = session.reviewCount || 0;
    const duration       = Math.min(100, Math.max(14, parseInt(session.planDurationDays || 100, 10)));
    const el             = createScreen();

    const factorChips = FACTORS.map(f => {
      const score = (session.factors[f.key] || {}).score || 5;
      const pct   = (score / 10) * 100;
      const color = scoreColor(score);
      return `
        <div class="factor-chip">
          <div class="factor-chip-name">${f.icon} ${f.formulaLabel}</div>
          <div class="factor-chip-bar">
            <div class="factor-chip-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <div class="factor-chip-score" style="color:${color}">${score}/10</div>
        </div>`;
    }).join('');

    const energySub = session.energySub;
    const energySubHtml = energySub ? `
      <div class="energy-sub-summary">
        ${[{k:'physical',l:'Physical',i:'💪'},{k:'cognitive',l:'Cognitive',i:'🧠'},{k:'emotional',l:'Affective',i:'💛'}].map(s => {
          const v = energySub[s.k] || 5;
          return `<div class="energy-sub-chip">
            <span>${s.i} ${s.l}</span>
            <span style="color:${scoreColor(v)};font-weight:600">${v}/10</span>
          </div>`;
        }).join('')}
      </div>` : '';

    const leverageSummary = leveragePoints.map(({ factor, type, insight }) => `
      <div class="signal-item">
        <div class="signal-dot" style="background:${type==='bottleneck'?'var(--c-low)':type==='strength'?'var(--c-high)':'var(--c-mid)'}"></div>
        <span>${{bottleneck:'⚠️',strength:'✅',neutral:'○'}[type]}
          <strong>${factor.formulaLabel || factor.label}</strong> — ${insight}
        </span>
      </div>`).join('');

    const reflectionPrompts = [
      session.reflectionCommit
        ? `✦ 내일 첫 행동: "${escHtml(session.reflectionCommit)}"`
        : '어떤 작은 행동을 내일 바로 시작할 수 있을까요?',
      '첫 33일 동안 가장 집중해야 할 한 가지는?',
      '어떤 요소를 개선하면 전체 시스템이 올라갈까요?',
      '언제 첫 번째 주간 체크인을 할까요?',
    ].map(q => `
      <div class="signal-item">
        <div class="signal-dot" style="background:var(--c-accent3)"></div>
        <span>${q}</span>
      </div>`).join('');

    el.innerHTML = `
      <div class="step-eyebrow">완성 ✦</div>
      <h2 class="step-headline">시스템이<br>완성됐어요.</h2>
      <p class="step-sub">9요소 진단 기반의 퍼포먼스 시스템입니다.<br>
        이것은 살아있어요 — 사용할수록 정교해집니다.
      </p>

      <div class="summary-section">
        <div class="summary-section-title">☆ 북극성 목표</div>
        <div class="north-star-box" style="margin-bottom:0;text-align:left">
          <div class="north-star-text">${escHtml(session.system.northStar || session.goal)}</div>
          ${session.goalType ? `<div class="ns-type-tag">${GOAL_TYPES[session.goalType]?.icon} ${GOAL_TYPES[session.goalType]?.label}</div>` : ''}
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-section-title">📊 Performance Formula 현황</div>
        <div class="formula-score-bar">
          ${FORMULA_DISPLAY.map(f => {
            const score = (session.factors[f.key] || {}).score || 5;
            return `<div class="fsb-item" title="${f.label}: ${score}/10">
              <span class="fsb-label">${f.short}</span>
              <div class="fsb-bar">
                <div class="fsb-fill" style="height:${score * 10}%;background:${scoreColor(score)}"></div>
              </div>
              <span class="fsb-score" style="color:${scoreColor(score)}">${score}</span>
            </div>`;
          }).join('')}
        </div>
        ${energySubHtml}
        <div class="bottleneck-mini">
          <span class="bm-label">주요 병목:</span>
          <span class="bm-factor" style="color:${scoreColor(bottleneck.primary.score)}">
            ${bottleneck.primary.factor.icon} ${bottleneck.primary.factor.formulaLabel} (${bottleneck.primary.score}/10)
          </span>
          <span class="bm-loss">잠재 퍼포먼스 약 ${bottleneck.lossRatio}% 제한 중</span>
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-section-title">🎯 핵심 레버리지</div>
        <div class="signals-box" style="margin-top:0">${leverageSummary}</div>
      </div>

      <div class="summary-section">
        <div class="summary-section-title">🗺 ${duration}일 계획</div>
        <div class="plan-phases">${buildMiniPhaseSummary(session.plan)}</div>
      </div>

      <div class="summary-section">
        <div class="summary-section-title">📡 측정 신호</div>
        <div class="signals-box" style="margin-top:0">
          ${(session.system.signals || []).map(s => `
            <div class="signal-item"><div class="signal-dot"></div><span>${escHtml(s)}</span></div>`).join('')}
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-section-title">🪞 성찰 질문</div>
        <div class="signals-box" style="margin-top:0">${reflectionPrompts}</div>
      </div>

      <div class="cta-refine">
        <div class="cta-icon">♻️</div>
        <p>이 시스템은 살아있어요.<br>언제든 요소를 재진단하고, 성찰하고, 진화시키세요.</p>
        ${reviewCount > 0 ? `<div class="review-count-badge">✦ 누적 ${reviewCount}회 리뷰</div>` : ''}
        <div class="cta-actions">
          <button class="btn-export" id="btn-copy-summary" type="button">
            <span>📋</span> 요약 복사
          </button>
          <button class="btn-review" id="btn-re-diagnose" type="button">
            <span>🔬</span> 요소 재진단
          </button>
        </div>
      </div>
    `;

    el.querySelector('#btn-copy-summary').addEventListener('click', () => {
      navigator.clipboard.writeText(buildTextSummary(session))
        .then(() => UI.showToast('📋 클립보드에 복사됐어요!'))
        .catch(() => UI.showToast('복사에 실패했어요.'));
    });
    el.querySelector('#btn-re-diagnose').addEventListener('click', () => {
      Session.set('currentElementIdx', 0);
      Nav.goTo(3);
      UI.renderStep(3, 'back');
    });

    return el;
  },
};

/* ══════════════════════════════════════════════
   FORMULA BAR BUILDER
   Shows full formula: P = Energy × Luck × ... × Meta-cog
   Current element is highlighted
   Completed elements are dimmed/checked
══════════════════════════════════════════════ */
function _buildFormulaBar(currentIdx, completedKeys) {
  const items = FORMULA_DISPLAY.map((f, i) => {
    const isDone    = completedKeys.includes(f.key);
    const isCurrent = i === currentIdx;
    let cls = 'fb-item ';
    if      (isCurrent) cls += 'fb-current';
    else if (isDone)    cls += 'fb-done';
    else                cls += 'fb-pending';

    return `<span class="${cls}" title="${f.label}">${isDone && !isCurrent ? '✓' : f.short}</span>`;
  });

  return `
    <div class="formula-bar" aria-label="성과 공식 진행">
      <span class="fb-prefix">P =</span>
      <div class="fb-items-wrap">
        ${items.join('<span class="fb-times">×</span>')}
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════
   ENERGY SUB-SCALE HTML
══════════════════════════════════════════════ */
/* Energy sub-scale UI removed — CAP = Cognitive·Affective·Physical (acronym only) */

/* ══════════════════════════════════════════════
   LUCK SPECIAL UI
   "나는 운이 좋은 사람이다" 자기인식 체크 +
   운을 만드는 4가지 항목 + 맥락 방향 선택
══════════════════════════════════════════════ */
function _buildLuckSpecialHtml(session) {
  const luckData  = session.luckData || {};
  const direction = luckData.contextDirection || '';

  const dirBtns = [
    { key: 'tailwind', label: '순풍 🌊', desc: '지금 맥락이 목표를 도와줘요' },
    { key: 'neutral',  label: '중립 ⚖️', desc: '특별히 유리하거나 불리하지 않아요' },
    { key: 'headwind', label: '역풍 🌪', desc: '지금 맥락이 목표를 방해해요' },
  ].map(d => `
    <button class="luck-dir-btn ${direction === d.key ? 'selected' : ''}"
            data-dir="${d.key}" type="button">
      <span class="ldb-label">${d.label}</span>
      <span class="ldb-desc">${d.desc}</span>
    </button>
  `).join('');

  return `
    <div class="luck-special-wrap">
      <div class="luck-direction-box">
        <div class="luck-box-title">🧭 지금 이 목표의 맥락은?</div>
        <div class="luck-dir-grid" id="luck-dir-grid">${dirBtns}</div>
      </div>
    </div>`;
}

/* ── BIND LUCK SPECIAL EVENTS ────────────────── */
function _bindLuckSpecialEvents(el, session) {
  // Direction buttons (순풍 / 중립 / 역풍)
  const dirGrid = el.querySelector('#luck-dir-grid');
  if (dirGrid) {
    dirGrid.querySelectorAll('.luck-dir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dirGrid.querySelectorAll('.luck-dir-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const luckData = session.luckData || {};
        luckData.contextDirection = btn.dataset.dir;
        Session.set('luckData', luckData);
        UI.setSaveIndicator('저장됨');
      });
    });
  }
}

/* ══════════════════════════════════════════════
   PRIVATE HELPERS
══════════════════════════════════════════════ */
function _applyGoalType(type, el) {
  Session.set('goalType', type);
  Session.set('goalTypeConfirmed', true);
  el.querySelectorAll('.goal-type-card').forEach(b => b.classList.remove('selected'));
  const btn = el.querySelector(`.goal-type-card[data-type="${type}"]`);
  if (btn) btn.classList.add('selected');
  const note = el.querySelector('#goal-coaching-note');
  const t    = GOAL_TYPES[type];
  if (note && t) {
    note.style.display = 'flex';
    const iconEl = note.querySelector('.cn-icon');
    const bodyEl = note.querySelector('.cn-body');
    if (iconEl) iconEl.textContent = t.icon;
    if (bodyEl) bodyEl.innerHTML = `<strong>${t.label}</strong><span class="cn-sub">${t.coaching}</span>`;
  }
  UI.setSaveIndicator('저장됨');
}

function _domainLabel(domain) {
  const m = { fitness:'💪 운동·체력', writing:'✍️ 글쓰기', career:'💼 커리어', learning:'📚 학습', creativity:'🎨 창의', social:'🗣 소통' };
  return m[domain] || '';
}

function _phaseWeeks(days) {
  const safeDays = Math.min(100, Math.max(14, parseInt(days || 100, 10)));
  const totalWeeks = Math.max(2, Math.ceil(safeDays / 7));
  const p1 = Math.max(1, Math.round(totalWeeks / 3));
  const p2 = Math.max(1, Math.round(totalWeeks / 3));
  const p3 = Math.max(1, totalWeeks - p1 - p2);
  return [p1, p2, p3];
}

/* ══════════════════════════════════════════════
   SHARED HELPERS
══════════════════════════════════════════════ */
function buildMiniPhaseSummary(plan) {
  return ['phase1', 'phase2', 'phase3'].map((key, i) => {
    const p   = plan[key];
    const cls = ['phase-1', 'phase-2', 'phase-3'][i];
    return `
      <div class="phase-card ${cls}">
        <div class="phase-header" style="cursor:default">
          <div class="phase-num">${p.emoji || (i + 1)}</div>
          <div class="phase-meta">
            <div class="phase-name">${p.nameKo || p.name} <span class="phase-name-en">${p.name}</span></div>
            <div class="phase-days">${p.days} · ${p.focus}</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function buildTextSummary(session) {
  const plan = session.plan;
  const duration = Math.min(100, Math.max(14, parseInt(session.planDurationDays || 100, 10)));
  return [
    `◎ COMPASS — 나의 ${duration}일 퍼포먼스 시스템`,
    `생성일: ${new Date().toLocaleDateString('ko-KR')}`,
    '',
    'Performance = Energy(CAP) × Luck × Social Cap × VTK × VEK × Practice × Habit × Tools × Meta-cog',
    '',
    '☆ 북극성 목표',
    session.system.northStar || session.goal,
    '',
    '📊 9요소 현황',
    ...FACTORS.map(f => `  ${f.icon} ${f.formulaLabel} (${f.label}): ${(session.factors[f.key]||{}).score||5}/10`),
    '',
    '⚡ Energy 서브스케일',
    `  💪 Physical: ${session.energySub?.physical||5}/10`,
    `  🧠 Cognitive: ${session.energySub?.cognitive||5}/10`,
    `  💛 Affective: ${session.energySub?.emotional||5}/10`,
    '',
    '📡 측정 신호',
    ...(session.system.signals||[]).map(s => `  › ${s}`),
    '',
    '🔧 핵심 실천',
    ...(session.system.practices||[]).map(p => `  › ${p}`),
    '',
    `🗺 ${duration}일 계획`,
    '',
    ...[plan.phase1, plan.phase2, plan.phase3].flatMap(p => [
      `[${p.nameKo} / ${p.name}] ${p.days}`,
      `목적: ${p.intent}`,
      p.focus,
      ...p.actions.map(a => `  › ${a}`),
      '',
    ]),
    '🪞 성찰',
    session.reflectionUseful ? `달라진 것: ${session.reflectionUseful}` : '',
    session.reflectionAdjust ? `개선된 것: ${session.reflectionAdjust}` : '',
    session.reflectionCommit ? `내일 첫 행동: ${session.reflectionCommit}` : '',
    '',
    `📅 주간 체크인: ${session.reviewCount||0}회 완료`,
  ].filter(l => l !== undefined).join('\n');
}

function createScreen() {
  const div = document.createElement('div');
  div.className = 'step-screen';
  return div;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ══════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════ */
const Nav = {
  TOTAL: 9,
  _direction: 'forward',

  current()  { return Session.get('currentStep'); },

  canNext()  {
    const s    = Session.all();
    const step = this.current();
    if (step === 1) return s.goal && s.goal.trim().length > 0;
    if (step === 2) return s.currentSituation && s.currentSituation.trim().length > 0;
    // Step 3: outer nav only advances after ALL 9 elements are done
    if (step === 3) return Session.isPlanningUnlocked();
    return true;
  },

  next() {
    const cur = this.current();
    if (cur >= this.TOTAL - 1) return;
    if (!this.canNext()) {
      if (cur === 3) {
        UI.showToast('9요소를 모두 진단해야 다음으로 이동합니다 🔒');
      } else {
        UI.showToast('먼저 내용을 입력해 주세요 ✏️');
      }
      return false;
    }
    this._direction = 'forward';
    Session.markStepComplete(cur);
    Session.setStep(cur + 1);
    return true;
  },

  back() {
    const cur = this.current();
    if (cur <= 0) return;
    this._direction = 'back';
    Session.setStep(cur - 1);
  },

  goTo(idx) {
    this._direction = idx > this.current() ? 'forward' : 'back';
    Session.setStep(idx);
  },

  direction() { return this._direction; },
};
