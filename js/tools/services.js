/* Serviços (inclui mágicos) — valores oficiais (PHB/SRD 5e).
   Lista de serviços mundanos no mesmo formato de busca/filtro do card
   Equipamentos (referência que o Danilo passou: carruagem, contratado,
   mensageiro, pedágio, passagem de navio — sem peso, por não serem itens
   físicos). Conjuração continua em separado, ACIMA da lista: não é um preço
   fixo por item, e sim uma fórmula por NÍVEL do espaço usado — 10 po × nível²
   — que é como o próprio livro calcula a tabela de exemplos dele (Cura de
   Ferimentos nível 1 = 10 po, Restauração Menor nível 2 = 40 po, e por aí vai).
   Prefiro a fórmula a copiar só os ~20 exemplos do livro: cobre QUALQUER magia
   que os jogadores pedirem, não só as que o PHB escolheu ilustrar. */
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
  icon: '<svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>',
  defaultW: 2, defaultH: 2,
  mount(el){
    const categorias = [...new Set(SERVICOS.map(r => r[0]))];
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
        <p class="search__snip" style="margin:0">Exceção conhecida: Identificar custa 20 po (o dobro da fórmula, por causa
          da pérola que o componente material pede).</p>
      </div>
      <div class="search__box">
        <input class="field" type="search" placeholder="Buscar serviço…" autocomplete="off">
        <select class="field" style="width:auto" data-f="categoria">
          <option value="">Todas as categorias</option>
          ${categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div class="search__results"></div>`;
    const fNivel = el.querySelector('[data-f="nivel"]');
    const custo = el.querySelector('.gen__custo');
    function calcular(){ custo.textContent = `${10 * fNivel.value * fNivel.value} po`; }
    fNivel.addEventListener('input', calcular);
    calcular();

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
