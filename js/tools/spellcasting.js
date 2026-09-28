/* Conjuração — quanto custa contratar um conjurador pra lançar uma magia por
   você. Valores oficiais (PHB/SRD 5e): a regra não lista preço fixo por magia,
   e sim uma fórmula por NÍVEL do espaço usado — 10 po × nível² — que é como o
   próprio livro chega nos ~20 exemplos que lista (Cura de Ferimentos nível 1 =
   10 po, Restauração Menor nível 2 = 40 po, e por aí vai). Prefiro a fórmula a
   copiar só os exemplos do livro: cobre qualquer magia que pedirem, não só as
   que o PHB escolheu ilustrar. Card separado de Serviços por pedido do Danilo
   — não é uma lista de preço fixo, então não cabia no formato de busca. */
TOOLS.push({
  id: 'spellcasting',
  title: 'Conjuração',
  icon: '<svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
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
      </div>`;
    const fNivel = el.querySelector('[data-f="nivel"]');
    const custo = el.querySelector('.gen__custo');
    function calcular(){ custo.textContent = `${10 * fNivel.value * fNivel.value} po`; }
    fNivel.addEventListener('input', calcular);
    calcular();
  }
});
