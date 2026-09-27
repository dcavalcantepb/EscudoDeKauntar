/* 2) Bloco de Notas Rápidas — abas como no OneNote. Cada aba é uma nota na
   tabela escudo_notas (privada, só o autor lê). Um único campo de texto e uma
   única barra de ferramentas servem todas as abas: trocar de aba troca o
   conteúdo carregado nesse campo (o mesmo truque de "uma página por vez").
   Salva sozinho, sem botão de salvar; o rodapé mostra o estado. */
TOOLS.push({
  id: 'notes',
  title: 'Bloco de Notas',
  icon: '<svg viewBox="0 0 24 24"><path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M17 4a3 3 0 0 1 3 3v13"/><path d="M7 9h6M7 12h6"/></svg>',
  defaultW: 2, defaultH: 2,
  mount(el){
    el.innerHTML = `
      <div class="notes">
        <div class="notes__tabs"><p class="gen__empty">Carregando…</p></div>
        <input class="notes__title" type="text" maxlength="80" placeholder="Título da nota">
        <div class="notes__toolbar"></div>
        <textarea class="notes__ta" placeholder="Escreva aqui…"></textarea>
        <div class="notes__preview post__body" hidden></div>
        <div class="notes__foot">
          <button class="btn btn--sm" type="button" data-act="preview">Prévia</button>
          <button class="btn btn--sm" type="button" data-act="new">+ Nova aba</button>
          <button class="btn btn--danger btn--sm" type="button" data-act="del">Excluir aba</button>
          <span class="notes__status"></span>
        </div>
      </div>`;
    const tabsEl = el.querySelector('.notes__tabs');
    const titleEl = el.querySelector('.notes__title');
    const ta = el.querySelector('.notes__ta');
    const preview = el.querySelector('.notes__preview');
    const status = el.querySelector('.notes__status');
    const btnPreview = el.querySelector('[data-act="preview"]');
    const toolbarMount = el.querySelector('.notes__toolbar');
    createToolbar(ta, toolbarMount);

    let notes = [];
    let activeId = null;
    let dirty = false;
    let saveTimer = null;

    const active = () => notes.find(n => n.id === activeId);

    function renderTabs(){
      tabsEl.innerHTML = notes.map(n =>
        `<button type="button" class="notes__tab${n.id === activeId ? ' is-active' : ''}" data-id="${n.id}">${escapeHtml(n.title || 'Sem título')}</button>`
      ).join('') + `<button type="button" class="notes__tab is-add" data-act="new" title="Nova aba">+</button>`;
    }

    function loadInto(n){
      titleEl.value = n.title || '';
      ta.value = n.content || '';   // .value não dispara 'input': não conta como digitação
      if(!preview.hidden) preview.innerHTML = renderMarkdownLite(n.content) || '<p class="muted">Vazio.</p>';
    }

    function switchTo(id){
      activeId = id;
      renderTabs();
      loadInto(active());
    }

    async function ensureAtLeastOne(){
      if(notes.length) return;
      const { data, error } = await supabaseClient.from('escudo_notas').insert({ title: 'Nota 1', content: '', position: 0 }).select().single();
      if(!error) notes.push(data);
      else status.textContent = 'erro ao criar a primeira nota';
    }

    async function carregar(){
      const { data, error } = await supabaseClient.from('escudo_notas').select('*')
        .order('position', { ascending: true }).order('id', { ascending: true });
      if(error){ tabsEl.innerHTML = `<p class="form-msg">Não consegui carregar: ${escapeHtml(error.message)}</p>`; return; }
      notes = data;
      await ensureAtLeastOne();
      if(notes.length) switchTo(notes[0].id);
    }

    function scheduleSave(){
      dirty = true;
      status.textContent = 'digitando…';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(salvar, 800);
    }

    async function salvar(){
      const n = active();
      if(!n || !dirty) return;
      clearTimeout(saveTimer);
      n.title = titleEl.value.trim() || 'Sem título';
      n.content = ta.value;
      status.textContent = 'salvando…';
      const { error } = await supabaseClient.from('escudo_notas').update({ title: n.title, content: n.content }).eq('id', n.id);
      dirty = false;
      if(error){ status.textContent = 'erro ao salvar'; return; }
      status.textContent = 'salvo';
      renderTabs();
      setTimeout(() => { if(status.textContent === 'salvo') status.textContent = ''; }, 1500);
    }

    ta.addEventListener('input', scheduleSave);
    titleEl.addEventListener('input', scheduleSave);
    // fechar a aba do navegador com algo digitado há menos de 800ms perderia essa
    // última leva; um aviso nativo é a rede de segurança mais simples aqui.
    window.addEventListener('beforeunload', e => { if(dirty){ e.preventDefault(); e.returnValue = ''; } });

    tabsEl.addEventListener('click', async e => {
      if(e.target.closest('[data-act="new"]')){
        if(dirty) await salvar();
        const pos = notes.length ? Math.max(...notes.map(n => n.position)) + 1 : 0;
        const { data, error } = await supabaseClient.from('escudo_notas')
          .insert({ title: `Nota ${notes.length + 1}`, content: '', position: pos }).select().single();
        if(error){ status.textContent = 'erro ao criar aba'; return; }
        notes.push(data);
        switchTo(data.id);
        return;
      }
      const tab = e.target.closest('.notes__tab[data-id]');
      if(tab && +tab.dataset.id !== activeId){
        if(dirty) await salvar();
        switchTo(+tab.dataset.id);
      }
    });

    btnPreview.addEventListener('click', () => {
      const goingToPreview = preview.hidden;
      if(goingToPreview) preview.innerHTML = renderMarkdownLite(ta.value) || '<p class="muted">Vazio.</p>';
      preview.hidden = !goingToPreview;
      ta.hidden = goingToPreview;
      toolbarMount.hidden = goingToPreview;
      btnPreview.textContent = goingToPreview ? 'Editar' : 'Prévia';
    });

    el.querySelector('[data-act="del"]').addEventListener('click', async () => {
      const n = active();
      if(!n) return;
      if(!confirm(`Excluir a nota "${n.title || 'Sem título'}"? Isso não pode ser desfeito.`)) return;
      const { error } = await supabaseClient.from('escudo_notas').delete().eq('id', n.id);
      if(error){ status.textContent = 'erro ao excluir'; return; }
      notes = notes.filter(x => x.id !== n.id);
      dirty = false;
      await ensureAtLeastOne();
      switchTo(notes[0].id);
    });

    carregar();
  }
});
