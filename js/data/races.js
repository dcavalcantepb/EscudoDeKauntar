/* Nomes por raça e gênero — extraído do Gerador de NPCs pra ser reaproveitado
   também pelo gerador de taverneiro/ajudantes (card Taverna). Um só lugar pra
   manter (ou acrescentar raças) em vez de duas listas divergindo com o tempo. */
const RACAS_NOMES = {
  'Humano': { f: ['Ilda', 'Mira', 'Selena', 'Branca', 'Teodora', 'Alix'], m: ['Bram', 'Teodo', 'Ossian', 'Renar', 'Ualdo', 'Corvin'] },
  'Elfo': { f: ['Ythiel', 'Sael', 'Nimlath', 'Ilyra', 'Vaelis', 'Aerin'], m: ['Thaelor', 'Ithran', 'Vaelis', 'Sylan', 'Ordhan', 'Faelin'] },
  'Anão': { f: ['Brynhild', 'Dagna', 'Torvi', 'Helga', 'Runa', 'Gerda'], m: ['Thorik', 'Balgrim', 'Durnan', 'Orsik', 'Kazgar', 'Brondar'] },
  'Halfling': { f: ['Rosa', 'Mel', 'Tansy', 'Nola', 'Bree', 'Lila'], m: ['Toby', 'Pip', 'Mero', 'Wilbo', 'Finn', 'Otho'] },
  'Meio-Elfo': { f: ['Selanwe', 'Dara', 'Ilyanna', 'Marel', 'Yvaine', 'Sorel'], m: ['Aramel', 'Doran', 'Kestrel', 'Ivarel', 'Sael', 'Bren'] },
  'Orc': { f: ['Ghorza', 'Uluka', 'Nagra', 'Zasha', 'Mogra', 'Vurka'], m: ['Gorrath', 'Uzgul', 'Thokk', 'Vraggar', 'Mogul', 'Kazdak'] },
  'Draconato': { f: ['Sthara', 'Ixara', 'Mishaka', 'Perascis', 'Thava', 'Nala'], m: ['Balasar', 'Kriv', 'Rhogar', 'Torinn', 'Shamash', 'Vrondir'] },
  'Tiefling': { f: ['Akta', 'Damaia', 'Ligeia', 'Orianna', 'Sairche', 'Zariel'], m: ['Akmenos', 'Barrakas', 'Ekemon', 'Iados', 'Mordai', 'Rakis'] },
  'Meio-Orc': { f: ['Baggi', 'Emen', 'Kansif', 'Myev', 'Neega', 'Vola'], m: ['Dench', 'Feng', 'Holg', 'Krusk', 'Ront', 'Thokk'] },
  /* Sem gênero biológico — o mesmo grupo de nomes serve pra "f" e "m" (nomes
     curtos e evocativos, ao gosto do Eberron: virtudes, funções, numerais). */
  'Warforged': { f: ['Cinza', 'Sino', 'Prisma', 'Sortudo', 'Nove', 'Valente'], m: ['Cinza', 'Sino', 'Prisma', 'Sortudo', 'Nove', 'Valente'] }
  /* Tangata: não achei uma raça oficial de D&D/Pathfinder com esse nome — deve
     ser algo do seu material de mesa. Deixei de fora até você me passar como
     são os nomes lá (ou a fonte), pra não inventar errado. */
};
