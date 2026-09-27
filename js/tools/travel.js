/* 3) Calculadora de Tempo de Viagem — tabela de km/dia por meio de viagem e
   ritmo (fornecida pelo Danilo). dias = distância ÷ km-por-dia. */
TOOLS.push({
  id: 'travel',
  title: 'Tempo de Viagem',
  icon: '<svg viewBox="0 0 24 24"><path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
    const TABELA = {
      'A pé':                { lento: 40, normal: 50, rapido: 60 },
      'Montaria ruim':       { lento: 40, normal: 50, rapido: 60 },
      'Montaria normal':     { lento: 50, normal: 60, rapido: 70 },
      'Montaria boa':        { lento: 55, normal: 70, rapido: 85 },
      'Montaria excepcional':{ lento: 65, normal: 80, rapido: 95 },
      'Carroça ruim':        { lento: 30, normal: 40, rapido: 50 },
      'Carroça normal':      { lento: 40, normal: 50, rapido: 60 },
      'Carroça boa':         { lento: 50, normal: 60, rapido: 70 },
      'Barco ruim':          { lento: 30, normal: 40, rapido: 50 },
      'Barco normal':        { lento: 50, normal: 60, rapido: 70 },
      'Barco bom':           { lento: 65, normal: 80, rapido: 95 },
      'Navio excelente':     { lento: 80, normal: 100, rapido: 120 }
    };
    const meios = Object.keys(TABELA);

    el.innerHTML = `
      <div class="notes__foot" style="flex-wrap:wrap">
        <select class="field" style="width:auto" data-f="meio">
          ${meios.map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <select class="field" style="width:auto" data-f="ritmo">
          <option value="lento">Lento</option>
          <option value="normal" selected>Normal</option>
          <option value="rapido">Rápido</option>
        </select>
        <input class="field" style="width:6rem" type="number" min="0" step="1" data-f="distancia" placeholder="km">
      </div>
      <div class="gen__result"><p class="gen__empty">Informe a distância para calcular.</p></div>`;
    const fMeio = el.querySelector('[data-f="meio"]');
    const fRitmo = el.querySelector('[data-f="ritmo"]');
    const fDist = el.querySelector('[data-f="distancia"]');
    const result = el.querySelector('.gen__result');

    function calcular(){
      const distancia = parseFloat(fDist.value);
      if(!distancia || distancia <= 0){
        result.innerHTML = '<p class="gen__empty">Informe a distância para calcular.</p>';
        return;
      }
      const kmDia = TABELA[fMeio.value][fRitmo.value];
      const dias = distancia / kmDia;
      const diasInteiros = Math.floor(dias);
      const kmUltimoDia = Math.round((dias - diasInteiros) * kmDia);
      result.innerHTML = `
        <p class="gen__name">${Math.ceil(dias)} ${Math.ceil(dias) === 1 ? 'dia' : 'dias'} de viagem</p>
        <p class="gen__line"><b>${kmDia} km/dia</b> nesse ritmo</p>
        <p class="gen__line">${diasInteiros} ${diasInteiros === 1 ? 'dia cheio' : 'dias cheios'}${kmUltimoDia ? ` + ${kmUltimoDia} km no último dia` : ''}</p>`;
    }
    [fMeio, fRitmo, fDist].forEach(f => f.addEventListener('input', calcular));
    calcular();
  }
});
