# Escudo de Kauntar

Painel pessoal do Mestre para as Lendas de Netéria: oito ferramentas rápidas
numa grade de cards, cada uma no tamanho que você quiser, em qualquer posição
livre da grade. Site estático (HTML + CSS + JS puro, sem build), hospedado no
GitHub Pages, com a mesma identidade visual do
[Mio da Feada](https://github.com/dcavalcantepb/mio_Da_Feada) — mas, ao
contrário dele, **é um painel privado**: a página inteira fica atrás de login,
não só o editor.

## As oito ferramentas

| # | Ferramenta | Estado |
|---|---|---|
| 1 | **Contador de Palavras** (para a Sending e outros textos curtos) | Pronta |
| 2 | **Bloco de Notas** com abas, ao estilo OneNote | Pronta |
| 3 | **Tempo de Viagem** | Pronta |
| 4 | **Equipamentos** — busca de preços (armas, armaduras, montarias…) | Pronta |
| 5 | **Serviços** (inclui mágicos) — busca de preços + conjuração | Pronta |
| 6 | **Taverna** — gera taverna, cardápio, taverneiro(a) e ajudantes | Pronta |
| 7 | **Gerador de NPCs** | Pronta (8 raças, +Meio-Orc e Warforged) |
| 8 | **Buscar na Base do Mio da Feada** | Pronta |

Preços de itens/serviços viraram **cards separados** por pedido do Danilo
(Equipamentos ≠ Serviços ≠ Taverna). O antigo "Gerador de Tavernas" (uma
ferramenta própria) foi fundido dentro do card Taverna — não faziam sentido
como dois cards separados, um só de nome e outro só de preço.

### Equipamentos

225 itens (armas, armaduras, montarias, ferramentas, instrumentos, arreios,
barda…), com três faixas de preço — **Normal/Baixo/Alto** — cada item. Vem da
lista de equipamento de aventureiro que o Danilo passou (em libras/gp-sp-cp);
traduzi os nomes pro português (mantive em inglês só os poucos instrumentos que
não são do time padrão do PHB, tipo "Glaur" e "Wargong" — não são nomes reais
com tradução conhecida) e **converti o peso pra quilos**. Busca com filtro por
categoria, igual ao card Buscar na Base do Mio da Feada.

### Serviços

Busca com filtro por categoria, igual a Equipamentos — referência que o Danilo
passou (Carruagem entre/dentro de cidades, Passagem de Navio, Pedágio,
Contratado Especializado/Sem Treinamento, Mensageiro), convertida pra po/pp/pc.
Acima da lista, um calculador separado pra conjuração: a regra oficial **não
tem preço fixo por magia**, e sim uma fórmula por nível do espaço usado,
**10 po × nível²** (é assim que o próprio PHB chega nos ~20 exemplos que
lista). Preferi a fórmula a copiar só os exemplos do livro: cobre qualquer
magia que pedirem, não só as que o PHB escolheu ilustrar. Exceção conhecida:
Identificar custa 20 po (o dobro, por causa do componente de pérola) — fica
anotada no card.

### Taverna

Um gerador completo — fundiu o antigo "Gerador de Tavernas" pra dentro deste
card, por pedido do Danilo. Cabeçalho com 6 seletores (tipo de hospedagem,
especialidade da cozinha, número de ajudantes, raça/sexo/humor do
taverneiro(a); tudo com opção "aleatório"); ao clicar em **Gerar**, o card
mostra nome da taverna, uma descrição breve (sem rumores — o Danilo cria os
dele), o taverneiro(a) e os ajudantes (raça/nome sorteados da mesma tabela do
Gerador de NPCs — ver `js/data/races.js`), e dois cardápios com preço:
**pratos** (10 especialidades de cozinha à escolha, de Alta Cozinha a Comida
Exótica) e **bebidas** (uma lista só, não varia por especialidade). O tipo de
hospedagem controla quantos itens o cardápio tem — de 1 (Miserável) a 5
(Rica/Aristocrática).

Preço de prato/bebida **não é um número oficial**: o PHB só lista o preço de
"uma refeição por dia" por nível de hospedagem (tabela "Food, Drink, and
Lodging"), não o de um prato avulso — uso esse valor oficial como base e vario
um pouco por item, pra dar alguma diversidade de preço dentro do mesmo
cardápio. Se isso não for o que você queria, me avisa que ajusto a régua.

### Tempo de Viagem

Tabela fixa de km/dia por meio de viagem (12 opções, de "A pé" a "Navio
excelente") × ritmo (Lento/Normal/Rápido), fornecida pelo Danilo. Resultado em
**dias e horas** (para de mostrar minutos): `dias = distância ÷ km-por-dia`, e a
fração do dia vira hora assumindo **8h de viagem por dia** — o padrão de D&D.
A tabela só dá km por *dia*, então essa duração não dá pra descobrir só olhando
os números; se a mesa usa outra, é a constante `HORAS_POR_DIA` no topo de
`js/tools/travel.js`.

### Gerador de NPCs

8 raças originais + **Meio-Orc** e **Warforged**. Não achei uma raça de
D&D/Pathfinder chamada **Tangata** nem sub-raças oficiais para essas três, então
deixei de fora por enquanto — para não inventar nomes que destoem do que você já
usa em Netéria. Warforged usa o mesmo grupo de nomes para os dois gêneros
(não tem gênero biológico).

## A grade de cards

Posição **livre de verdade**: cada card mora numa célula `(x, y)` — coluna e
linha — escolhida por você ao arrastar, igual ladrilhos do Windows. Não existe
"ordem" nenhuma por trás: dois cards podem ficar longe um do outro, com buracos
de sobra no meio, e cada um guarda a própria posição (não a posição de quem
veio antes dele). Foi uma correção explícita de rumo — a primeira versão só
deixava reordenar sequencialmente (com ou sem `grid-auto-flow: dense`), e não
era isso que o Danilo queria.

- **Arraste o cabeçalho** de um card para qualquer célula livre da grade — a
  prévia (contorno tracejado) fica roxa numa célula livre e vermelha se
  sobrepor outro card; soltar em cima de uma célula ocupada não faz nada.
- O **ícone de canto** (↔) abre uma gradinha, no estilo "inserir tabela" do
  Word: clique numa célula para escolher quantas colunas × linhas o card ocupa
  (até 4×3). Combinações que sobreporiam um vizinho aparecem desabilitadas —
  o redimensionamento respeita a mesma regra de não-sobreposição do arrastar.
- A grade tem sempre **6 colunas fixas**, esticadas pra usar a largura toda da
  tela — por isso não é "responsiva" no número de colunas (o alvo é
  computador); isso também mantém as posições `(x, y)` salvas válidas
  independente do tamanho da janela.
- A disposição é salva sozinha, no navegador (`localStorage`) e, como reforço,
  também no Supabase (tabela `escudo_layout`) — sem pressa de sincronizar entre
  aparelhos, já que o uso é majoritariamente num computador só.
- Focado em computador: a grade ainda funciona numa tela estreita, mas não foi
  desenhada pensando nela primeiro (ao contrário do Mio da Feada). Nota: a
  reescrita pra posição livre derrubou, como efeito colateral (não uma decisão
  deliberada), o ajuste específico que existia pra telas muito estreitas
  (abaixo de 560px) — não chegou a ser reavaliado ainda.

(A ideia de um "+ Espaço vazio" — um card em branco só pra abrir respiro —
existiu numa versão anterior e foi removida: com posição livre de verdade,
deixar uma célula vazia já é natural, não precisa de um card fantasma pra
isso.)

## Bloco de Notas

Cada aba é uma nota guardada em `escudo_notas` (privada — nem o Supabase deixa
um visitante ler). O campo de texto tem a mesma barra de formatação do Mio da
Feada (negrito, cor, listas, alinhamento…), reaproveitada de
`18-MioDaFeada/js/toolbar.js`, sem o sistema de menções `[[Nome]]` (não faz
sentido num bloco de notas pessoal) nem o spoiler (não há leitor para esconder
algo de você mesmo). Salva sozinho, sem botão de salvar — o rodapé mostra
"salvando…" / "salvo". O botão **Prévia** troca para o texto formatado.

## Buscar na Base do Mio da Feada

Lê as tabelas `sessoes`, `tomos` e `personagens` do **mesmo** projeto Supabase
do Mio da Feada — não é uma cópia dos dados, é a base de verdade. Como você
entra aqui com a mesma conta de autor, a RLS libera ler os rascunhos também,
não só o que já foi publicado. Cada resultado abre a página correspondente no
site do Mio da Feada, em nova aba.

## Banco de dados (Supabase)

**Não há um projeto Supabase próprio.** O Escudo de Kauntar usa o mesmo
projeto do Mio da Feada (`vvsfzhawmpjmpocutxnx`, organização "Team Neteria"),
com duas tabelas novas:

- `escudo_notas`: `id, created_at, updated_at, title, content, position`
- `escudo_layout`: `id (=1, uma linha só), layout (jsonb), updated_at`

As duas são **privadas**: RLS restrita ao autor (`autor_tudo`), sem nenhuma
política de leitura pública — diferente das tabelas do Mio da Feada, aqui não
existe visitante. Ver `supabase/schema.sql` (que pressupõe o esquema base do
Mio da Feada já criado) e `18-MioDaFeada/supabase/schema.sql`.

**Backup e restauração:** o backup semanal do Mio da Feada
(`.github/workflows/backup.yml`, no outro repositório) já cobre as duas
tabelas novas, porque é o mesmo projeto — nada precisou ser duplicado aqui.

## Login

O mesmo usuário-autor do Mio da Feada (Supabase Authentication). Não há
cadastro nem "visitante": quem não faz login não vê nada além da tela de
entrada. `js/supabase-client.js` usa a mesma URL e a mesma chave pública do
Mio da Feada (seguras de expor: quem decide são as políticas de RLS).

## Arquivos

```
index.html
css/style.css              paleta "Véu Élfico" (os mesmos tokens do Mio da Feada)
js/supabase-client.js      conexão (mesmo projeto do Mio da Feada)
js/theme.js                tema claro/escuro (mesma chave localStorage do Mio da Feada)
js/richtext.js             escapeHtml, renderMarkdownLite e a barra de texto (trimmed do Mio da Feada)
js/grid.js                 a grade de cards: arrastar, redimensionar, salvar a disposição
js/data/races.js            nomes por raça/gênero — compartilhado entre NPCs e o gerador de Taverna
js/app.js                  login e bootstrap do painel
js/tools/*.js               uma ferramenta por arquivo (cada uma faz TOOLS.push({...}))
favicon.ico, img/favicon-32.png, img/apple-touch-icon.png, img/mascot.png
scripts/gerar-favicon.js    refaz os ícones a partir do mascote (ver 18-MioDaFeada)
supabase/schema.sql         as duas tabelas novas (pressupõe o esquema do Mio da Feada)
```

## Como criar uma ferramenta nova

Cada arquivo em `js/tools/` termina com `TOOLS.push({...})`:

```js
TOOLS.push({
  id: 'minhaferramenta',          // único, vira a chave salva na grade
  title: 'Nome do Card',
  icon: '<svg viewBox="0 0 24 24">…</svg>',
  defaultW: 1, defaultH: 1,        // tamanho de partida (1 a 4 × 1 a 3)
  mount(el){ el.innerHTML = `…`; /* wire events aqui */ }
});
```

`mount()` roda **uma única vez**, na primeira vez que o card aparece — reordenar
ou redimensionar não recria o card, só move ou muda o tamanho do elemento que já
existe, então qualquer estado interno da ferramenta (texto digitado, aba aberta)
nunca se perde. Adicione o `<script src="js/tools/….js">` em `index.html`, antes
de `js/app.js`.
