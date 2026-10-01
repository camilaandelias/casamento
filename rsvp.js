// Cole aqui o endereço /exec recebido ao implantar o Google Apps Script.
const RSVP_URL = 'https://script.google.com/macros/s/AKfycbycw5Cp8nDTv6lH6e8wCa3TrGFM8jlK3-rdFOWX8Pxr22UWXeNXmng5WFk-7oEFZNZGZw/exec';
(() => {
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(RSVP_URL)) return;
  const section = document.getElementById('presenca');
  if (!section) return;
  const texto = document.getElementById('presenca-texto');
  if (texto) texto.textContent = 'Preencha abaixo para nos contar se estará com a gente.';
  const botao = document.getElementById('presenca-link');
  if (botao) botao.hidden = true;
  const frame = document.createElement('iframe');
  frame.src = RSVP_URL; frame.title = 'Formulário de confirmação de presença';
  frame.style.cssText = 'display:block;width:100%;max-width:700px;height:900px;border:0;margin:24px auto 0;background:#eeeadf;';
  frame.loading = 'lazy';
  section.append(frame);
  const link = document.createElement('a');link.href = RSVP_URL;link.target = '_blank';link.rel = 'noopener noreferrer';
  link.className = 'text-link';link.textContent = 'Abrir formulário em outra aba';
  section.append(link);
})();
