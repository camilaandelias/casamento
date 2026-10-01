"use strict";
const c = casamento;
const el = id => document.getElementById(id);
const text = (id, value) => { if (value) el(id).textContent = value; };
text("nomes", c.nomes);
text("assinatura", c.nomes);
document.title = `${c.nomes} | Nosso casamento`;
text("historia-texto", c.historia);
text("local", c.local);
text("endereco", c.endereco);
function setLink(id, url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    el(id).href = parsed.href;
    el(id).hidden = false;
    return true;
  } catch { return false; }
}
setLink("mapa", c.mapaUrl);
if (setLink("presentes-link", c.presentesUrl)) el("presentes-aviso").hidden = true;
if (setLink("presenca-link", c.presencaUrl)) text("presenca-texto", "Queremos celebrar esse momento com você. Confirme sua presença no formulário abaixo.");
const date = c.data ? new Date(`${c.data}T${c.horario || "12:00"}:00-03:00`) : null;
if (date && !Number.isNaN(date.getTime())) {
  const options = {timeZone: "America/Sao_Paulo"};
  text("data-capa", date.toLocaleDateString("pt-BR", {...options, day:"2-digit", month:"long", year:"numeric"}));
  text("data-detalhe", c.horario
    ? date.toLocaleString("pt-BR", {...options, dateStyle:"long", timeStyle:"short"})
    : `${date.toLocaleDateString("pt-BR", {...options, dateStyle:"long"})} · Horário em breve`);
  function tick() {
    const distance = date.getTime() - Date.now();
    el("contagem").hidden = distance <= 0;
    if (distance <= 0) return;
    const total = Math.floor(distance / 1000);
    const values = [Math.floor(total/86400), Math.floor(total/3600)%24, Math.floor(total/60)%60, total%60];
    el("contagem").replaceChildren(...values.map((n, i) => {
      const item = document.createElement("div"), number = document.createElement("strong"), label = document.createElement("span");
      number.textContent = String(n).padStart(2,"0"); label.textContent = ["DIAS","HORAS","MINUTOS","SEGUNDOS"][i]; item.append(number,label); return item;
    }));
  }
  if (c.horario) { tick(); setInterval(tick,1000); }
}
const toggle = document.querySelector(".menu-toggle"), menu = el("menu");
function closeMenu(){menu.classList.remove("open");toggle.setAttribute("aria-expanded","false");}
toggle.addEventListener("click", () => {const open = menu.classList.toggle("open");toggle.setAttribute("aria-expanded", String(open));});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", e => {if(e.key === "Escape") closeMenu();});
const dialog = el("lightbox");
if (Array.isArray(c.fotos) && c.fotos.length) {
  el("fotos").replaceChildren();
  c.fotos.forEach((photo, i) => {
    const button = document.createElement("button"), img = document.createElement("img");
    button.className = "photo"; button.setAttribute("aria-label", `Ampliar foto: ${photo.alt || i+1}`);
    img.src = photo.src; img.alt = photo.alt || `Foto do casal ${i+1}`; img.loading = "lazy";
    button.append(img); el("fotos").append(button);
    button.addEventListener("click", () => {const large = dialog.querySelector("img");large.src=photo.src;large.alt=img.alt;dialog.showModal();});
  });
}
dialog.querySelector("button").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => {if(e.target === dialog) dialog.close();});


// Mostra o atalho assim que o cabeçalho sai inteiramente pelo topo da tela.
(() => {
  const header = document.querySelector('.header');
  const button = document.getElementById('voltar-topo');
  if (!header || !button) return;
  function updateBackToTop() {
    button.hidden = header.getBoundingClientRect().bottom > 0;
  }
  updateBackToTop();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(updateBackToTop, {threshold: 0});
    observer.observe(header);
  } else {
    window.addEventListener('scroll', updateBackToTop, {passive: true});
    window.addEventListener('resize', updateBackToTop);
  }
  window.addEventListener('pageshow', updateBackToTop);
  document.querySelectorAll('[data-scroll-top]').forEach(control => {
    control.addEventListener('click', event => {
      event.preventDefault();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top: 0, behavior: reducedMotion ? 'auto' : 'smooth'});
      const brand = header.querySelector('.brand');
      if (brand) brand.focus({preventScroll: true});
    });
  });
})();
