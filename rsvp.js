// Formulário exibido diretamente no site; envio sem cookies da conta Google.
(() => {
'use strict';
const RSVP_URL = "https://script.google.com/macros/s/AKfycbycw5Cp8nDTv6lH6e8wCa3TrGFM8jlK3-rdFOWX8Pxr22UWXeNXmng5WFk-7oEFZNZGZw/exec";
const section = document.getElementById('presenca');
if (!section || section.querySelector('#rsvp-direto')) return;
const texto=document.getElementById('presenca-texto'); 
if(texto) texto.textContent='Informe seu código para encontrar os nomes do seu convite.';
const antigo=document.getElementById('presenca-link');if(antigo) antigo.hidden=true;
const host=document.createElement('div');host.id='rsvp-direto';
host.style.cssText='display:block;width:100%;max-width:700px;margin:24px auto 0;';
section.append(host);
const root=host.attachShadow({mode:'open'});
root.innerHTML="<style>\n:root{--ink:#393b32;--muted:#6e6e60;--line:#c8cbbd;--accent:#555e4c}*{box-sizing:border-box}:host{margin:0;background:#eeeadf;color:var(--ink);font:16px/1.6 Arial,sans-serif}main{max-width:640px;margin:auto;padding:24px 18px 32px}form{display:grid;gap:22px;text-align:left}label,legend{font-size:14px;font-weight:600}label{display:block}input,select,textarea{display:block;width:100%;border:1px solid var(--line);border-radius:3px;background:#faf7f1;color:var(--ink);font:16px Arial,sans-serif;padding:13px;margin-top:8px}textarea{resize:vertical;min-height:110px}fieldset{margin:0;padding:0;border:0}.options{display:flex;gap:12px;margin-top:10px}.choice{display:flex;align-items:center;gap:10px;flex:1;padding:12px;border:1px solid var(--line);background:#faf7f1;font-weight:400}.choice input{width:18px;height:18px;margin:0;accent-color:var(--accent)}small{display:block;color:var(--muted);font-size:13px;margin-top:6px}.children{display:grid;gap:14px}button{border:0;border-radius:3px;background:var(--accent);color:white;font:15px Arial,sans-serif;padding:17px 24px;cursor:pointer}button:disabled{opacity:.6;cursor:wait}input:focus-visible,select:focus-visible,textarea:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:3px}[hidden]{display:none!important}.trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}.status{margin:0;white-space:pre-line}.status.error{color:#9a2929}.success{text-align:center;padding:25px 0}.success h2{font:32px Georgia,serif}.privacy{font-size:12px;color:var(--muted);margin:0}\n .lookup{display:grid;gap:12px}.lookup button{justify-self:start}select{min-height:48px}#detalhes{display:grid;gap:22px}.name-note{margin:0}button:disabled{cursor:wait}</style><main aria-label=\"Confirmação de presença\">\n<form id=\"rsvp\">\n<div class=\"lookup\">\n<label>Código do convite<input id=\"codigo\" autocomplete=\"off\" autocapitalize=\"characters\" spellcheck=\"false\" maxlength=\"40\" required aria-describedby=\"codigo-ajuda\"></label>\n<small id=\"codigo-ajuda\">Digite o código recebido com seu convite para encontrar seu nome.</small>\n<button type=\"button\" id=\"buscar\">Buscar convite</button>\n<p id=\"busca-status\" class=\"status\" role=\"status\" aria-live=\"polite\"></p>\n</div>\n<div class=\"trap\" aria-hidden=\"true\"><label>Website<input id=\"website\" tabindex=\"-1\" autocomplete=\"off\"></label></div>\n<div id=\"detalhes\" hidden>\n<label>Quem está confirmando?<select id=\"nome\" required disabled></select></label>\n<small id=\"nome-ajuda\" class=\"name-note\">Selecione seu nome. Cada pessoa deve enviar sua própria resposta.</small>\n<fieldset><legend>Você vai comparecer?</legend><div class=\"options\"><label class=\"choice\"><input type=\"radio\" name=\"comparece\" value=\"Sim\" required>Sim</label><label class=\"choice\"><input type=\"radio\" name=\"comparece\" value=\"Nao\" required>Não</label></div></fieldset>\n<div id=\"acompanhantes\" hidden><label>Quantidade de filhos menores de 7 anos<input id=\"quantidade\" type=\"number\" min=\"0\" max=\"20\" step=\"1\" value=\"0\" inputmode=\"numeric\" disabled aria-describedby=\"regra\"></label><small id=\"regra\">Os acompanhantes permitidos são apenas seus filhos que terão menos de 7 anos no dia do casamento. Se ambos os pais forem convidados, apenas um deve incluir os filhos.</small><div id=\"filhos\" class=\"children\"></div></div>\n<label>Mensagem aos noivos <span style=\"font-weight:400\">(opcional)</span><textarea id=\"mensagem\" maxlength=\"2000\" placeholder=\"Deixe seu carinho aqui…\"></textarea></label>\n<p class=\"privacy\">As informações serão utilizadas pelos noivos para organizar o casamento.</p>\n<button type=\"submit\" id=\"enviar\">Enviar resposta</button>\n<p id=\"status\" class=\"status\" role=\"status\" aria-live=\"polite\"></p>\n</div>\n</form>\n<section id=\"sucesso\" class=\"success\" hidden tabindex=\"-1\"><h2>Resposta recebida!</h2><p id=\"agradecimento\"></p><small id=\"protocolo\"></small></section>\n</main>";
const el = id => root.getElementById(id);
const form=el('rsvp'), codigo=el('codigo'), nome=el('nome'), detalhes=el('detalhes');
const buscar=el('buscar'), buscaStatus=el('busca-status'), quantidade=el('quantidade'), filhos=el('filhos');
const novoId=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
const chave=s=>String(s).trim().toUpperCase().replace(/[\s-]/g,'');
let codigoVerificado='', versaoBusca=0, controleBusca=null, enviando=false, protocolo=novoId();
function aviso(target,texto,erro=false){target.textContent=texto;target.className=erro?'status error':'status';}
async function requisitar(dados,controller){
 const timer=setTimeout(()=>controller.abort(),45000);
 try {
  const response=await fetch(RSVP_URL,{method:'POST',mode:'cors',credentials:'omit',redirect:'follow',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(dados),signal:controller.signal});
  if(!response.ok)throw new Error('Não foi possível comunicar com o formulário. Tente novamente.');
  let r;try{r=await response.json();}catch(_){throw new Error('Não foi possível ler a resposta do formulário. Tente novamente em instantes.');}
  if(!r || r.ok!==true)throw new Error(r&&r.error||'Não foi possível concluir. Tente novamente.');
  return r;
 }finally{clearTimeout(timer);}
}
function limparEscolha(){
 codigoVerificado='';nome.replaceChildren();nome.disabled=true;detalhes.hidden=true;
 form.querySelectorAll('input[name="comparece"]').forEach(i=>i.checked=false);
 quantidade.value='0';quantidade.disabled=true;quantidade.required=false;
 filhos.replaceChildren();el('acompanhantes').hidden=true;el('mensagem').value='';aviso(el('status'),'');
}
codigo.addEventListener('input',()=>{
 versaoBusca++;controleBusca?.abort();controleBusca=null;limparEscolha();
 buscar.disabled=false;buscar.textContent='Buscar convite';aviso(buscaStatus,'');
});
async function buscarConvite(){
 if(enviando)return;
 if(!codigo.value.trim()){aviso(buscaStatus,'Informe o código recebido com seu convite.',true);codigo.focus();return;}
 if(!codigo.reportValidity())return;
 const versao=++versaoBusca;controleBusca?.abort();controleBusca=new AbortController();
 const controller=controleBusca,codigoConsultado=codigo.value.trim();limparEscolha();
 buscar.disabled=true;buscar.textContent='Buscando…';aviso(buscaStatus,'');
 try{
  const r=await requisitar({acao:'consultarConvite',codigo:codigoConsultado,website:el('website').value},controller);
  if(versao!==versaoBusca)return;
  if(!Array.isArray(r.nomes)||!r.nomes.length||r.nomes.some(n=>typeof n!=='string'||!n.trim()))throw new Error('Não foi possível carregar os nomes. Tente buscar novamente.');
  if(r.nomes.length>1){const op=document.createElement('option');op.value='';op.textContent='Selecione seu nome';nome.append(op);}
  r.nomes.forEach(n=>{const op=document.createElement('option');op.value=n;op.textContent=n;nome.append(op);});
  codigoVerificado=chave(codigoConsultado);nome.disabled=false;detalhes.hidden=false;
  el('nome-ajuda').textContent=r.nomes.length===1?'Seu nome foi selecionado automaticamente.':'Selecione seu nome. Cada pessoa deve enviar sua própria resposta.';
  aviso(buscaStatus,'Convite encontrado.');nome.focus();
 }catch(err){
  if(versao!==versaoBusca)return;
  aviso(buscaStatus,err.name==='AbortError'||err instanceof TypeError?'Não foi possível buscar o convite. Confira sua conexão e tente novamente.':err.message,true);
 }finally{
  if(versao===versaoBusca){buscar.disabled=false;buscar.textContent='Buscar convite';controleBusca=null;}
 }
}
buscar.addEventListener('click',buscarConvite);
codigo.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();buscarConvite();}});
function camposFilhos(){
 const anteriores=Array.from(filhos.querySelectorAll('input')).map(i=>i.value);filhos.replaceChildren();
 const n=Number(quantidade.value);if(!Number.isInteger(n)||n<0||n>20)return;
 for(let i=0;i<n;i++){const label=document.createElement('label');label.textContent='Nome do filho '+(i+1);const input=document.createElement('input');input.required=true;input.minLength=2;input.maxLength=150;input.value=anteriores[i]||'';label.append(input);filhos.append(label);}
}
quantidade.addEventListener('input',camposFilhos);
form.addEventListener('input',()=>{if(!enviando)protocolo=novoId();});
form.addEventListener('change',()=>{
 if(!enviando)protocolo=novoId();
 const sim=form.querySelector('input[name="comparece"]:checked')?.value==='Sim';
 el('acompanhantes').hidden=!sim;quantidade.required=sim;quantidade.disabled=!sim;
 if(!sim){quantidade.value='0';filhos.replaceChildren();}
});
form.addEventListener('submit',async e=>{
 e.preventDefault();if(enviando)return;
 if(!codigoVerificado||codigoVerificado!==chave(codigo.value)){aviso(buscaStatus,'Busque seu convite antes de confirmar.',true);codigo.focus();return;}
 if(!form.reportValidity())return;
 const dados={id:protocolo,codigo:codigo.value.trim(),nome:nome.value,comparece:form.querySelector('input[name="comparece"]:checked').value,quantidade:Number(quantidade.value),filhos:Array.from(filhos.querySelectorAll('input')).map(i=>i.value.trim()),mensagem:el('mensagem').value.trim(),website:el('website').value};
 const controles=Array.from(form.querySelectorAll('input,select,textarea,button')).map(c=>[c,c.disabled]);
 enviando=true;controles.forEach(([c])=>c.disabled=true);el('enviar').textContent='Enviando…';aviso(el('status'),'');
 try{
  const r=await requisitar(dados,new AbortController());
  if(r.protocolo!==dados.id)throw new Error('Não foi possível confirmar o recebimento. Tente novamente.');
  form.hidden=true;el('sucesso').hidden=false;
  el('agradecimento').textContent=dados.comparece==='Sim'?'Sua presença está confirmada. Esperamos você para celebrar com a gente!':'Obrigado por nos avisar e por fazer parte da nossa história.';
  el('protocolo').textContent='Protocolo: '+r.protocolo;el('sucesso').focus();
 }catch(err){
  aviso(el('status'),err.name==='AbortError'||err instanceof TypeError?'Não conseguimos confirmar o recebimento. Seus dados continuam aqui. Toque em Tentar novamente; o mesmo envio não será duplicado.':err.message,true);
  el('enviar').textContent='Tentar novamente';
 }finally{enviando=false;controles.forEach(([c,disabled])=>c.disabled=disabled);}
});
})();
