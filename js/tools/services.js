/* Serviços (incluindo mágicos) — aguardando a tabela de preços. Separado de
   Equipamentos por pedido do Danilo. */
TOOLS.push({
  id: 'services',
  title: 'Serviços',
  icon: '<svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
    el.innerHTML = `
      <div class="empty-tool">
        <svg viewBox="0 0 24 24"><path d="M4 12h4l2-7 4 14 2-7h4"/></svg>
        <p>Aguardando a tabela de preços.</p>
        <p style="font-size:.82rem">Inclui serviços mágicos (identificar, remover maldição…) e mundanos (curandeiro, aluguel de sala…).</p>
      </div>`;
  }
});
