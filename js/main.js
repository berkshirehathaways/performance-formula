/* ═══════════════════════════════════════════════
   COMPASS — main.js
   App bootstrap · Event wiring · Lifecycle
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── BOOT ────────────────────────────────── */
  Session.init();
  UI.init();
  UI.injectWelcomeStyles();

  // Render current step (handles page refresh mid-journey)
  UI.renderStep(Session.get('currentStep'), 'forward');

  /* ── NAVIGATION ──────────────────────────── */
  document.getElementById('btn-next').addEventListener('click', handleNext);
  document.getElementById('btn-back').addEventListener('click', handleBack);

  // Keyboard: Enter advances on text inputs (not textareas)
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      handleNext();
    }
  });

  function handleNext() {
    const cur = Session.get('currentStep');

    // Summary screen → restart
    if (cur === 8) {
      showRestartModal();
      return;
    }

    const moved = Nav.next();
    if (moved !== false) {
      const next = Session.get('currentStep');
      UI.renderStep(next, Nav.direction());

      // Micro-feedback on specific transitions
      if (next === 4) UI.showToast('성과 요소 매핑 완료 ✦');
      if (next === 5) UI.showToast('레버리지 분석 중…');
      if (next === 6) UI.showToast('시스템이 형태를 갖추고 있어요 ✦');
      if (next === 7) UI.showToast('100일 계획이 생성됐어요 🗺');
      if (next === 8) UI.showToast('시스템 완성 ✦ 수고하셨어요!', 3500);
    }
  }

  function handleBack() {
    Nav.back();
    const cur = Session.get('currentStep');
    UI.renderStep(cur, Nav.direction());
  }

  /* ── RESTART MODAL ───────────────────────── */
  const $overlay      = document.getElementById('modal-overlay');
  const $modalCancel  = document.getElementById('modal-cancel');
  const $modalConfirm = document.getElementById('modal-confirm');
  const $btnRestart   = document.getElementById('btn-restart');

  function showRestartModal() {
    $overlay.classList.remove('hidden');
    $modalCancel.focus();
  }

  function hideRestartModal() {
    $overlay.classList.add('hidden');
  }

  $btnRestart.addEventListener('click', showRestartModal);
  $modalCancel.addEventListener('click', hideRestartModal);

  $modalConfirm.addEventListener('click', () => {
    Session.reset();
    Session.init();
    hideRestartModal();
    Nav.goTo(0);
    UI.renderStep(0, 'forward');
    UI.showToast('새로운 여정이 시작됩니다 ✦');
  });

  // Close modal on overlay click
  $overlay.addEventListener('click', e => {
    if (e.target === $overlay) hideRestartModal();
  });

  // Close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$overlay.classList.contains('hidden')) {
      hideRestartModal();
    }
  });

  /* ── VISIBILITY CHANGE (auto-save on tab switch) ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      Storage.save(Session.all());
    }
  });

  /* ── UNLOAD SAVE ─────────────────────────── */
  window.addEventListener('beforeunload', () => {
    Storage.save(Session.all());
  });

  /* ── PROGRESS RESUME TOAST ───────────────── */
  const step = Session.get('currentStep');
  if (step > 0 && step < 8) {
    setTimeout(() => {
      UI.showToast(`이어서 진행합니다 — ${STEP_META[step]?.label || ''} ✦`, 2200);
    }, 800);
  }

});
