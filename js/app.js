/* Escudo de Kauntar — login (mesma conta do Mio da Feada) e bootstrap do painel. */
const gate = document.getElementById('gateScreen');
const painel = document.getElementById('painelScreen');

document.getElementById('gateForm').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('gateMsg');
  const btn = document.getElementById('gateSubmit');
  msg.textContent = '';
  btn.disabled = true;
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: document.getElementById('gateEmail').value.trim(),
    password: document.getElementById('gatePassword').value
  });
  btn.disabled = false;
  if(error){ msg.textContent = 'Não consegui entrar: ' + error.message; return; }
  showPainel();
});

document.getElementById('btnLogout').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  location.reload();
});

let painelReady = false;
async function showPainel(){
  gate.hidden = true;
  painel.hidden = false;
  if(painelReady) return;
  painelReady = true;
  await Grid.init(document.getElementById('grid'), TOOLS);
}

(async function start(){
  const { data } = await supabaseClient.auth.getSession();
  if(data.session) showPainel();
  else gate.hidden = false;
})();
