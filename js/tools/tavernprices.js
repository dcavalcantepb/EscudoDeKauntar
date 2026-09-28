/* Taverna — gerador completo (fundiu o antigo "Gerador de Tavernas" aqui
   dentro, por pedido do Danilo): você escolhe tipo de hospedagem, especialidade
   da cozinha, quantos ajudantes, e raça/sexo/humor do taverneiro(a); o card
   sorteia nome, descrição breve, o cardápio de pratos e de bebidas (com preço),
   e o taverneiro(a) + ajudantes. Sem rumores — o Danilo cria os dele.

   Preços: a base de cada prato/bebida vem da tabela oficial PHB/SRD de
   "Food, Drink, and Lodging" (o preço de UMA refeição, por nível de
   hospedagem) — o livro não lista preço de prato individual, então uso a
   refeição oficial como referência e varia um pouco por item (não é um
   número oficial, é a MINHA extrapolação a partir do que é oficial). */
TOOLS.push({
  id: 'tavernprices',
  title: 'Taverna',
  icon: '<svg viewBox="0 0 24 24"><path d="M6 8h9v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M15 10h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/></svg>',
  defaultW: 2, defaultH: 3,
  mount(el){
    /* hospedagem: preço OFICIAL (PHB/SRD, tabela "Food, Drink, and Lodging",
       "por dia") — diferente de prato/bebida, que são minha extrapolação. */
    const TIERS = {
      'Miserável':     { pratos: 1, hospedagem: '7 pc', prato: [2, 'pc'], bebida: [1, 'pc'] },
      'Pobre':         { pratos: 2, hospedagem: '1 pp', prato: [4, 'pc'], bebida: [2, 'pc'] },
      'Modesta':       { pratos: 3, hospedagem: '5 pp', prato: [2, 'pp'], bebida: [4, 'pc'] },
      'Confortável':   { pratos: 4, hospedagem: '8 pp', prato: [3, 'pp'], bebida: [1, 'pp'] },
      'Rica':          { pratos: 5, hospedagem: '2 po', prato: [5, 'pp'], bebida: [2, 'pp'] },
      'Aristocrática': { pratos: 5, hospedagem: '4 po', prato: [1, 'po'], bebida: [4, 'pp'] }
    };
    const tiers = Object.keys(TIERS);

    const ESPECIALIDADES = {
      'Alta Cozinha': [
        ['Consommé de aves com ervas finas', 'caldo claro e delicado, com uma última gota de vinho branco'],
        ['Lombo ao molho de vinho tinto', 'reduzido lentamente, acompanha purê de raízes'],
        ['Terrina de caça', 'com geleia de frutas silvestres'],
        ['Risoto de cogumelos raros', 'com lascas de queijo curado por cima'],
        ['Peito de ave recheado', 'com castanhas e ervas da estação'],
        ['Creme queimado', 'sobremesa da casa, com mel próprio']
      ],
      'Frutos do Mar': [
        ['Caldeirada de peixe', 'com açafrão e batatas'],
        ['Camarões grelhados', 'na manteiga de alho'],
        ['Ostras frescas', 'servidas com limão'],
        ['Polvo assado na brasa', 'com azeite de ervas'],
        ['Sopa de mariscos', 'com pão amanhecido'],
        ['Peixe inteiro grelhado', 'temperado na hora']
      ],
      'Churrasco e Carnes': [
        ['Costela assada na brasa', 'lentamente, quase caindo do osso'],
        ['Linguiça defumada da casa', 'com mostarda forte'],
        ['Javali assado', 'com crosta de ervas'],
        ['Espetos de carne temperada', 'com pimenta-do-reino'],
        ['Presunto curado', 'fatiado na hora'],
        ['Bife na chapa', 'com cebolas caramelizadas']
      ],
      'Comida de Estrada': [
        ['Ensopado do dia', 'o que sobrou vira caldo, e ninguém pergunta o quê'],
        ['Pão duro com queijo', 'e cebola crua'],
        ['Sopa de raízes e cevada', 'simples e quente'],
        ['Torta salgada de carne moída', 'feita pra viajante com pressa'],
        ['Papa de aveia', 'com um fio de mel'],
        ['Legumes cozidos com toucinho', 'prato do dia, sem luxo']
      ],
      'Cozinha Apimentada': [
        ['Ensopado picante de lentilhas', 'com pimenta-caiena'],
        ['Frango ao curry das especiarias do sul', 'trazidas por mercadores'],
        ['Costeleta grelhada', 'com molho de pimenta vermelha'],
        ['Sopa apimentada de gengibre e alho', 'esquenta até o osso'],
        ['Arroz temperado', 'com açafrão e pimenta'],
        ['Peixe ao molho picante', 'servido com pão']
      ],
      'Doces e Confeitaria': [
        ['Torta de maçã com canela', 'ainda morna'],
        ['Bolo de mel e nozes', 'receita da casa'],
        ['Pudim de leite', 'com calda de caramelo'],
        ['Biscoitos amanteigados', 'recheados com geleia'],
        ['Pão doce recheado', 'com frutas secas'],
        ['Creme de baunilha', 'polvilhado com canela']
      ],
      'Caça e Assados': [
        ['Veado assado', 'com molho de frutas vermelhas'],
        ['Coelho ensopado', 'com ervas do campo'],
        ['Faisão assado', 'recheado com castanhas'],
        ['Javali defumado', 'com batatas assadas'],
        ['Perdiz grelhada', 'com mel silvestre'],
        ['Carne de urso curada', 'servida em finas fatias']
      ],
      'Cozinha do Campo': [
        ['Sopa de abóbora', 'com sementes torradas'],
        ['Torta de legumes da horta', 'da estação'],
        ['Queijo curado', 'com pão de fermentação natural'],
        ['Salada de raízes', 'com azeite de ervas'],
        ['Risoto de cogumelos silvestres', 'colhidos por perto'],
        ['Lentilhas guisadas', 'com alho-poró']
      ],
      'Peixes de Rio': [
        ['Truta grelhada na brasa', 'com ervas'],
        ['Caldo de peixe de água doce', 'com batatas'],
        ['Enguia defumada', 'servida fatiada'],
        ['Carpa assada', 'com limão e manteiga'],
        ['Peixe frito à moda da casa', 'crocante por fora'],
        ['Sopa cremosa de peixe do rio', 'espessa e quente']
      ],
      'Comida Exótica': [
        ['Ensopado de especiarias raras', 'vindas de terras distantes'],
        ['Carne marinada em molho de sabor desconhecido', 'ninguém pergunta a receita'],
        ['Frutas confitadas', 'trazidas por mercadores itinerantes'],
        ['Prato defumado com incenso comestível', 'dizem que abre o apetite'],
        ['Guisado picante de origem incerta', 'polêmico entre os fregueses'],
        ['Pão especiado', 'com manteiga de ervas exóticas']
      ]
    };
    const especialidades = Object.keys(ESPECIALIDADES);

    const BEBIDAS = [
      ['Cerveja escura da casa', 'encorpada, tira o fôlego de quem não está acostumado'],
      ['Vinho tinto da região', 'seco, envelhecido em barril'],
      ['Hidromel dourado', 'doce, guardado em jarros de barro'],
      ['Cidra de maçã fresca', 'leve, gelada quando possível'],
      ['Chá de ervas da montanha', 'servido quente'],
      ['Destilado forte da casa', 'ninguém sabe do que é feito'],
      ['Vinho branco leve', 'servido bem gelado'],
      ['Suco de frutas silvestres', 'sem álcool, pros mais jovens']
    ];

    const NOMES = [
      { n: 'Coruja', g: 'f' }, { n: 'Adaga', g: 'f' }, { n: 'Chama', g: 'f' }, { n: 'Serpente', g: 'f' },
      { n: 'Bruma', g: 'f' }, { n: 'Maré', g: 'f' }, { n: 'Lua', g: 'f' }, { n: 'Ventania', g: 'f' },
      { n: 'Corvo', g: 'm' }, { n: 'Punhal', g: 'm' }, { n: 'Barril', g: 'm' }, { n: 'Machado', g: 'm' },
      { n: 'Javali', g: 'm' }, { n: 'Cavalo', g: 'm' }, { n: 'Escudo', g: 'm' }, { n: 'Dragão', g: 'm' }
    ];
    const ADJ = {
      f: ['Sonolenta', 'Dourada', 'Silenciosa', 'Cinzenta', 'Trêmula', 'Errante', 'Fiel', 'Sussurrante', 'Encharcada', 'Desdentada'],
      m: ['Sonolento', 'Dourado', 'Silencioso', 'Cinzento', 'Trêmulo', 'Errante', 'Fiel', 'Sussurrante', 'Encharcado', 'Desdentado']
    };
    const ATMOSFERA = [
      'O teto baixo junta a fumaça da lareira num véu que nunca se desfaz.',
      'Um trio toca no canto, mais alto que as conversas ao redor.',
      'As mesas rangem, o chão é pegajoso, e ninguém parece se importar.',
      'Silêncio educado: aqui se fala baixo e se bebe devagar.',
      'Um mapa desenhado no próprio balcão marca as rotas mais seguras da região.',
      'O dono cumprimenta cada cliente pelo nome, mesmo os que só passaram uma vez.',
      'Há mais gente jogando cartas do que bebendo.',
      'Cheiro de comida fresca disputa espaço com o de bebida derramada.',
      'Uma gaiola no canto guarda um corvo que repete frases dos fregueses.',
      'As paredes têm marcas de faca — um jogo local que ninguém quer explicar.',
      'A luz vem só das velas; nas noites de lua cheia, dizem, apagam todas.',
      'Um cão velho dorme atravessado na entrada e ninguém se atreve a movê-lo.'
    ];
    const HUMOR = {
      m: ['caloroso', 'rabugento', 'desconfiado', 'animado', 'cansado', 'solene', 'brincalhão', 'orgulhoso'],
      f: ['calorosa', 'rabugenta', 'desconfiada', 'animada', 'cansada', 'solene', 'brincalhona', 'orgulhosa']
    };
    const AJUDANTE_PAPEL = ['garçom(onete)', 'cozinheiro(a)', 'segurança', 'lavador(a) de pratos', 'menestrel de plantão', 'estalajadeiro(a) júnior'];

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const racas = Object.keys(RACAS_NOMES);

    function nomeTaverna(){
      if(Math.random() < 0.3){
        const a = pick(NOMES), b = pick(NOMES.filter(x => x.n !== a.n));
        return `${a.g === 'f' ? 'A' : 'O'} ${a.n} e ${b.g === 'f' ? 'a' : 'o'} ${b.n}`;
      }
      const a = pick(NOMES);
      return `${a.g === 'f' ? 'A' : 'O'} ${a.n} ${pick(ADJ[a.g])}`;
    }
    function nomePessoa(raca, genero){ return pick(RACAS_NOMES[raca][genero]); }
    function precoVariado([base, unidade]){
      const mult = pick([0.75, 1, 1, 1.25, 1.5]);
      return `${Math.max(1, Math.round(base * mult))} ${unidade}`;
    }
    function semRepetir(arr, n){
      const copia = [...arr];
      const out = [];
      for(let i = 0; i < n && copia.length; i++) out.push(copia.splice(Math.floor(Math.random() * copia.length), 1)[0]);
      return out;
    }

    el.innerHTML = `
      <div class="notes__foot" style="flex-wrap:wrap">
        <select class="field" style="width:auto" data-f="tier">
          <option value="">Tipo: aleatório</option>
          ${tiers.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <select class="field" style="width:auto" data-f="especialidade">
          <option value="">Menu: aleatório</option>
          ${especialidades.map(e => `<option value="${e}">${e}</option>`).join('')}
        </select>
        <select class="field" style="width:auto" data-f="ajudantes">
          <option value="">Ajudantes: aleatório</option>
          ${[1, 2, 3, 4, 5].map(n => `<option value="${n}">${n} ajudante${n > 1 ? 's' : ''}</option>`).join('')}
        </select>
        <select class="field" style="width:auto" data-f="raca">
          <option value="">Raça do taverneiro(a): aleatória</option>
          ${racas.map(r => `<option value="${r}">${r}</option>`).join('')}
        </select>
        <select class="field" style="width:auto" data-f="genero">
          <option value="">Sexo do taverneiro(a): aleatório</option>
          <option value="f">Feminino</option>
          <option value="m">Masculino</option>
        </select>
        <select class="field" style="width:auto" data-f="humor">
          <option value="">Humor do taverneiro(a): aleatório</option>
          ${HUMOR.m.map((_, i) => `<option value="${i}">${HUMOR.m[i][0].toUpperCase() + HUMOR.m[i].slice(1)}(a)</option>`).join('')}
        </select>
      </div>
      <div class="gen__result"><p class="gen__empty">Clique em "Gerar" para sortear uma taverna.</p></div>
      <div class="notes__foot" style="flex-wrap:wrap">
        <button class="btn btn--primary btn--sm" data-act="gerar">Gerar</button>
        <button class="btn btn--sm" data-act="copiar">Copiar</button>
        <button class="btn btn--sm" data-act="limpar">Limpar</button>
        <span class="notes__status"></span>
      </div>`;
    const fTier = el.querySelector('[data-f="tier"]');
    const fEsp = el.querySelector('[data-f="especialidade"]');
    const fAjud = el.querySelector('[data-f="ajudantes"]');
    const fRaca = el.querySelector('[data-f="raca"]');
    const fGenero = el.querySelector('[data-f="genero"]');
    const fHumor = el.querySelector('[data-f="humor"]');
    const result = el.querySelector('.gen__result');
    const status = el.querySelector('.notes__status');
    let ultimoTexto = '';

    function itemLinha(nome, desc, preco){
      return `<div class="search__item" style="cursor:default">
        <div class="search__title">${escapeHtml(nome)}</div>
        <p class="search__snip">${escapeHtml(desc)} · <b class="c-ouro">${preco}</b></p>
      </div>`;
    }

    function gerar(){
      const tierNome = fTier.value || pick(tiers);
      const tier = TIERS[tierNome];
      const espNome = fEsp.value || pick(especialidades);
      const nAjud = +(fAjud.value || pick([1, 2, 3, 4, 5]));
      const racaTav = fRaca.value || pick(racas);
      const generoTav = fGenero.value || pick(['f', 'm']);
      const humorIdx = fHumor.value !== '' ? +fHumor.value : Math.floor(Math.random() * HUMOR.m.length);

      const nome = nomeTaverna();
      const atm = pick(ATMOSFERA);
      const taverneiro = nomePessoa(racaTav, generoTav);
      const humor = HUMOR[generoTav][humorIdx];
      const ajudantes = Array.from({ length: nAjud }, () => {
        const raca = pick(racas), genero = pick(['f', 'm']);
        return { nome: nomePessoa(raca, genero), raca, papel: pick(AJUDANTE_PAPEL) };
      });
      const pratos = semRepetir(ESPECIALIDADES[espNome], Math.min(tier.pratos, ESPECIALIDADES[espNome].length))
        .map(([n, d]) => ({ nome: n, desc: d, preco: precoVariado(tier.prato) }));
      const bebidas = semRepetir(BEBIDAS, Math.min(tier.pratos, BEBIDAS.length))
        .map(([n, d]) => ({ nome: n, desc: d, preco: precoVariado(tier.bebida) }));

      result.innerHTML = `
        <p class="gen__name">${escapeHtml(nome)}</p>
        <p class="gen__line">${escapeHtml(atm)}</p>
        <p class="gen__line"><b>Tipo:</b> ${tierNome} · <b>Cozinha:</b> ${espNome}</p>
        <p class="gen__line"><b>Hospedagem (por dia):</b> <b class="c-ouro">${tier.hospedagem}</b></p>
        <p class="gen__line"><b>Taverneiro(a):</b> ${escapeHtml(taverneiro)} — ${racaTav} (${generoTav === 'f' ? 'fem.' : 'masc.'}), ${humor}</p>
        <p class="gen__line"><b>Ajudantes:</b> ${ajudantes.map(a => `${escapeHtml(a.nome)} (${a.raca}, ${a.papel})`).join(', ')}</p>
        <div class="existing__group" style="padding-left:0">Cardápio de pratos</div>
        <div class="search__results" style="flex:none">${pratos.map(p => itemLinha(p.nome, p.desc, p.preco)).join('')}</div>
        <div class="existing__group" style="padding-left:0">Cardápio de bebidas</div>
        <div class="search__results" style="flex:none">${bebidas.map(b => itemLinha(b.nome, b.desc, b.preco)).join('')}</div>`;

      ultimoTexto = `${nome}\n${atm}\nTipo: ${tierNome} · Cozinha: ${espNome}\n`
        + `Hospedagem (por dia): ${tier.hospedagem}\n`
        + `Taverneiro(a): ${taverneiro} — ${racaTav} (${generoTav === 'f' ? 'fem.' : 'masc.'}), ${humor}\n`
        + `Ajudantes: ${ajudantes.map(a => `${a.nome} (${a.raca}, ${a.papel})`).join(', ')}\n`
        + `Pratos:\n${pratos.map(p => `- ${p.nome} (${p.desc}) — ${p.preco}`).join('\n')}\n`
        + `Bebidas:\n${bebidas.map(b => `- ${b.nome} (${b.desc}) — ${b.preco}`).join('\n')}`;
      status.textContent = '';
    }
    function limpar(){
      result.innerHTML = '<p class="gen__empty">Clique em "Gerar" para sortear uma taverna.</p>';
      fTier.value = ''; fEsp.value = ''; fAjud.value = ''; fRaca.value = ''; fGenero.value = ''; fHumor.value = '';
      ultimoTexto = '';
      status.textContent = '';
    }
    el.querySelector('[data-act="gerar"]').addEventListener('click', gerar);
    el.querySelector('[data-act="limpar"]').addEventListener('click', limpar);
    el.querySelector('[data-act="copiar"]').addEventListener('click', async () => {
      if(!ultimoTexto) return;
      try{ await navigator.clipboard.writeText(ultimoTexto); status.textContent = 'copiado!'; }
      catch(_){ status.textContent = 'não consegui copiar'; }
      setTimeout(() => { status.textContent = ''; }, 1800);
    });
  }
});
