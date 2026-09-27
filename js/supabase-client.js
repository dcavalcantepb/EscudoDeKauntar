/* Conexão com o Supabase — o MESMO projeto do Mio da Feada (Team Neteria).
   O Escudo de Kauntar ganhou tabelas novas e privadas nesse projeto
   (escudo_notas, escudo_layout) em vez de um projeto à parte; a busca (ferramenta
   7) lê as tabelas do próprio Mio da Feada. Só o autor loga aqui; a RLS de cada
   tabela é quem decide o que cada um vê (ver supabase/schema.sql). */

const SUPABASE_URL = 'https://vvsfzhawmpjmpocutxnx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_vcwzrvO9zcPuzLcnykpZwg_-O3qyNEM';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
