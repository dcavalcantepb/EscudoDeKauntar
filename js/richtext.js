/* Formatação de texto compartilhada pelas ferramentas (hoje só o Bloco de Notas).
   Mesmo motor e as mesmas marcas do Mio da Feada (js/render.js + js/toolbar.js),
   sem o sistema de menções [[Nome]] (não faz sentido num bloco de notas pessoal)
   e sem spoiler (não há leitor para esconder algo). Sem dependências externas. */

function escapeHtml(str){
  return String(str ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

const TEXT_COLORS = [
  ['ouro', 'Ouro'], ['brasa', 'Brasa'], ['rubi', 'Rubi'], ['rosa', 'Rosa'],
  ['violeta', 'Violeta'], ['ceu', 'Céu'], ['turquesa', 'Turquesa'], ['verde', 'Verde']
];
const TEXT_COLOR_NAMES = new Set(TEXT_COLORS.map(c => c[0]));

const ALIGN_RE = /^\{(esquerda|centro|direita|justificado)\}\s?/;

/* Formatação: # ## ### (títulos), **negrito**, *itálico*, __sublinhado__, ~~riscado~~,
   ==marca-texto==, [cor=nome]...[/cor], [texto](https://link), - / 1. (listas), > (citação),
   --- (divisor), {centro}/{direita}/{justificado} no começo da linha (alinhamento). */
function renderMarkdownLite(raw){
  const lines = String(raw ?? '').replace(/\r\n/g, '\n').trim().split('\n');
  if(lines.length === 1 && !lines[0]) return '';

  const out = [];
  let para = [], paraAlign = null, list = null, quote = [], quoteAlign = null;
  const alClass = (al, base = '') => {
    const c = [base, al && al !== 'esquerda' ? `al-${al}` : ''].filter(Boolean).join(' ');
    return c ? ` class="${c}"` : '';
  };
  const flush = () => {
    if(para.length){ out.push(`<p${alClass(paraAlign)}>${para.map(inline).join('<br>')}</p>`); para = []; paraAlign = null; }
    if(list){ out.push(`<${list.tag}>${list.items.map(i => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null; }
    if(quote.length){ out.push(`<blockquote${alClass(quoteAlign)}><p>${quote.map(inline).join('<br>')}</p></blockquote>`); quote = []; quoteAlign = null; }
  };

  for(const rawLine of lines){
    let line = rawLine.trim();
    let align = null;
    const am = line.match(ALIGN_RE);
    if(am){ align = am[1]; line = line.slice(am[0].length).trim(); }
    let m;
    if(!line){ flush(); }
    else if(/^-{3,}$/.test(line)){ flush(); out.push('<div class="md-hr" role="separator"></div>'); }
    else if((m = line.match(/^(#{1,3})\s+(.+)$/))){
      flush();
      const n = m[1].length;
      out.push(`<p${alClass(align, `md-h${n}`)}>${inline(m[2])}</p>`);
    }
    else if((m = line.match(/^>\s?(.*)$/))){
      if(para.length || list) flush();
      if(quote.length && align && quoteAlign && align !== quoteAlign) flush();
      quote.push(m[1]);
      quoteAlign = quoteAlign || align;
    }
    else if((m = line.match(/^(?:-|\*)\s+(.+)$/)) && !/^\*\*/.test(line)){
      if(para.length || quote.length || (list && list.tag !== 'ul')) flush();
      (list = list || { tag: 'ul', items: [] }).items.push(m[1]);
    }
    else if((m = line.match(/^\d+[.)]\s+(.+)$/))){
      if(para.length || quote.length || (list && list.tag !== 'ol')) flush();
      (list = list || { tag: 'ol', items: [] }).items.push(m[1]);
    }
    else {
      if(list || quote.length) flush();
      if(para.length && align && paraAlign && align !== paraAlign) flush();
      para.push(line);
      paraAlign = paraAlign || align;
    }
  }
  flush();
  return out.join('');

  function inline(s){
    const links = [];
    let t = escapeHtml(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
      links.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
      return `\u0000${links.length - 1}\u0000`;
    });
    t = t.replace(/\[cor=([a-z]+)\](.+?)\[\/cor\]/g, (all, name, txt) =>
      TEXT_COLOR_NAMES.has(name) ? `<span class="c-${name}">${txt}</span>` : all);
    t = t.replace(/==(.+?)==/g, '<mark class="md-mark">$1</mark>');
    t = t.replace(/~~(.+?)~~/g, '<s>$1</s>');
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/__(.+?)__/g, '<u>$1</u>');
    t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return t.replace(/\u0000(\d+)\u0000/g, (_, i) => links[+i]);
  }
}

/* ---------- barra de ferramentas, presa a um <textarea> específico ----------
   Diferente do Mio da Feada (uma barra fixa, um textarea fixo na página), aqui
   o Bloco de Notas troca de aba trocando o valor do MESMO textarea, então uma
   única instância de barra serve para todas as abas. */
function createToolbar(ta, mount){
  const svg = inner => `<svg viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
  const ICON = {
    undo: svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'),
    redo: svg('<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>'),
    mark: svg('<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>'),
    ul: svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
    ol: svg('<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 5.5 5.5 5v4.5"/><path d="M4 9.5h3"/><path d="M4 14.5c1-1 2.5-.8 2.5.3 0 1.3-2.5 1.7-2.5 3h3"/>'),
    quote: svg('<path d="M9 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v-2H6"/><path d="M9 14v1a3 3 0 0 1-3 3"/><path d="M19 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v-2h-3"/><path d="M19 14v1a3 3 0 0 1-3 3"/>'),
    hr: svg('<path d="M3 12h5M16 12h5"/><path d="m12 8 1.6 4-1.6 4-1.6-4z"/>'),
    link: svg('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
    clear: svg('<path d="m7 21-4-4a2 2 0 0 1 0-2.8l10-10a2 2 0 0 1 2.8 0l4 4a2 2 0 0 1 0 2.8L11 21"/><path d="M7 21h14"/><path d="m6 13 5 5"/>'),
    esquerda: svg('<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>'),
    centro: svg('<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>'),
    direita: svg('<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>'),
    justificado: svg('<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>')
  };
  const ITEMS = [
    ['undo', 'Desfazer (Ctrl+Z)', ICON.undo], ['redo', 'Refazer (Ctrl+Y)', ICON.redo], 'sep',
    ['h1', 'Título 1', 'H1'], ['h2', 'Título 2', 'H2'], ['h3', 'Título 3', 'H3'], 'sep',
    ['esquerda', 'Alinhar à esquerda (tira o alinhamento)', ICON.esquerda], ['centro', 'Centralizar', ICON.centro],
    ['direita', 'Alinhar à direita', ICON.direita], ['justificado', 'Justificar', ICON.justificado], 'sep',
    ['bold', 'Negrito (Ctrl+B)', '<b>B</b>'], ['italic', 'Itálico (Ctrl+I)', '<i>I</i>'],
    ['underline', 'Sublinhado (Ctrl+U)', '<u>U</u>'], ['strike', 'Riscado', '<s>S</s>'],
    ['mark', 'Marca-texto', ICON.mark], ['color', 'Cor do texto', '<span class="tb__a">A</span>'], 'sep',
    ['ul', 'Lista de marcadores', ICON.ul], ['ol', 'Lista numerada', ICON.ol],
    ['quote', 'Citação', ICON.quote], ['hr', 'Divisor', ICON.hr], ['link', 'Link', ICON.link], 'sep',
    ['clear', 'Limpar formatação', ICON.clear]
  ];

  const wrap = document.createElement('div');
  wrap.className = 'tbar-wrap';
  const bar = document.createElement('div');
  bar.className = 'tbar';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Formatação do texto');
  bar.innerHTML = ITEMS.map(it => it === 'sep'
    ? '<span class="tbar__sep" aria-hidden="true"></span>'
    : `<button class="tb${it[0] === 'color' ? ' tb--color' : ''}" type="button" data-cmd="${it[0]}" title="${it[1]}" aria-label="${it[1]}"${it[0] === 'color' ? ' aria-haspopup="true" aria-expanded="false"' : ''}>${it[2]}</button>`
  ).join('');

  const tray = document.createElement('div');
  tray.className = 'tray';
  tray.hidden = true;
  tray.setAttribute('role', 'group');
  tray.setAttribute('aria-label', 'Cores do texto');
  tray.innerHTML = TEXT_COLORS.map(([id, nome]) =>
    `<button class="swatch" type="button" data-color="${id}" style="--sw:var(--c-${id})" title="${nome}" aria-label="${nome}"></button>`
  ).join('') + '<button class="swatch swatch--none" type="button" data-color="" title="Sem cor" aria-label="Sem cor"></button>';
  document.body.appendChild(tray);
  wrap.appendChild(bar);
  mount.appendChild(wrap);

  const colorBtn = bar.querySelector('[data-cmd="color"]');
  function closeTray(){ tray.hidden = true; colorBtn.setAttribute('aria-expanded', 'false'); }
  function toggleTray(){
    const open = tray.hidden;
    if(open){
      const r = colorBtn.getBoundingClientRect();
      tray.hidden = false;
      tray.style.left = Math.max(4, Math.min(r.left, window.innerWidth - tray.offsetWidth - 4)) + 'px';
      tray.style.top = (r.bottom + 4) + 'px';
      colorBtn.setAttribute('aria-expanded', 'true');
      tray.querySelector('.swatch').focus();
    } else closeTray();
  }

  function replace(start, end, text, selStart, selEnd){
    ta.focus();
    ta.setSelectionRange(start, end);
    let ok = false;
    try{ ok = text === '' ? document.execCommand('delete') : document.execCommand('insertText', false, text); }catch(_){}
    if(!ok){
      ta.setRangeText(text, start, end, 'end');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
    ta.setSelectionRange(selStart, selEnd);
  }

  function wrapInline(open, close, placeholder){
    const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd, sel = v.slice(s, e);
    const italic = open === '*';
    if(v.slice(s - open.length, s) === open && v.slice(e, e + close.length) === close &&
       !(italic && (v[s - 2] === '*' || v[e + 1] === '*'))){
      replace(s - open.length, e + close.length, sel, s - open.length, s - open.length + sel.length);
      return;
    }
    if(sel.length >= open.length + close.length && sel.startsWith(open) && sel.endsWith(close) &&
       !(italic && sel.startsWith('**'))){
      const inner = sel.slice(open.length, sel.length - close.length);
      replace(s, e, inner, s, s + inner.length);
      return;
    }
    if(sel.includes('\n') || ALIGN_RE.test(sel)){
      const out = sel.split('\n').map(l => { if(!l.trim()) return l; const [al, rest] = splitAlign(l); return al + open + rest + close; }).join('\n');
      replace(s, e, out, s, s + out.length);
      return;
    }
    const text = sel || placeholder;
    replace(s, e, open + text + close, s + open.length, s + open.length + text.length);
  }

  function setColor(name){
    const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd, sel = v.slice(s, e);
    const m = /\[cor=[a-z]+\]$/.exec(v.slice(0, s));
    if(m && v.slice(e).startsWith('[/cor]')){
      const start = s - m[0].length, end = e + 6;
      if(!name){ replace(start, end, sel, start, start + sel.length); return; }
      const open = `[cor=${name}]`;
      replace(start, end, open + sel + '[/cor]', start + open.length, start + open.length + sel.length);
      return;
    }
    if(name) wrapInline(`[cor=${name}]`, '[/cor]', 'texto colorido');
  }

  function lineRange(){
    const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd;
    const ls = s === 0 ? 0 : v.lastIndexOf('\n', s - 1) + 1;
    const end = e > s && v[e - 1] === '\n' ? e - 1 : e;
    let le = v.indexOf('\n', end);
    if(le === -1) le = v.length;
    return [ls, le];
  }
  const PREFIX = /^(#{1,3}\s+|-\s+|\d+[.)]\s+|>\s?)/;
  const ALIGN_LINE = /^\{(esquerda|centro|direita|justificado)\}\s?/;
  const splitAlign = l => { const m = ALIGN_LINE.exec(l); return m ? [m[0], l.slice(m[0].length)] : ['', l]; };
  const TEST = { h1: /^#\s+/, h2: /^##\s+/, h3: /^###\s+/, ul: /^-\s+/, ol: /^\d+[.)]\s+/, quote: /^>\s?/ };
  const MARK = { h1: () => '# ', h2: () => '## ', h3: () => '### ', ul: () => '- ', ol: n => `${n}. `, quote: () => '> ' };
  const HOLD = { h1: 'Título', h2: 'Título', h3: 'Título', ul: 'item', ol: 'item', quote: 'citação' };

  function lineTool(kind){
    const [ls, le] = lineRange();
    const lines = ta.value.slice(ls, le).split('\n');
    if(!lines.some(l => l.trim())){
      const pre = MARK[kind](1);
      replace(ls, le, pre + HOLD[kind], ls + pre.length, ls + pre.length + HOLD[kind].length);
      return;
    }
    const filled = lines.filter(l => l.trim());
    const allHave = filled.every(l => TEST[kind].test(splitAlign(l)[1]));
    let n = 0;
    const out = lines.map(l => {
      if(!l.trim()) return l;
      const [al, rest] = splitAlign(l);
      return al + (allHave ? rest.replace(PREFIX, '') : MARK[kind](++n) + rest.replace(PREFIX, ''));
    }).join('\n');
    replace(ls, le, out, ls, ls + out.length);
  }

  function alignTool(kind){
    const [ls, le] = lineRange();
    const lines = ta.value.slice(ls, le).split('\n');
    if(!lines.some(l => l.trim())){
      if(kind === 'esquerda') return;
      const pre = `{${kind}}`, hold = 'texto';
      replace(ls, le, pre + hold, ls + pre.length, ls + pre.length + hold.length);
      return;
    }
    const filled = lines.filter(l => l.trim());
    const allHave = kind !== 'esquerda' && filled.every(l => splitAlign(l)[0].startsWith(`{${kind}}`));
    const out = lines.map(l => {
      if(!l.trim()) return l;
      const rest = splitAlign(l)[1];
      return kind === 'esquerda' || allHave ? rest : `{${kind}}` + rest;
    }).join('\n');
    replace(ls, le, out, ls, ls + out.length);
  }

  function divider(){
    const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd, before = v.slice(0, s);
    const pre = !before || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
    const text = pre + '---\n' + (v.slice(e).startsWith('\n') ? '' : '\n');
    replace(s, e, text, s + text.length, s + text.length);
  }

  function link(){
    const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd, sel = v.slice(s, e);
    if(/^https?:\/\/\S+$/.test(sel)){
      const out = `[texto do link](${sel})`;
      replace(s, e, out, s + 1, s + 1 + 'texto do link'.length);
      return;
    }
    const label = sel || 'texto do link';
    const out = `[${label}](https://)`;
    const urlStart = s + label.length + 3;
    replace(s, e, out, urlStart, urlStart + 'https://'.length);
  }

  function clearFormat(){
    let [s, e] = [ta.selectionStart, ta.selectionEnd];
    if(s === e){ [s, e] = lineRange(); }
    const clean = t => t
      .replace(/\[cor=[a-z]+\]|\[\/cor\]/g, '')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
      .replace(/==|~~|\*\*|__/g, '')
      .replace(/\*(.+?)\*/g, '$1')
      .split('\n').map(l => splitAlign(l)[1].replace(PREFIX, '')).join('\n');
    const out = clean(ta.value.slice(s, e));
    replace(s, e, out, s, s + out.length);
  }

  const RUN = {
    undo: () => { ta.focus(); document.execCommand('undo'); },
    redo: () => { ta.focus(); document.execCommand('redo'); },
    h1: () => lineTool('h1'), h2: () => lineTool('h2'), h3: () => lineTool('h3'),
    bold: () => wrapInline('**', '**', 'negrito'),
    italic: () => wrapInline('*', '*', 'itálico'),
    underline: () => wrapInline('__', '__', 'sublinhado'),
    strike: () => wrapInline('~~', '~~', 'riscado'),
    mark: () => wrapInline('==', '==', 'destaque'),
    ul: () => lineTool('ul'), ol: () => lineTool('ol'), quote: () => lineTool('quote'),
    hr: divider, link,
    clear: clearFormat,
    esquerda: () => alignTool('esquerda'), centro: () => alignTool('centro'),
    direita: () => alignTool('direita'), justificado: () => alignTool('justificado')
  };

  bar.addEventListener('mousedown', e => { if(e.target.closest('button')) e.preventDefault(); });
  bar.addEventListener('click', e => {
    const sw = e.target.closest('[data-color]');
    if(sw){ closeTray(); setColor(sw.dataset.color); return; }
    const b = e.target.closest('[data-cmd]');
    if(!b) return;
    if(b.dataset.cmd === 'color'){ toggleTray(); return; }
    closeTray();
    RUN[b.dataset.cmd]();
    ta.focus();
  });
  document.addEventListener('click', e => { if(!tray.hidden && !e.target.closest('.tbar') && !e.target.closest('.tray')) closeTray(); });
  bar.addEventListener('keydown', e => { if(e.key === 'Escape' && !tray.hidden){ closeTray(); colorBtn.focus(); e.stopPropagation(); } });

  ta.addEventListener('keydown', e => {
    if(!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
    const k = e.key.toLowerCase();
    const cmd = { b: 'bold', i: 'italic', u: 'underline' }[k];
    if(cmd){ e.preventDefault(); RUN[cmd](); }
  });

  return { destroy(){ tray.remove(); wrap.remove(); } };
}
