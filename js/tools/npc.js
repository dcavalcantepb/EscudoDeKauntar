/* 6) Gerador de Nomes de NPC — nome por raça e gênero, com profissão e um traço
   de personalidade, pronto para um NPC improvisado na mesa. */
TOOLS.push({
  id: 'npc',
  title: 'Gerador de NPCs',
  icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
    const RACAS = RACAS_NOMES;
    const EPITETO = ['das Águas Frias', 'o Silencioso', 'a Cicatriz', 'de Netéria', 'o Errante', 'das Sete Portas', 'o Sortudo', 'a Sombra Curta', 'do Vale Fundo', 'o Sem-Nome', null, null, null];
    const PROFISSAO = ['taverneiro(a)', 'mercador(a) de especiarias', 'guarda da cidade', 'ferreiro(a)', 'curandeiro(a)', 'batedor(a) de estrada', 'escrivão(ã)', 'contrabandista', 'caçador(a) de recompensas', 'sacerdote(isa) menor', 'artesão(ã)', 'cocheiro(a)', 'pescador(a)', 'espião(ã) amador(a)'];
    const TRACO = ['fala baixo demais e todos se inclinam para ouvir', 'nunca olha nos olhos de quem está mentindo', 'guarda moedas de todos os lugares que já visitou', 'tem medo de gatos, e não explica por quê', 'lembra o nome de todo mundo, uma vez só', 'está sempre mastigando alguma coisa', 'conta a mesma piada em toda conversa', 'desconfia de qualquer oferta boa demais', 'anota tudo num caderno surrado', 'trata estranhos com uma educação exagerada'];

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const racas = Object.keys(RACAS);

    el.innerHTML = `
      <div class="notes__foot" style="flex-wrap:wrap">
        <select class="field" style="width:auto" data-f="raca">
          <option value="">Raça: aleatória</option>
          ${racas.map(r => `<option value="${r}">${r}</option>`).join('')}
        </select>
        <select class="field" style="width:auto" data-f="genero">
          <option value="">Gênero: aleatório</option>
          <option value="f">Feminino</option>
          <option value="m">Masculino</option>
        </select>
      </div>
      <div class="gen__result"><p class="gen__empty">Clique em "Gerar" para sortear um NPC.</p></div>
      <div class="notes__foot">
        <button class="btn btn--primary btn--sm" data-act="gerar">Gerar</button>
        <button class="btn btn--sm" data-act="copiar">Copiar</button>
        <span class="notes__status"></span>
      </div>`;
    const result = el.querySelector('.gen__result');
    const status = el.querySelector('.notes__status');
    const fRaca = el.querySelector('[data-f="raca"]');
    const fGenero = el.querySelector('[data-f="genero"]');
    let ultimoTexto = '';

    function gerar(){
      const raca = fRaca.value || pick(racas);
      const genero = fGenero.value || pick(['f', 'm']);
      const nome = pick(RACAS[raca][genero]);
      const epiteto = pick(EPITETO);
      const nomeCompleto = epiteto ? `${nome} ${epiteto}` : nome;
      const prof = pick(PROFISSAO), traco = pick(TRACO);
      result.innerHTML = `
        <p class="gen__name">${escapeHtml(nomeCompleto)}</p>
        <p class="gen__line"><b>Raça:</b> ${escapeHtml(raca)} (${genero === 'f' ? 'fem.' : 'masc.'})</p>
        <p class="gen__line"><b>Ofício:</b> ${escapeHtml(prof)}</p>
        <p class="gen__line">${escapeHtml(traco)}.</p>`;
      ultimoTexto = `${nomeCompleto} — ${raca}, ${prof}\n${traco}.`;
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
