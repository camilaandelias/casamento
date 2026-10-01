"use strict";
(() => {
  const welcome = document.getElementById('boas-vindas');
  const enter = document.getElementById('entrar-site');
  const audio = document.getElementById('musica-casamento');
  const control = document.getElementById('controle-musica');
  if (!welcome || !enter || !audio || !control) return;
  const label = control.querySelector('span');
  audio.volume = 0.10;
  let entered = false;
  function updateControl() {
    const text = audio.paused ? 'Ouvir música' : 'Pausar música';
    label.textContent = text;
    control.setAttribute('aria-label', text);
    control.title = text;
  }
  function playMusic() {
    // Chamada síncrona no clique: preserva a autorização do gesto no celular.
    try {
      const playing = audio.play();
      if (playing && typeof playing.catch === 'function') {
        playing.catch(() => { updateControl(); });
      }
    } catch (_) { updateControl(); }
  }
  function enterSite() {
    if (entered) return;
    entered = true;
    playMusic();
    welcome.close();
    document.documentElement.classList.remove('welcome-open');
    control.hidden = false;
    const brand = document.querySelector('.header .brand');
    if (brand) brand.focus({preventScroll: true});
  }
  enter.addEventListener('click', enterSite);
  welcome.addEventListener('cancel', event => event.preventDefault());
  control.addEventListener('click', () => {
    if (audio.paused) playMusic();
    else audio.pause();
  });
  audio.addEventListener('play', updateControl);
  audio.addEventListener('pause', updateControl);
  audio.addEventListener('error', () => {
    label.textContent = 'Áudio indisponível';
    control.setAttribute('aria-label', 'Áudio indisponível. Tentar novamente');
  });
  updateControl();
  if (typeof welcome.showModal === 'function') {
    welcome.showModal();
    document.getElementById('welcome-title').focus({preventScroll: true});
    document.documentElement.classList.add('welcome-open');
  } else {
    // Navegadores antigos continuam permitindo acessar o site e tocar manualmente.
    control.hidden = false;
  }
})();
