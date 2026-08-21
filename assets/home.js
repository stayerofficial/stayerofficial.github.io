/* STAYER — home page interactions.
   Scroll-driven word carousel + the APPS overlay. No dependencies, no tracking. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- words */
  var words  = Array.prototype.slice.call(document.querySelectorAll('.nav-word'));
  var runway = document.querySelector('.scroll-area');
  var step   = 0;

  /* Build the scroll runway from the number of words: one step per gap between
     words, then one viewport of rest. That makes the last word the last thing
     you can scroll to — no empty overscroll past it. Rebuilt on resize. */
  function buildRunway() {
    step = Math.round(window.innerHeight * 1.5);
    if (!runway) return;
    runway.textContent = '';
    for (var i = 0; i < words.length - 1; i++) {
      var section = document.createElement('div');
      section.className = 'scroll-section';
      section.style.height = step + 'px';
      runway.appendChild(section);
    }
    var tail = document.createElement('div');
    tail.className = 'scroll-tail';
    tail.style.height = window.innerHeight + 'px';
    runway.appendChild(tail);
  }

  function paintWords() {
    var scrollY = window.scrollY;
    for (var i = 0; i < words.length; i++) {
      var word    = words[i];
      var ratio   = (scrollY - i * step) / window.innerHeight;
      var opacity = Math.max(0, Math.min(1, 1 - Math.abs(ratio)));
      var visible = opacity > 0.6;

      word.style.opacity   = opacity;
      word.style.transform = 'translate(-50%, ' + (ratio * -50) + 'px)';
      word.style.pointerEvents = visible ? 'auto' : 'none';
      // Keep the tab order in sync with what is actually on screen.
      if (visible) { word.removeAttribute('tabindex');  word.removeAttribute('aria-hidden'); }
      else         { word.setAttribute('tabindex', '-1'); word.setAttribute('aria-hidden', 'true'); }
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { paintWords(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    buildRunway();
    paintWords();
  }, { passive: true });

  buildRunway();
  paintWords();

  /* A word scrolled off screen must still be reachable by keyboard. */
  words.forEach(function (word, index) {
    word.addEventListener('focus', function () {
      var target = index * step;
      if (Math.abs(window.scrollY - target) > 40) {
        window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  var stayer = document.getElementById('stayer-link');
  if (stayer) {
    stayer.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: step, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* -------------------------------------------------------------- overlay */
  var overlay  = document.getElementById('apps-screen');
  var trigger  = document.getElementById('apps-trigger');
  var closeBtn = document.getElementById('close-apps');
  var page     = document.getElementById('page');

  if (!overlay || !trigger || !closeBtn) return;

  var lastFocus = null;
  var scrollLock = 0;

  function openApps(e) {
    if (e) e.preventDefault();
    lastFocus  = document.activeElement;
    scrollLock = window.scrollY;

    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
    document.body.classList.add('nav-away');
    document.body.style.overflow = 'hidden';
    if (page) page.setAttribute('inert', '');
    trigger.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function closeApps() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-away');
    document.body.style.overflow = '';
    if (page) page.removeAttribute('inert');
    trigger.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: scrollLock, behavior: 'auto' });
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  trigger.addEventListener('click', openApps);
  closeBtn.addEventListener('click', closeApps);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeApps();
  });

  /* Buttons rendered as links but not yet pointing anywhere. */
  document.querySelectorAll('.app-link[aria-disabled="true"]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
