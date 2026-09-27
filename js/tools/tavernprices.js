/* Taverna — hospedagem, comida e bebida. Valores oficiais (PHB/SRD 5e, tabela
   "Food, Drink, and Lodging"), a mesma referência que o site bloqueado ia
   usar. Sem busca (são só 14 linhas) — uma lista fixa por categoria. */
TOOLS.push({
  id: 'tavernprices',
  title: 'Taverna',
  icon: '<svg viewBox="0 0 24 24"><path d="M6 8h9v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M15 10h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/></svg>',
  defaultW: 2, defaultH: 2,
  mount(el){
    const ITENS = [
      ['Hospedagem (por dia)', 'Miserável', '7 pc'],
      ['Hospedagem (por dia)', 'Pobre', '1 pp'],
      ['Hospedagem (por dia)', 'Modesta', '5 pp'],
      ['Hospedagem (por dia)', 'Confortável', '8 pp'],
      ['Hospedagem (por dia)', 'Rica', '2 po'],
      ['Hospedagem (por dia)', 'Aristocrática', '4 po'],
      ['Refeição (por dia)', 'Miserável', '3 pc'],
      ['Refeição (por dia)', 'Pobre', '6 pc'],
      ['Refeição (por dia)', 'Modesta', '3 pp'],
      ['Refeição (por dia)', 'Confortável', '5 pp'],
      ['Refeição (por dia)', 'Rica', '8 pp'],
      ['Refeição (por dia)', 'Aristocrática', '2 po'],
      ['Comida e Bebida', 'Cerveja, caneca', '4 pc'],
      ['Comida e Bebida', 'Cerveja, galão', '2 pp'],
      ['Comida e Bebida', 'Banquete (por pessoa)', '10 po'],
      ['Comida e Bebida', 'Pão, pedaço', '2 pc'],
      ['Comida e Bebida', 'Queijo, pedaço', '1 pp'],
      ['Comida e Bebida', 'Carne, pedaço', '3 pp'],
      ['Comida e Bebida', 'Vinho comum, jarro', '2 pp'],
      ['Comida e Bebida', 'Vinho fino, garrafa', '10 po']
    ];
    const grupos = [...new Set(ITENS.map(i => i[0]))];
    el.innerHTML = `
      <p class="form__hint" style="margin:0">Valores oficiais (PHB/SRD). "Rica"/"Aristocrática" cobrem uma pousada de
        respeito; ajuste conforme a fama do lugar.</p>
      <div class="search__results">
        ${grupos.map(g => `
          <div class="existing__group" style="padding-left:0">${g}</div>
          ${ITENS.filter(i => i[0] === g).map(([, nome, preco]) => `
            <div class="search__item" style="cursor:default; display:flex; align-items:center; justify-content:space-between; gap:.6rem;">
              <span class="search__title" style="font-size:.95rem">${nome}</span>
              <b class="c-ouro" style="flex:none">${preco}</b>
            </div>`).join('')}
        `).join('')}
      </div>`;
  }
});
