/* 5) Calculadora de Preços de Serviços — aguardando a tabela de preços (o
   Danilo vai passar um exemplo de conta já feita na mesa). O card já existe na
   grade desde o primeiro dia, só sem lógica ainda. */
TOOLS.push({
  id: 'prices',
  title: 'Preços de Serviços',
  icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v10M9 10h4.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3h4.5"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
    el.innerHTML = `
      <div class="empty-tool">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9h4a2 2 0 0 1 0 4H9m0 0h5m-5 0v3m0-7V6"/></svg>
        <p>Aguardando a tabela de preços.</p>
        <p style="font-size:.82rem">Me dê um exemplo de conta já feita e eu monto a calculadora.</p>
      </div>`;
  }
});
