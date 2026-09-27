/* Taverna — preços de hospedagem, comida e bebida. Aguardando a tabela: o site
   de origem (thievesguild.cc) está atrás de uma proteção da Cloudflare que
   bloqueia leitura automática; precisa ser colado à mão, como a de viagem. */
TOOLS.push({
  id: 'tavernprices',
  title: 'Taverna',
  icon: '<svg viewBox="0 0 24 24"><path d="M6 8h9v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M15 10h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/></svg>',
  defaultW: 1, defaultH: 1,
  mount(el){
    el.innerHTML = `
      <div class="empty-tool">
        <svg viewBox="0 0 24 24"><path d="M3 9h18M6 9V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/></svg>
        <p>Aguardando a tabela de preços.</p>
        <p style="font-size:.82rem">O site de origem está bloqueado por proteção anti-robô; cole a tabela aqui como fez com a de viagem.</p>
      </div>`;
  }
});
