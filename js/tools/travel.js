/* 3) Calculadora de Tempo de Viagem — aguardando a regra de cálculo (o Danilo
   vai passar o método: ritmo, terreno, distância…). O card já existe na grade
   desde o primeiro dia, só sem lógica ainda. */
TOOLS.push({
  id: 'travel',
  title: 'Tempo de Viagem',
  icon: '<svg viewBox="0 0 24 24"><path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
    el.innerHTML = `
      <div class="empty-tool">
        <svg viewBox="0 0 24 24"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="9"/></svg>
        <p>Aguardando a regra de cálculo.</p>
        <p style="font-size:.82rem">Me passe o método e eu monto a conta aqui.</p>
      </div>`;
  }
});
