/* 7) Buscador na base do Mio da Feada — lê as três tabelas do MESMO projeto
   Supabase (sessoes, tomos, personagens). Como aqui você entra com a sua conta
   de autor, a RLS libera ler os rascunhos também, não só o que está publicado.
   Busca client-side, sem diferenciar maiúsculas/acentos. */
TOOLS.push({
  id: 'search',
  title: 'Buscar na Base do Mio da Feada',
  icon: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m21 21-4.3-4.3"/></svg>',
  defaultW: 2, defaultH: 2,
  mount(el){
    const SITE = 'https://dcavalcantepb.github.io/mio_Da_Feada/';
    const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    el.innerHTML = `
      <div class="search__box">
        <input class="field" type="search" placeholder="Buscar personagens, tomos, sessões…" autocomplete="off">
        <button class="btn btn--sm" data-act="atualizar" title="Recarregar da base">↻</button>
      </div>
      <div class="search__results"><p class="gen__empty">Carregando a base…</p></div>`;
    const input = el.querySelector('input');
    const results = el.querySelector('.search__results');
    const btnRefresh = el.querySelector('[data-act="atualizar"]');

    let index = null;   // [{kind, title, text, href}]

    function snippet(text, q){
      const t = String(text || '');
      if(!q) return t.slice(0, 120);
      const i = norm(t).indexOf(q);
      if(i === -1) return t.slice(0, 120);
      const start = Math.max(0, i - 40);
      return (start > 0 ? '…' : '') + t.slice(start, start + 140) + (start + 140 < t.length ? '…' : '');
    }

    async function carregar(){
      results.innerHTML = '<p class="gen__empty">Carregando a base…</p>';
      try{
        const [s, t, p] = await Promise.all([
          supabaseClient.from('sessoes').select('id,title,campaign,arc,summary,content,published'),
          supabaseClient.from('tomos').select('id,title,summary,content,published'),
          supabaseClient.from('personagens').select('id,name,bio,race,affiliation,story,published')
        ]);
        if(s.error) throw s.error; if(t.error) throw t.error; if(p.error) throw p.error;
        index = [
          ...s.data.map(x => ({ kind: 'sessao', title: x.title, published: x.published,
            text: [x.campaign, x.arc, x.summary, x.content].filter(Boolean).join(' '), href: `${SITE}index.html#s=${x.id}` })),
          ...t.data.map(x => ({ kind: 'tomo', title: x.title, published: x.published,
            text: [x.summary, x.content].filter(Boolean).join(' '), href: `${SITE}tomos.html#t=${x.id}` })),
          ...p.data.map(x => ({ kind: 'personagem', title: x.name, published: x.published,
            text: [x.bio, x.race, x.affiliation, x.story].filter(Boolean).join(' '), href: `${SITE}personagens.html#p=${x.id}` }))
        ];
        buscar();
      }catch(err){
        results.innerHTML = `<p class="form-msg">Não consegui carregar a base: ${escapeHtml(err.message)}</p>`;
      }
    }

    const ROTULO = { sessao: 'Sessão', tomo: 'Tomo', personagem: 'Personagem' };
    function buscar(){
      if(!index) return;
      const q = norm(input.value.trim());
      const achados = !q ? index.slice(-12).reverse() : index.filter(x => norm(x.title).includes(q) || norm(x.text).includes(q));
      if(!achados.length){ results.innerHTML = '<p class="gen__empty">Nada encontrado.</p>'; return; }
      results.innerHTML = achados.slice(0, 40).map(x => `
        <a class="search__item" href="${x.href}" target="_blank" rel="noopener">
          <span class="search__kind">${ROTULO[x.kind]}${x.published ? '' : ' · rascunho'}</span>
          <div class="search__title">${escapeHtml(x.title || 'Sem título')}</div>
          ${x.text ? `<p class="search__snip">${escapeHtml(snippet(x.text, q))}</p>` : ''}
        </a>`).join('');
    }

    let timer = null;
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(buscar, 200); });
    btnRefresh.addEventListener('click', carregar);
    carregar();
  }
});
