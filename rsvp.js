// Formulário exibido diretamente no site; envio sem cookies da conta Google.
(() => {
'use strict';
const RSVP_URL = "https://script.google.com/macros/s/AKfycbycw5Cp8nDTv6lH6e8wCa3TrGFM8jlK3-rdFOWX8Pxr22UWXeNXmng5WFk-7oEFZNZGZw/exec";
const section = document.getElementById('presenca');
if (!section || section.querySelector('#rsvp-direto')) return;
const texto=document.getElementById('presenca-texto');
if(texto) texto.textContent='Preencha abaixo para nos contar se estará com a gente.';
const antigo=document.getElementById('presenca-link');if(antigo) antigo.hidden=true;
const host=document.createElement('div');host.id='rsvp-direto';
host.style.cssText='display:block;width:100%;max-width:700px;margin:24px auto 0;';
section.append(host);
const root=host.attachShadow({mode:'open'});
root.innerHTML="<style>\n:root{--ink:#393b32;--muted:#6e6e60;--line:#c8cbbd;--accent:#555e4c}*{box-sizing:border-box}:host{margin:0;background:#eeeadf;color:var(--ink);font:16px/1.6 Arial,sans-serif}main{max-width:640px;margin:auto;padding:24px 18px 32px}form{display:grid;gap:22px;text-align:left}label,legend{font-size:14px;font-weight:600}label{display:block}input,select,textarea{display:block;width:100%;border:1px solid var(--line);border-radius:3px;background:#faf7f1;color:var(--ink);font:16px Arial,sans-serif;padding:13px;margin-top:8px}textarea{resize:vertical;min-height:110px}fieldset{margin:0;padding:0;border:0}.options{display:flex;gap:12px;margin-top:10px}.choice{display:flex;align-items:center;gap:10px;flex:1;padding:12px;border:1px solid var(--line);background:#faf7f1;font-weight:400}.choice input{width:18px;height:18px;margin:0;accent-color:var(--accent)}small{display:block;color:var(--muted);font-size:13px;margin-top:6px}.children{display:grid;gap:14px}button{border:0;border-radius:3px;background:var(--accent);color:white;font:15px Arial,sans-serif;padding:17px 24px;cursor:pointer}button:disabled{opacity:.6;cursor:wait}input:focus-visible,select:focus-visible,textarea:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:3px}[hidden]{display:none!important}.trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}.status{margin:0;white-space:pre-line}.status.error{color:#9a2929}.success{text-align:center;padding:25px 0}.success h2{font:32px Georgia,serif}.privacy{font-size:12px;color:var(--muted);margin:0}\n</style><main aria-label=\"Confirmação de presença\">\n<form id=\"rsvp\">\n<label>Código do convite<input id=\"codigo\" autocomplete=\"off\" autocapitalize=\"characters\" spellcheck=\"false\" maxlength=\"40\" required aria-describedby=\"codigo-ajuda\"></label>\n<small id=\"codigo-ajuda\">Informe o código recebido com seu convite. Cada pessoa deve enviar sua própria resposta.</small>\n<label>Nome como está no convite<input id=\"nome\" autocomplete=\"name\" maxlength=\"150\" minlength=\"3\" required></label>\n<fieldset><legend>Você vai comparecer?</legend><div class=\"options\"><label class=\"choice\"><input type=\"radio\" name=\"comparece\" value=\"Sim\" required>Sim</label><label class=\"choice\"><input type=\"radio\" name=\"comparece\" value=\"Nao\" required>Não</label></div></fieldset>\n<div id=\"acompanhantes\" hidden>\n<label>Quantidade de filhos menores de 7 anos<input id=\"quantidade\" type=\"number\" min=\"0\" max=\"20\" step=\"1\" value=\"0\" inputmode=\"numeric\" aria-describedby=\"regra\"></label>\n<small id=\"regra\">Os acompanhantes permitidos são apenas seus filhos que terão menos de 7 anos no dia do casamento.</small>\n<div id=\"filhos\" class=\"children\"></div>\n</div>\n<label>Mensagem aos noivos <span style=\"font-weight:400\">(opcional)</span><textarea id=\"mensagem\" maxlength=\"2000\" placeholder=\"Deixe seu carinho aqui…\"></textarea></label>\n<div class=\"trap\" aria-hidden=\"true\"><label>Website<input id=\"website\" tabindex=\"-1\" autocomplete=\"off\"></label></div>\n<p class=\"privacy\">As informações serão utilizadas pelos noivos para organizar o casamento.</p>\n<button type=\"submit\" id=\"enviar\">Enviar resposta</button>\n<p id=\"status\" class=\"status\" role=\"status\" aria-live=\"polite\"></p>\n</form>\n<section id=\"sucesso\" class=\"success\" hidden tabindex=\"-1\"><h2>Resposta recebida!</h2><p id=\"agradecimento\"></p><small id=\"protocolo\"></small></section>\n</main>";

const form=root.getElementById('rsvp'), quantidade=root.getElementById('quantidade'), filhos=root.getElementById('filhos');
const id=typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
function camposFilhos(){
 const anteriores=Array.from(filhos.querySelectorAll('input')).map(i=>i.value);
 filhos.replaceChildren();
 const n=Number(quantidade.value);
 if(!Number.isInteger(n)||n<0||n>20)return;
 for(let i=0;i<n;i++){
  const label=document.createElement('label');label.textContent='Nome do filho '+(i+1);
  const input=document.createElement('input');input.required=true;input.minLength=2;input.maxLength=150;input.value=anteriores[i]||'';
  label.append(input);filhos.append(label);
 }
}
quantidade.addEventListener('input',camposFilhos);
form.addEventListener('change',()=>{
 const sim=form.querySelector('input[name="comparece"]:checked')?.value==='Sim';
 root.getElementById('acompanhantes').hidden=!sim;quantidade.required=sim;quantidade.disabled=!sim;
 if(!sim){quantidade.value='0';filhos.replaceChildren();}
});
form.addEventListener('submit',e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const status=root.getElementById('status'),button=root.getElementById('enviar');
 const dados={id,codigo:root.getElementById('codigo').value.trim(),nome:root.getElementById('nome').value.trim(),comparece:form.querySelector('input[name="comparece"]:checked').value,
 quantidade:Number(quantidade.value),filhos:Array.from(filhos.querySelectorAll('input')).map(i=>i.value.trim()),mensagem:root.getElementById('mensagem').value.trim(),website:root.getElementById('website').value};
 button.disabled=true;button.textContent='Enviando…';status.className='status';status.textContent='';
 function falha(err){button.disabled=false;button.textContent='Tentar novamente';status.className='status error';status.textContent=err.message||'Não foi possível enviar. Confira sua conexão e tente novamente.';}
 const controller = new AbortController();
 const timer = setTimeout(() => controller.abort(), 45000);
 fetch(RSVP_URL, {
   method: 'POST', mode: 'cors', credentials: 'omit', redirect: 'follow',
   headers: {'Content-Type':'text/plain;charset=UTF-8'},
   body: JSON.stringify(dados), signal: controller.signal
 }).then(async response => {
   if (!response.ok) throw new Error('Não foi possível confirmar o recebimento. Tente novamente.');
   let r;
   try { r = await response.json(); }
   catch (_) { throw new Error('Não foi possível confirmar o recebimento. Tente novamente em instantes.'); }
   if (!r || r.ok !== true || r.protocolo !== dados.id) {
     throw new Error(r && r.error || 'Não foi possível confirmar o recebimento. Tente novamente.');
   }
   form.hidden=true;const sucesso=root.getElementById('sucesso');sucesso.hidden=false;
   root.getElementById('agradecimento').textContent=dados.comparece==='Sim'?'Sua presença está confirmada. Esperamos você para celebrar com a gente!':'Obrigado por nos avisar e por fazer parte da nossa história.';
   root.getElementById('protocolo').textContent='Protocolo: '+r.protocolo;sucesso.focus();
 }).catch(err => {
   falha({message: err.name==='AbortError' || err instanceof TypeError
     ? 'Não conseguimos confirmar o recebimento. Seus dados continuam aqui. Toque em Tentar novamente; o mesmo envio não será duplicado.'
     : err.message});
 }).finally(() => clearTimeout(timer));
});

})();
