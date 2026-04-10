/* ═══════════════════════════════════════════════
   COMPASS — ui.js  v5
   UI Controller: progress, nav state, toast,
   step transitions, save indicator
   Updated: element sub-step progress for Step 3
═══════════════════════════════════════════════ */

const UI = {

  /* ── DOM REFS ─────────────────────────────── */
  $stage:    null,
  $fill:     null,
  $dots:     null,
  $label:    null,
  $counter:  null,
  $btnNext:  null,
  $btnBack:  null,
  $toast:    null,
  $save:     null,
  _toastTimer: null,
  _saveTimer:  null,

  /** Cache DOM elements (call once after DOMContentLoaded) */
  init() {
    this.$stage   = document.getElementById('stage');
    this.$fill    = document.getElementById('progress-fill');
    this.$dots    = document.getElementById('step-dots');
    this.$label   = document.getElementById('step-label');
    this.$counter = document.getElementById('step-counter');
    this.$btnNext = document.getElementById('btn-next');
    this.$btnBack = document.getElementById('btn-back');
    this.$toast   = document.getElementById('toast');
    this.$save    = document.getElementById('save-indicator');
    this._buildDots();
    const updatedAt = Session.get('updatedAt');
    if (updatedAt) this.renderLastSaved(updatedAt);
  },

  /* ── STEP DOTS ────────────────────────────── */
  _buildDots() {
    this.$dots.innerHTML = '';
    const visible = [1, 2, 3, 4, 5, 6, 7, 8];
    visible.forEach(idx => {
      const dot = document.createElement('div');
      dot.className = 'step-dot';
      dot.dataset.idx = idx;
      dot.setAttribute('aria-hidden', 'true');
      this.$dots.appendChild(dot);
    });
  },

  /* ── PROGRESS UPDATE ──────────────────────── */
  updateProgress(stepIdx) {
    let pct;
    if (stepIdx === 0) {
      pct = 0;
    } else if (stepIdx === 3) {
      // During element diagnosis: show element-level progress
      const prog = Session.getElementProgress();
      // Map step 3's internal progress to range 25%-50% of overall
      pct = 25 + Math.round((prog.pct / 100) * 25);
    } else {
      pct = Math.round((stepIdx / 8) * 100);
    }

    this.$fill.style.width = pct + '%';
    this.$fill.setAttribute('aria-valuenow', pct);
    this.$fill.classList.add('updating');
    setTimeout(() => this.$fill.classList.remove('updating'), 500);

    // Dots
    this.$dots.querySelectorAll('.step-dot').forEach(dot => {
      const idx = parseInt(dot.dataset.idx);
      dot.classList.remove('active', 'done');
      if (idx === stepIdx) dot.classList.add('active');
      if (idx < stepIdx)  dot.classList.add('done');
      // If step 3 is complete, mark dot 3 as done
      if (idx === 3 && Session.isPlanningUnlocked() && stepIdx > 3) dot.classList.add('done');
    });

    // Step label
    const meta = STEP_META[stepIdx] || STEP_META[STEP_META.length - 1];
    if (stepIdx === 0) {
      this.$label.textContent = '';
    } else if (stepIdx === 3) {
      const prog = Session.getElementProgress();
      this.$label.textContent = `요소 진단 ${prog.done}/${prog.total}`;
    } else {
      this.$label.textContent = meta.label;
    }

    // Step counter
    if (stepIdx === 0 || stepIdx === 8) {
      this.$counter.textContent = '';
    } else if (stepIdx === 3) {
      const prog = Session.getElementProgress();
      this.$counter.textContent = `${prog.done} / ${prog.total}`;
    } else {
      this.$counter.textContent = `${stepIdx} / 7`;
    }
  },

  /* ── NAV STATE ────────────────────────────── */
  updateNav(stepIdx) {
    // Back button
    if (stepIdx === 0) {
      this.$btnBack.classList.add('hidden-back');
    } else {
      this.$btnBack.classList.remove('hidden-back');
    }

    // Next button label & state
    if (stepIdx === 0) {
      this.$btnNext.querySelector('.nav-text').textContent = '시작하기';
      this.$btnNext.querySelector('.nav-icon').textContent = '→';
      this.$btnNext.disabled = false;
    } else if (stepIdx === 3) {
      // In step 3: hide the outer nav "next" button
      // Element navigation is handled internally via btn-elem-next
      this.$btnNext.querySelector('.nav-text').textContent = Session.isPlanningUnlocked() ? '매핑으로' : '🔒 진단 중';
      this.$btnNext.querySelector('.nav-icon').textContent = Session.isPlanningUnlocked() ? '→' : '';
      this.$btnNext.disabled = !Session.isPlanningUnlocked();
    } else if (stepIdx === 7) {
      this.$btnNext.querySelector('.nav-text').textContent = '완성하기';
      this.$btnNext.querySelector('.nav-icon').textContent = '✦';
      this.$btnNext.disabled = false;
    } else if (stepIdx === 8) {
      this.$btnNext.querySelector('.nav-text').textContent = '처음으로';
      this.$btnNext.querySelector('.nav-icon').textContent = '↺';
      this.$btnNext.disabled = false;
    } else {
      this.$btnNext.querySelector('.nav-text').textContent = '계속하기';
      this.$btnNext.querySelector('.nav-icon').textContent = '→';
      this.$btnNext.disabled = false;
    }
  },

  /* ── STEP RENDER ──────────────────────────── */
  renderStep(stepIdx, direction = 'forward') {
    let screen;
    if      (stepIdx === 0) screen = StepRenderers.step0();
    else if (stepIdx === 1) screen = StepRenderers.step1();
    else if (stepIdx === 2) screen = StepRenderers.step2();
    else if (stepIdx === 3) screen = StepRenderers.step3();
    else if (stepIdx === 4) screen = StepRenderers.step4();
    else if (stepIdx === 5) screen = StepRenderers.step5();
    else if (stepIdx === 6) screen = StepRenderers.step6();
    else if (stepIdx === 7) screen = StepRenderers.step7();
    else                    screen = StepRenderers.stepSummary();

    // Animate out
    const existing = this.$stage.querySelector('.step-screen');
    if (existing) {
      existing.classList.add('step-exiting');
      setTimeout(() => {
        if (existing.parentNode === this.$stage) this.$stage.removeChild(existing);
      }, 220);
    }

    // Animate in
    const enterClass = direction === 'back' ? 'step-back-entering' : 'step-entering';
    screen.classList.add(enterClass);

    setTimeout(() => {
      this.$stage.appendChild(screen);
      requestAnimationFrame(() => {
        if (stepIdx !== 3) {
          // Auto-focus first input on non-element steps
          const firstInput = screen.querySelector('input[type=text], textarea');
          if (firstInput && stepIdx > 0 && stepIdx < 8) {
            setTimeout(() => firstInput.focus({ preventScroll: true }), 300);
          }
        }
      });
    }, existing ? 180 : 0);

    this.updateProgress(stepIdx);
    this.updateNav(stepIdx);
  },

  /* ── TOAST ────────────────────────────────── */
  showToast(msg, duration = 2500) {
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this.$toast.textContent = msg;
    this.$toast.classList.add('show');
    this._toastTimer = setTimeout(() => {
      this.$toast.classList.remove('show');
    }, duration);
  },

  /* ── SAVE INDICATOR ───────────────────────── */
  setSaveIndicator(msg) {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    const now = Date.now();
    this.$save.textContent = `${msg} · ${this._fmtTime(now)}`;
    this.$save.classList.add('saved');
    Session.set('updatedAt', now);
    this._saveTimer = setTimeout(() => {
      this.renderLastSaved(Session.get('updatedAt'));
      this.$save.classList.remove('saved');
    }, 1800);
  },
  renderLastSaved(ts) {
    this.$save.textContent = `자동저장 ${this._fmtTime(ts)}`;
  },
  _fmtTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },

  /* ── WELCOME FEATURES STYLE ───────────────── */
  injectWelcomeStyles() {
    if (document.getElementById('wf-style')) return;
    const style = document.createElement('style');
    style.id = 'wf-style';
    style.textContent = `
      .welcome-features {
        display: flex;
        gap: var(--sp-sm);
        flex-wrap: wrap;
        margin: var(--sp-xl) 0;
      }
      .wf-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--c-surface);
        border: 1.5px solid var(--c-border);
        border-radius: var(--r-full);
        padding: 8px 16px;
        font-size: 0.82rem;
        color: var(--c-text-sub);
        animation: fadeInScale var(--dur-slow) var(--ease-spring) both;
      }
      .wf-item:nth-child(1) { animation-delay: 200ms; }
      .wf-item:nth-child(2) { animation-delay: 300ms; }
      .wf-item:nth-child(3) { animation-delay: 400ms; }
      .wf-item:nth-child(4) { animation-delay: 500ms; }
      .wf-icon { font-size: 1rem; }
    `;
    document.head.appendChild(style);
  },
};
