/* Grade de cards reordenável e redimensionável (arraste no cabeçalho para
   reordenar; o botão de canto abre uma gradinha "estilo Word" para escolher
   quantas células de largura x altura). A disposição é salva no navegador na
   hora, e também mandada para o Supabase (tabela escudo_layout), como reforço —
   não há pressa em sincronizar entre aparelhos (uso é majoritariamente num
   computador só).

   Importante: cada card é criado e montado (def.mount) UMA SÓ VEZ. Reordenar e
   redimensionar só move o elemento existente ou muda o seu estilo — nunca
   recria o card, senão o estado de dentro dele (o texto que você estava
   digitando, a aba aberta no bloco de notas) se perderia. */
const Grid = (function(){
  const LOCAL_KEY = 'escudo:layout';
  const MAX_W = 4, MAX_H = 3;
  let container, defs;
  let entries = new Map();   // id -> { w, h }  (o tamanho de cada card)

  function defaultEntry(def){ return { w: def.defaultW || 1, h: def.defaultH || 1 }; }

  function loadLocal(){
    try{ const v = JSON.parse(localStorage.getItem(LOCAL_KEY)); return Array.isArray(v) ? v : null; }catch(_){ return null; }
  }
  function saveLocal(order){
    try{ localStorage.setItem(LOCAL_KEY, JSON.stringify(order.map(id => ({ id, ...entries.get(id) })))); }catch(_){}
  }
  async function loadCloud(){
    try{
      const { data, error } = await supabaseClient.from('escudo_layout').select('layout').eq('id', 1).maybeSingle();
      if(error || !data) return null;
      return Array.isArray(data.layout) ? data.layout : null;
    }catch(_){ return null; }
  }
  let cloudTimer = null;
  function saveCloud(order){
    clearTimeout(cloudTimer);
    const layout = order.map(id => ({ id, ...entries.get(id) }));
    cloudTimer = setTimeout(async () => {
      try{ await supabaseClient.from('escudo_layout').upsert({ id: 1, layout, updated_at: new Date().toISOString() }); }catch(_){}
    }, 600);
  }

  function currentOrder(){ return [...container.children].map(c => c.dataset.tool); }
  function persist(){ const order = currentOrder(); saveLocal(order); saveCloud(order); }

  const isSpacer = id => typeof id === 'string' && id.startsWith('spacer:');

  /* junta o que foi salvo com a lista de ferramentas atual: uma ferramenta nova
     (ainda não salva) entra no fim, com o tamanho padrão dela; uma salva que não
     existe mais é ignorada. Os "espaços vazios" (spacer:*) não vêm do código —
     só existem se estiverem salvos —, então são mantidos tal como estão. */
  function reconcile(saved){
    const known = new Set(defs.map(d => d.id));
    const order = (saved || []).map(e => e.id).filter(id => known.has(id) || isSpacer(id));
    for(const d of defs) if(!order.includes(d.id)) order.push(d.id);
    entries = new Map();
    for(const d of defs){
      const found = (saved || []).find(e => e.id === d.id);
      entries.set(d.id, found ? { w: found.w, h: found.h } : defaultEntry(d));
    }
    for(const e of (saved || [])) if(isSpacer(e.id)) entries.set(e.id, { w: e.w, h: e.h, spacer: true });
    return order;
  }

  function svgResize(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v6h6M20 10V4h-6M20 4 13 11M4 20l7-7"/></svg>';
  }

  function svgRemove(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  }

  /* def é undefined pra um "espaço vazio" (spacer:*) — não é uma ferramenta,
     é só uma célula reservada em branco, pra você separar grupos de cards. */
  function buildCard(id, def){
    const entry = entries.get(id);
    const card = document.createElement('div');
    card.className = def ? 'card' : 'card card--spacer';
    card.dataset.tool = id;
    card.style.gridColumn = `span ${entry.w}`;
    card.style.gridRow = `span ${entry.h}`;

    const head = document.createElement('div');
    head.className = 'card__head';
    head.draggable = true;
    head.innerHTML = def
      ? `<span class="card__icon">${def.icon}</span><span class="card__title">${def.title}</span>`
      : `<span class="card__title muted">Espaço vazio</span>`;
    const sizeBtn = document.createElement('button');
    sizeBtn.type = 'button'; sizeBtn.className = 'size-btn'; sizeBtn.title = 'Tamanho do card';
    sizeBtn.setAttribute('aria-haspopup', 'true'); sizeBtn.setAttribute('aria-expanded', 'false');
    sizeBtn.innerHTML = svgResize();
    head.appendChild(sizeBtn);
    if(!def){
      const rmBtn = document.createElement('button');
      rmBtn.type = 'button'; rmBtn.className = 'size-btn'; rmBtn.title = 'Remover este espaço vazio';
      rmBtn.innerHTML = svgRemove();
      rmBtn.addEventListener('click', e => { e.stopPropagation(); card.remove(); entries.delete(id); persist(); });
      head.appendChild(rmBtn);
    }

    const body = document.createElement('div');
    body.className = 'card__body';

    card.append(head, body);
    wireDrag(card, head);
    wireResize(card, sizeBtn, entry);
    if(def) def.mount(body);
    return card;
  }

  /* ---------- arrastar para reordenar ---------- */
  let dragEl = null;
  function wireDrag(card, handle){
    handle.addEventListener('dragstart', e => {
      dragEl = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.tool);
    });
    handle.addEventListener('dragend', () => { card.classList.remove('is-dragging'); dragEl = null; persist(); });
    card.addEventListener('dragover', e => {
      if(!dragEl || dragEl === card) return;
      e.preventDefault();
      card.classList.add('is-dragover');
      const rect = card.getBoundingClientRect();
      const before = (e.clientX - rect.left) < rect.width / 2 && (e.clientY - rect.top) < rect.height / 2;
      container.insertBefore(dragEl, before ? card : card.nextSibling);
    });
    card.addEventListener('dragleave', () => card.classList.remove('is-dragover'));
    card.addEventListener('drop', e => { e.preventDefault(); card.classList.remove('is-dragover'); });
  }

  /* ---------- gradinha de tamanho (estilo "inserir tabela") ---------- */
  let pop = null;
  function closePop(){ if(pop){ pop.remove(); pop = null; } document.querySelectorAll('.size-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false')); }
  function wireResize(card, btn, entry){
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if(pop){ closePop(); return; }
      openPop(btn, card, entry);
    });
  }
  function openPop(btn, card, entry){
    closePop();
    btn.setAttribute('aria-expanded', 'true');
    pop = document.createElement('div');
    pop.className = 'size-pop';
    const label = document.createElement('p');
    label.className = 'size-pop__label';
    label.textContent = `${entry.w} × ${entry.h}`;
    const grid = document.createElement('div');
    grid.className = 'size-pop__grid';
    const cells = [];
    for(let r = 1; r <= MAX_H; r++) for(let c = 1; c <= MAX_W; c++){
      const cell = document.createElement('button');
      cell.type = 'button'; cell.className = 'size-pop__cell';
      cell.dataset.w = c; cell.dataset.h = r;
      cell.setAttribute('aria-label', `${c} por ${r}`);
      cells.push(cell); grid.appendChild(cell);
    }
    const paint = (w, h) => cells.forEach(c => c.classList.toggle('is-on', +c.dataset.w <= w && +c.dataset.h <= h));
    paint(entry.w, entry.h);
    grid.addEventListener('mousemove', e => {
      const c = e.target.closest('.size-pop__cell');
      if(c){ label.textContent = `${c.dataset.w} × ${c.dataset.h}`; paint(+c.dataset.w, +c.dataset.h); }
    });
    grid.addEventListener('mouseleave', () => { label.textContent = `${entry.w} × ${entry.h}`; paint(entry.w, entry.h); });
    grid.addEventListener('click', e => {
      const c = e.target.closest('.size-pop__cell');
      if(!c) return;
      entry.w = +c.dataset.w; entry.h = +c.dataset.h;
      card.style.gridColumn = `span ${entry.w}`;
      card.style.gridRow = `span ${entry.h}`;
      persist();
      closePop();
    });
    pop.append(label, grid);
    document.body.appendChild(pop);
    const r = btn.getBoundingClientRect();
    pop.style.left = Math.max(4, Math.min(r.left, window.innerWidth - pop.offsetWidth - 4)) + 'px';
    pop.style.top = (r.bottom + 4) + 'px';
  }
  document.addEventListener('click', e => { if(pop && !e.target.closest('.size-pop') && !e.target.closest('.size-btn')) closePop(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && pop) closePop(); });

  return {
    /* toolDefs: [{id, title, icon, defaultW, defaultH, mount(bodyEl)}] */
    async init(containerEl, toolDefs){
      container = containerEl;
      defs = toolDefs;
      const cloud = await loadCloud();
      const order = reconcile(cloud || loadLocal());
      saveLocal(order);
      container.innerHTML = '';
      for(const id of order) container.appendChild(buildCard(id, defs.find(d => d.id === id)));
    },
    /* acrescenta um espaço vazio 1x1 no fim da grade — pra separar grupos de
       cards, ou só deixar um respiro. Arraste e redimensione como qualquer
       card; o × no cabeçalho remove. */
    addSpacer(){
      const id = `spacer:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      entries.set(id, { w: 1, h: 1, spacer: true });
      container.appendChild(buildCard(id, null));
      persist();
    }
  };
})();
