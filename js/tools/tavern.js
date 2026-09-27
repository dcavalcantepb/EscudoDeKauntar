/* 4) Gerador Rápido de Tavernas — um clique e sai nome, atmosfera, especialidade
   da casa, um NPC notável e um rumor/gancho para jogar em cima. Puramente
   client-side (listas de palavras combinadas na hora). */
TOOLS.push({
  id: 'tavern',
  title: 'Gerador de Tavernas',
  icon: '<svg viewBox="0 0 24 24"><path d="M6 8h9v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M15 10h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M8 4c0 1-1 1-1 2s1 1 1 2M12 4c0 1-1 1-1 2s1 1 1 2"/></svg>',
  defaultW: 2, defaultH: 2,
  mount(el){
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
      'O teto baixo junta a fumaça do lareira num véu que nunca se desfaz.',
      'Um trio toca no canto, mais alto que as conversas ao redor.',
      'As mesas rangem, o chão é pegajoso, e ninguém parece se importar.',
      'Silêncio educado: aqui se fala baixo e se bebe devagar.',
      'Um mapa desenhado no próprio balcão marca as rotas mais seguras da região.',
      'O dono cumprimenta cada cliente pelo nome, mesmo os que só passaram uma vez.',
      'Há mais gente jogando cartas do que bebendo.',
      'Cheiro de pão fresco disputa espaço com o de cerveja derramada.',
      'Uma gaiola no canto guarda um corvo que repete frases dos fregueses.',
      'As paredes têm marcas de faca — um jogo local que ninguém quer explicar.',
      'A luz vem só das velas; nas noites de lua cheia, dizem, apagam todas.',
      'Um cão velho dorme atravessado na entrada e ninguém se atreve a movê-lo.'
    ];
    const ESPECIALIDADE = [
      'ensopado de carne curada com cerveja escura', 'pão de centeio recheado com queijo derretido',
      'vinho quente com especiarias raras', 'um destilado forte que o dono não revela a receita',
      'sopa de raízes que muda de sabor conforme a estação', 'peixe defumado servido com pão duro',
      'hidromel guardado em barris de carvalho antigo', 'torta de caça com crosta amanteigada',
      'cerveja escura de fermentação lenta, orgulho da casa', 'um chá forte que os locais juram curar ressaca',
      'costela assada na brasa a noite toda', 'queijo curado envolto em cinzas de ervas'
    ];
    const PROFISSAO = ['ex-mercenário', 'antigo marinheiro', 'curandeira aposentada', 'ex-guarda da cidade', 'contador de histórias itinerante', 'caçador de recompensas cansado', 'viúva de um comerciante', 'ferreiro nas horas vagas', 'ex-membro de uma seita esquecida', 'jogador profissional falido'];
    const TRACO = ['nunca tira as luvas', 'lembra de tudo que já ouviu, palavra por palavra', 'só fala em rimas quando bebe', 'tem um olho de vidro que "vê mais do que devia"', 'guarda uma arma velha debaixo do balcão', 'sabe o nome de todo espião que já passou por ali', 'não aceita moedas de prata, só ouro ou troca', 'conta a mesma história de forma diferente toda vez', 'observa tudo e comenta pouco', 'ri de qualquer ameaça, o que assusta mais que convencer'];
    const RUMOR = [
      'Um cliente regular sumiu há três dias, e ninguém quer falar sobre isso.',
      'Dizem que o porão guarda algo que não é da casa — e que o dono paga bem para ninguém descer lá.',
      'Um forasteiro anda pagando bem por informações sobre uma "porta que não deveria existir".',
      'As entregas de bebida atrasaram: a estrada que o fornecedor usa foi fechada por algo que ninguém explica.',
      'Um dos fregueses aposta que consegue provar que o dono não é humano.',
      'Alguém deixou uma carta lacrada no balcão pedindo para ser entregue "à pessoa certa" — ainda ninguém a reclamou.',
      'Uma disputa antiga entre duas famílias locais está prestes a estourar dentro destas paredes.',
      'Os moradores evitam a mesa do canto: o último grupo que se sentou lá não voltou mais à cidade.',
      'Um mapa surgiu embrulhado num guardanapo — ninguém sabe quem o deixou, nem para onde ele leva.',
      'Uma recompensa foi anunciada, e o alvo pode estar bebendo a poucos passos de você agora mesmo.',
      'O dono está devendo a alguém perigoso, e o prazo vence esta semana.',
      'Uma criança jura ter visto luzes estranhas saindo da chaminé, tarde da noite.'
    ];

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    function nome(){
      if(Math.random() < 0.3){
        const a = pick(NOMES), b = pick(NOMES.filter(x => x.n !== a.n));
        return `${a.g === 'f' ? 'A' : 'O'} ${a.n} e ${b.g === 'f' ? 'a' : 'o'} ${b.n}`;
      }
      const a = pick(NOMES);
      return `${a.g === 'f' ? 'A' : 'O'} ${a.n} ${pick(ADJ[a.g])}`;
    }

    el.innerHTML = `
      <div class="gen__result"><p class="gen__empty">Clique em "Gerar" para sortear uma taverna.</p></div>
      <div class="notes__foot">
        <button class="btn btn--primary btn--sm" data-act="gerar">Gerar</button>
        <button class="btn btn--sm" data-act="copiar">Copiar</button>
        <span class="notes__status"></span>
      </div>`;
    const result = el.querySelector('.gen__result');
    const status = el.querySelector('.notes__status');
    let ultimoTexto = '';

    function gerar(){
      const n = nome(), atm = pick(ATMOSFERA), esp = pick(ESPECIALIDADE), prof = pick(PROFISSAO), traco = pick(TRACO), rumor = pick(RUMOR);
      result.innerHTML = `
        <p class="gen__name">${escapeHtml(n)}</p>
        <p class="gen__line">${escapeHtml(atm)}</p>
        <p class="gen__line"><b>Especialidade:</b> ${escapeHtml(esp)}</p>
        <p class="gen__line"><b>NPC notável:</b> ${escapeHtml(prof)}, ${escapeHtml(traco)}.</p>
        <p class="gen__line"><b>Rumor:</b> ${escapeHtml(rumor)}</p>`;
      ultimoTexto = `${n}\n${atm}\nEspecialidade: ${esp}\nNPC notável: ${prof}, ${traco}.\nRumor: ${rumor}`;
      status.textContent = '';
    }
    el.querySelector('[data-act="gerar"]').addEventListener('click', gerar);
    el.querySelector('[data-act="copiar"]').addEventListener('click', async () => {
      if(!ultimoTexto) return;
      try{ await navigator.clipboard.writeText(ultimoTexto); status.textContent = 'copiado!'; }
      catch(_){ status.textContent = 'não consegui copiar'; }
      setTimeout(() => { status.textContent = ''; }, 1800);
    });
  }
});
