/* Serviços — busca com filtro por categoria, igual ao card Equipamentos.
   Referência que o Danilo passou (carruagem, contratado, mensageiro, pedágio,
   passagem de navio), convertida pra po/pp/pc. Conjuração tem card próprio
   (ver js/tools/spellcasting.js) — não é uma lista de preço fixo, então não
   cabia nesse formato de busca. */
const SERVICOS = [
  ["Transporte", "Carruagem entre Cidades", "3 pc", 3, "2 pc", "6 pc"],
  ["Transporte", "Carruagem dentro da Cidade", "1 pc", 1, "1 pc", "2 pc"],
  ["Transporte", "Passagem de Navio", "1 pp", 10, "8 pc", "2 pp"],
  ["Transporte", "Pedágio de Estrada/Portão", "1 pc", 1, "1 pc", "2 pc"],
  ["Contratados", "Contratado Especializado (por dia)", "2 po", 20000, "2 po", "4 po"],
  ["Contratados", "Contratado Sem Treinamento (por dia)", "2 pp", 200, "2 pp", "4 pp"],
  ["Correio", "Mensageiro", "2 pc", 2, "2 pc", "4 pc"]
];

TOOLS.push({
  id: 'services',
  title: 'Serviços',
  icon: '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>',
  defaultW: 2, defaultH: 2,
  mount(el){
    const categorias = [...new Set(SERVICOS.map(r => r[0]))];
    el.innerHTML = `
      <div class="search__box">
        <input class="field" type="search" placeholder="Buscar serviço…" autocomplete="off">
        <select class="field" style="width:auto" data-f="categoria">
          <option value="">Todas as categorias</option>
          ${categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div class="search__results"></div>`;
    const input = el.querySelector('input');
    const catSel = el.querySelector('[data-f="categoria"]');
    const results = el.querySelector('.search__results');
    const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    function buscar(){
      const q = norm(input.value.trim());
      const cat = catSel.value;
      const achados = SERVICOS.filter(r => (!cat || r[0] === cat) && (!q || norm(r[1]).includes(q)));
      if(!achados.length){ results.innerHTML = '<p class="gen__empty">Nada encontrado.</p>'; return; }
      results.innerHTML = achados.map(([categoria, nome, normal, , baixo, alto]) => `
        <div class="search__item" style="cursor:default">
          <span class="search__kind">${categoria}</span>
          <div class="search__title">${escapeHtml(nome)}</div>
          <p class="search__snip"><b class="c-ouro">${normal}</b> · baixo ${baixo} · alto ${alto}</p>
        </div>`).join('');
    }
    input.addEventListener('input', buscar);
    catSel.addEventListener('change', buscar);
    buscar();
  }
});
