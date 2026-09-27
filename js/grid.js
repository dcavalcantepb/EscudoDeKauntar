/* Grade de cards com posição LIVRE: cada card mora numa célula (x,y) — coluna
   e linha — escolhida por você ao arrastar, igual ladrilhos do Windows. Não
   depende de ordem nenhuma: dois cards podem ficar longe um do outro, com
   buracos no meio, e cada um guarda a própria posição.

   A grade tem sempre COLS colunas (fixas, esticadas pra usar a largura toda —
   por isso não é "responsiva" com quebra de coluna: o alvo é computador).
   Um card não pode SOBREPOR outro; arrastar pra cima de um lugar ocupado
   simplesmente não solta ali (o preview fica vermelho).

   A disposição é salva no navegador na hora, e também mandada pro Supabase
   (tabela escudo_layout), como reforço.

   Importante: cada card é criado e montado (def.mount) UMA SÓ VEZ. Mover e
   redimensionar só mudam o estilo do elemento que já existe — nunca recriam o
   card, senão o estado de dentro dele (o texto que você estava digitando, a
   aba aberta no bloco de notas) se perderia. */
const Grid = (function(){
  const LOCAL_KEY = 'escudo:layout';
  const COLS = 6, MAX_W = 4, MAX_H = 3;
  let container, defs;
  let entries = new Map();   // id -> { x, y, w, h }  (x,y = coluna/linha onde começa, 1-indexado)
  let order = [];            // só pra saber quais ids existem, sem influenciar a posição

  function defaultSize(def){ return { w: def && def.defaultW || 1, h: def && def.defaultH || 1 }; }

  /* ---------- ocupação: sem sobrepor, sem passar da última coluna ---------- */
  function overlap(a, b){ return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function cabe(x, y, w, h, ignorarId){
    if(x < 1 || y < 1 || x + w - 1 > COLS) return false;
    for(const [id, e] of entries){
      if(id === ignorarId) continue;
      if(overlap({ x, y, w, h }, e)) return false;
    }
    return true;
  }
  function primeiraVaga(w, h){
    for(let y = 1; y < 999; y++) for(let x = 1; x <= COLS - w + 1; x++) if(cabe(x, y, w, h)) return { x, y };
    return { x: 1, y: 1 };
  }

  function loadLocal(){
    try{ const v = JSON.parse(localStorage.getItem(LOCAL_KEY)); return Array.isArray(v) ? v : null; }catch(_){ return null; }
  }
  function snapshot(){ return order.map(id => ({ id, ...entries.get(id) })); }
  function saveLocal(){ try{ localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot())); }catch(_){} }
  async function loadCloud(){
    try{
      const { data, error } = await supabaseClient.from('escudo_layout').select('layout').eq('id', 1).maybeSingle();
      if(error || !data) return null;
      return Array.isArray(data.layout) ? data.layout : null;
    }catch(_){ return null; }
  }
  let cloudTimer = null;
  function saveCloud(){
    clearTimeout(cloudTimer);
    const layout = snapshot();
    cloudTimer = setTimeout(async () => {
      try{ await supabaseClient.from('escudo_layout').upsert({ id: 1, layout, updated_at: new Date().toISOString() }); }catch(_){}
    }, 600);
  }
  function persist(){ saveLocal(); saveCloud(); }

  /* junta o que foi salvo com a lista de ferramentas atual: uma ferramenta nova
     (ainda não salva) entra na primeira vaga livre; uma salva que não existe
     mais é descartada (inclui qualquer "espaço vazio" salvo de uma versão
     anterior — essa ideia foi abandonada, então some sozinho na próxima carga).
     Posições inválidas (sobrepondo, ou fora das COLS — por exemplo um layout
     salvo quando COLS era outro valor) são realocadas pra primeira vaga livre,
     sem apagar as demais. */
  function reconcile(saved){
    entries = new Map();
    order = [];
    const add = (id, w, h, x, y) => {
      const pos = (x != null && cabe(x, y, w, h)) ? { x, y } : primeiraVaga(w, h);
      entries.set(id, { w, h, ...pos });
      order.push(id);
    };
    for(const e of (saved || [])){
      const def = defs.find(d => d.id === e.id);
      if(!def) continue;   // ferramenta que não existe mais
      add(e.id, e.w, e.h, e.x, e.y);
    }
    for(const d of defs) if(!entries.has(d.id)){ const s = defaultSize(d); add(d.id, s.w, s.h, null, null); }
  }

  function svgResize(){ return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v6h6M20 10V4h-6M20 4 13 11M4 20l7-7"/></svg>'; }

  function place(card, entry){
    card.style.gridColumn = `${entry.x} / span ${entry.w}`;
    card.style.gridRow = `${entry.y} / span ${entry.h}`;
  }

  function buildCard(id, def){
    const entry = entries.get(id);
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.tool = id;
    place(card, entry);

    const head = document.createElement('div');
    head.className = 'card__head';
    head.draggable = true;
    head.innerHTML = `<span class="card__icon">${def.icon}</span><span class="card__title">${def.title}</span>`;
    const sizeBtn = document.createElement('button');
    sizeBtn.type = 'button'; sizeBtn.className = 'size-btn'; sizeBtn.title = 'Tamanho do card';
    sizeBtn.setAttribute('aria-haspopup', 'true'); sizeBtn.setAttribute('aria-expanded', 'false');
    sizeBtn.innerHTML = svgResize();
    head.appendChild(sizeBtn);

    const body = document.createElement('div');
    body.className = 'card__body';

    card.append(head, body);
    wireDrag(card, head, entry);
    wireResize(card, sizeBtn, entry);
    def.mount(body);
    return card;
  }

  /* ---------- arrastar: posição livre, célula por célula ---------- */
  let ghost = null;
  function metrics(){
    const cs = getComputedStyle(container);
    return {
      rect: container.getBoundingClientRect(),
      colWidths: cs.gridTemplateColumns.split(' ').map(parseFloat),
      colGap: parseFloat(cs.columnGap) || 0,
      rowH: parseFloat(cs.gridAutoRows) || 1,
      rowGap: parseFloat(cs.rowGap) || 0
    };
  }
  function cellFromPoint(clientX, clientY, m){
    let left = m.rect.left, col = m.colWidths.length;
    for(let i = 0; i < m.colWidths.length; i++){
      const right = left + m.colWidths[i];
      if(clientX < right + m.colGap / 2){ col = i + 1; break; }
      left = right + m.colGap;
    }
    const row = Math.max(1, Math.floor((clientY - m.rect.top) / (m.rowH + m.rowGap)) + 1);
    return { x: col, y: row };
  }
  function ensureGhost(){
    if(ghost) return ghost;
    ghost = document.createElement('div');
    ghost.className = 'card-ghost';
    return ghost;
  }
  function removeGhost(){ if(ghost && ghost.parentNode) ghost.remove(); ghost = null; }

  let dragId = null;
  function wireDrag(card, handle, entry){
    handle.addEventListener('dragstart', e => {
      dragId = card.dataset.tool;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragId);
      try{ e.dataTransfer.setDragImage(new Image(), 0, 0); }catch(_){}   // sem miniatura fantasma do navegador
    });
    handle.addEventListener('dragend', () => { card.classList.remove('is-dragging'); dragId = null; removeGhost(); });
  }
  function onDragOver(e){
    if(!dragId) return;
    e.preventDefault();
    const entry = entries.get(dragId);
    const m = metrics();
    let { x, y } = cellFromPoint(e.clientX, e.clientY, m);
    x = Math.max(1, Math.min(x, COLS - entry.w + 1));
    const livre = cabe(x, y, entry.w, entry.h, dragId);
    const g = ensureGhost();
    g.classList.toggle('is-invalid', !livre);
    g.style.gridColumn = `${x} / span ${entry.w}`;
    g.style.gridRow = `${y} / span ${entry.h}`;
    if(!g.isConnected) container.appendChild(g);
    g.dataset.x = x; g.dataset.y = y; g.dataset.livre = livre ? '1' : '';
  }
  function onDrop(e){
    e.preventDefault();
    if(!dragId || !ghost) return;
    const card = container.querySelector(`.card[data-tool="${CSS.escape(dragId)}"]`);
    if(ghost.dataset.livre){
      const entry = entries.get(dragId);
      entry.x = +ghost.dataset.x; entry.y = +ghost.dataset.y;
      place(card, entry);
      persist();
    }
    removeGhost();
  }

  /* ---------- gradinha de tamanho (estilo "inserir tabela") ---------- */
  let pop = null;
  function closePop(){ if(pop){ pop.remove(); pop = null; } document.querySelectorAll('.size-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false')); }
  function wireResize(card, btn, entry){
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if(pop){ closePop(); return; }
      openPop(card, btn, entry);
    });
  }
  function openPop(card, btn, entry){
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
      if(!cabe(entry.x, entry.y, c, r, card.dataset.tool)) cell.classList.add('is-invalid');
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
      if(!c || c.classList.contains('is-invalid')) return;
      entry.w = +c.dataset.w; entry.h = +c.dataset.h;
      place(card, entry);
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
      container.addEventListener('dragover', onDragOver);
      container.addEventListener('drop', onDrop);
      const cloud = await loadCloud();
      reconcile(cloud || loadLocal());
      saveLocal();
      container.innerHTML = '';
      for(const id of order) container.appendChild(buildCard(id, defs.find(d => d.id === id)));
    }
  };
})();
