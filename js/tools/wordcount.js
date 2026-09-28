/* 1) Contador de Palavras — para a Sending e qualquer outro texto curto que
   precise ficar dentro de um limite. Sem limite fixo (cada mesa/sistema tem o
   seu); só conta. O texto fica guardado no navegador entre visitas, como
   qualquer rascunho rápido. */
TOOLS.push({
  id: 'wordcount',
  title: 'Contador de Palavras',
  icon: '<svg viewBox="0 0 24 24"><path d="M6 4h9l3 3v13H6z"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
    const KEY = 'escudo:wordcount';
    let saved = '';
    try{ saved = localStorage.getItem(KEY) || ''; }catch(_){}

    el.innerHTML = `
      <textarea class="wc__area" placeholder="Escreva a mensagem aqui…"></textarea>
      <div class="wc__stats">
        <span><b class="wc__words">0</b>palavras</span>
        <span><b class="wc__chars">0</b>caracteres</span>
        <button class="btn btn--sm" style="margin-left:auto" data-act="limpar">Limpar</button>
      </div>`;
    const ta = el.querySelector('.wc__area');
    const words = el.querySelector('.wc__words');
    const chars = el.querySelector('.wc__chars');
    ta.value = saved;

    let timer = null;
    function update(){
      const text = ta.value;
      const w = text.trim() ? text.trim().split(/\s+/).length : 0;
      words.textContent = w;
      chars.textContent = text.length;
      clearTimeout(timer);
      timer = setTimeout(() => { try{ localStorage.setItem(KEY, text); }catch(_){} }, 400);
    }
    ta.addEventListener('input', update);
    el.querySelector('[data-act="limpar"]').addEventListener('click', () => {
      ta.value = '';
      try{ localStorage.removeItem(KEY); }catch(_){}
      update();
      ta.focus();
    });
    update();
  }
});
