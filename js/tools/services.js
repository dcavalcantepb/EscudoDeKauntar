/* Serviços (inclui mágicos) — valores oficiais (PHB/SRD 5e).
   Conjuração: a regra oficial não lista preço fixo por magia, e sim uma fórmula
   por NÍVEL do espaço usado — 10 po × nível² — que é como o próprio livro
   calcula a tabela de exemplos dele (Cura de Ferimentos nível 1 = 10 po,
   Restauração Menor nível 2 = 40 po, e por aí vai). Prefiro a fórmula a copiar
   só os ~20 exemplos do livro: cobre QUALQUER magia que os jogadores pedirem,
   não só as que o PHB escolheu ilustrar.
   Contratados: tabela de contratados (DMG). */
TOOLS.push({
  id: 'services',
  title: 'Serviços',
  icon: '<svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>',
  defaultW: 2, defaultH: 2,
  mount(el){
    const CONTRATADOS = [
      ['Sem treinamento (carregador, remador…)', '2 pp / dia'],
      ['Especializado (mercenário, artesão…)', '2 po / dia']
    ];
    el.innerHTML = `
      <div class="notes__foot" style="flex-wrap:wrap">
        <label class="field" style="width:auto">Nível da magia
          <select data-f="nivel">
            ${[1,2,3,4,5,6,7,8,9].map(n => `<option value="${n}">${n}º</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="gen__result" style="flex:none">
        <p class="gen__line"><b class="c-ouro gen__custo" style="font-size:1.3rem"></b> para contratar um conjurador
          (mínimo — sobe se a magia gastar um componente material caro)</p>
        <p class="search__snip" style="margin:0">Exceções conhecidas: Identificar custa 20 po (o dobro da fórmula, por causa
          da pérola que o componente material pede).</p>
      </div>
      <div class="existing__group" style="padding-left:0">Contratados (por dia)</div>
      <div class="search__results" style="flex:none">
        ${CONTRATADOS.map(([nome, preco]) => `
          <div class="search__item" style="cursor:default; display:flex; align-items:center; justify-content:space-between; gap:.6rem;">
            <span class="search__title" style="font-size:.95rem">${nome}</span>
            <b class="c-ouro" style="flex:none">${preco}</b>
          </div>`).join('')}
      </div>`;
    const fNivel = el.querySelector('[data-f="nivel"]');
    const custo = el.querySelector('.gen__custo');
    function calcular(){ custo.textContent = `${10 * fNivel.value * fNivel.value} po`; }
    fNivel.addEventListener('input', calcular);
    calcular();
  }
});
