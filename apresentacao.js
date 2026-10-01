"use strict";
(() => {
  if (new URLSearchParams(window.location.search).get('apresentacao') !== '1') return;

  const VELOCIDADE = 45; // Pixels por segundo. Diminua para rolar mais devagar.
  const ESPERA = 3000;
  const root = document.documentElement;
  const welcome = document.getElementById('boas-vindas');
  const enter = document.getElementById('entrar-site');
  let started = false, stopped = false, timer, frame, previousTime;
  let position = 0;
  let oldBehavior, oldPriority;

  // Carrega as fotos antes de elas aparecerem na gravação.
  document.querySelectorAll('#fotos img').forEach(img => { img.loading = 'eager'; });

  function stop() {
    if (!started || stopped) return;
    stopped = true;
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    if (oldBehavior !== undefined) {
      if (oldBehavior) root.style.setProperty('scroll-behavior', oldBehavior, oldPriority);
      else root.style.removeProperty('scroll-behavior');
    }
  }

  function step(time) {
    if (stopped) return;
    const seconds = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, .05);
    previousTime = time;
    const end = Math.max(0, root.scrollHeight - window.innerHeight);
    position = Math.min(position + VELOCIDADE * seconds, end);
    window.scrollTo({top: position, left: 0, behavior: 'instant'});
    if (position >= end) { stop(); return; }
    frame = requestAnimationFrame(step);
  }

  function start() {
    if (started || (welcome && welcome.open)) return;
    started = true;
    timer = setTimeout(() => {
      if (stopped) return;
      position = window.scrollY;
      oldBehavior = root.style.getPropertyValue('scroll-behavior');
      oldPriority = root.style.getPropertyPriority('scroll-behavior');
      root.style.setProperty('scroll-behavior', 'auto', 'important');
      frame = requestAnimationFrame(step);
    }, ESPERA);
  }

  ['pointerdown', 'touchstart', 'wheel'].forEach(type => {
    document.addEventListener(type, stop, {passive: true});
  });
  document.addEventListener('keydown', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  if (enter) enter.addEventListener('click', () => queueMicrotask(start));
  if (welcome) welcome.addEventListener('close', start);
  // Fallback se não houver tela de boas-vindas.
  if (!welcome || !welcome.open) start();
})();
