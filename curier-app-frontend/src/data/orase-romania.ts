// Lista principalelor orașe din România cu județele lor
export interface OrasData {
  oras: string;
  judet: string;
}

export const oraseRomania: OrasData[] = [
  // București
  { oras: 'București', judet: 'București' },
  { oras: 'Sector 1', judet: 'București' },
  { oras: 'Sector 2', judet: 'București' },
  { oras: 'Sector 3', judet: 'București' },
  { oras: 'Sector 4', judet: 'București' },
  { oras: 'Sector 5', judet: 'București' },
  { oras: 'Sector 6', judet: 'București' },
  
  // Alba
  { oras: 'Alba Iulia', judet: 'Alba' },
  { oras: 'Aiud', judet: 'Alba' },
  { oras: 'Blaj', judet: 'Alba' },
  { oras: 'Sebeș', judet: 'Alba' },
  { oras: 'Cugir', judet: 'Alba' },
  
  // Arad
  { oras: 'Arad', judet: 'Arad' },
  { oras: 'Ineu', judet: 'Arad' },
  { oras: 'Lipova', judet: 'Arad' },
  { oras: 'Pecica', judet: 'Arad' },
  
  // Argeș
  { oras: 'Pitești', judet: 'Argeș' },
  { oras: 'Câmpulung', judet: 'Argeș' },
  { oras: 'Curtea de Argeș', judet: 'Argeș' },
  { oras: 'Mioveni', judet: 'Argeș' },
  
  // Bacău
  { oras: 'Bacău', judet: 'Bacău' },
  { oras: 'Onești', judet: 'Bacău' },
  { oras: 'Moinești', judet: 'Bacău' },
  { oras: 'Comănești', judet: 'Bacău' },
  
  // Bihor
  { oras: 'Oradea', judet: 'Bihor' },
  { oras: 'Salonta', judet: 'Bihor' },
  { oras: 'Marghita', judet: 'Bihor' },
  { oras: 'Beiuș', judet: 'Bihor' },
  
  // Bistrița-Năsăud
  { oras: 'Bistrița', judet: 'Bistrița-Năsăud' },
  { oras: 'Năsăud', judet: 'Bistrița-Năsăud' },
  { oras: 'Beclean', judet: 'Bistrița-Năsăud' },
  
  // Botoșani
  { oras: 'Botoșani', judet: 'Botoșani' },
  { oras: 'Dorohoi', judet: 'Botoșani' },
  { oras: 'Săveni', judet: 'Botoșani' },
  
  // Brașov
  { oras: 'Brașov', judet: 'Brașov' },
  { oras: 'Făgăraș', judet: 'Brașov' },
  { oras: 'Săcele', judet: 'Brașov' },
  { oras: 'Codlea', judet: 'Brașov' },
  { oras: 'Zărnești', judet: 'Brașov' },
  { oras: 'Râșnov', judet: 'Brașov' },
  
  // Brăila
  { oras: 'Brăila', judet: 'Brăila' },
  { oras: 'Ianca', judet: 'Brăila' },
  { oras: 'Însurăței', judet: 'Brăila' },
  
  // Buzău
  { oras: 'Buzău', judet: 'Buzău' },
  { oras: 'Râmnicu Sărat', judet: 'Buzău' },
  { oras: 'Nehoiu', judet: 'Buzău' },
  
  // Caraș-Severin
  { oras: 'Reșița', judet: 'Caraș-Severin' },
  { oras: 'Caransebeș', judet: 'Caraș-Severin' },
  { oras: 'Oravița', judet: 'Caraș-Severin' },
  
  // Călărași
  { oras: 'Călărași', judet: 'Călărași' },
  { oras: 'Oltenița', judet: 'Călărași' },
  
  // Cluj
  { oras: 'Cluj-Napoca', judet: 'Cluj' },
  { oras: 'Turda', judet: 'Cluj' },
  { oras: 'Dej', judet: 'Cluj' },
  { oras: 'Câmpia Turzii', judet: 'Cluj' },
  { oras: 'Gherla', judet: 'Cluj' },
  
  // Constanța
  { oras: 'Constanța', judet: 'Constanța' },
  { oras: 'Mangalia', judet: 'Constanța' },
  { oras: 'Medgidia', judet: 'Constanța' },
  { oras: 'Năvodari', judet: 'Constanța' },
  { oras: 'Cernavodă', judet: 'Constanța' },
  { oras: 'Eforie', judet: 'Constanța' },
  
  // Covasna
  { oras: 'Sfântu Gheorghe', judet: 'Covasna' },
  { oras: 'Târgu Secuiesc', judet: 'Covasna' },
  { oras: 'Covasna', judet: 'Covasna' },
  
  // Dâmbovița
  { oras: 'Târgoviște', judet: 'Dâmbovița' },
  { oras: 'Moreni', judet: 'Dâmbovița' },
  { oras: 'Pucioasa', judet: 'Dâmbovița' },
  
  // Dolj
  { oras: 'Craiova', judet: 'Dolj' },
  { oras: 'Băilești', judet: 'Dolj' },
  { oras: 'Calafat', judet: 'Dolj' },
  
  // Galați
  { oras: 'Galați', judet: 'Galați' },
  { oras: 'Tecuci', judet: 'Galați' },
  { oras: 'Târgu Bujor', judet: 'Galați' },
  
  // Giurgiu
  { oras: 'Giurgiu', judet: 'Giurgiu' },
  { oras: 'Bolintin-Vale', judet: 'Giurgiu' },
  
  // Gorj
  { oras: 'Târgu Jiu', judet: 'Gorj' },
  { oras: 'Motru', judet: 'Gorj' },
  { oras: 'Rovinari', judet: 'Gorj' },
  
  // Harghita
  { oras: 'Miercurea Ciuc', judet: 'Harghita' },
  { oras: 'Odorheiu Secuiesc', judet: 'Harghita' },
  { oras: 'Gheorgheni', judet: 'Harghita' },
  { oras: 'Toplița', judet: 'Harghita' },
  
  // Hunedoara
  { oras: 'Deva', judet: 'Hunedoara' },
  { oras: 'Hunedoara', judet: 'Hunedoara' },
  { oras: 'Petroșani', judet: 'Hunedoara' },
  { oras: 'Lupeni', judet: 'Hunedoara' },
  { oras: 'Orăștie', judet: 'Hunedoara' },
  
  // Ialomița
  { oras: 'Slobozia', judet: 'Ialomița' },
  { oras: 'Fetești', judet: 'Ialomița' },
  { oras: 'Urziceni', judet: 'Ialomița' },
  
  // Iași
  { oras: 'Iași', judet: 'Iași' },
  { oras: 'Pașcani', judet: 'Iași' },
  { oras: 'Hârlău', judet: 'Iași' },
  
  // Ilfov
  { oras: 'Voluntari', judet: 'Ilfov' },
  { oras: 'Buftea', judet: 'Ilfov' },
  { oras: 'Popești-Leordeni', judet: 'Ilfov' },
  { oras: 'Pantelimon', judet: 'Ilfov' },
  { oras: 'Bragadiru', judet: 'Ilfov' },
  { oras: 'Otopeni', judet: 'Ilfov' },
  { oras: 'Măgurele', judet: 'Ilfov' },
  { oras: 'Chitila', judet: 'Ilfov' },
  
  // Maramureș
  { oras: 'Baia Mare', judet: 'Maramureș' },
  { oras: 'Sighetu Marmației', judet: 'Maramureș' },
  { oras: 'Borșa', judet: 'Maramureș' },
  { oras: 'Vișeu de Sus', judet: 'Maramureș' },
  
  // Mehedinți
  { oras: 'Drobeta-Turnu Severin', judet: 'Mehedinți' },
  { oras: 'Orșova', judet: 'Mehedinți' },
  { oras: 'Strehaia', judet: 'Mehedinți' },
  
  // Mureș
  { oras: 'Târgu Mureș', judet: 'Mureș' },
  { oras: 'Reghin', judet: 'Mureș' },
  { oras: 'Sighișoara', judet: 'Mureș' },
  { oras: 'Târnăveni', judet: 'Mureș' },
  
  // Neamț
  { oras: 'Piatra Neamț', judet: 'Neamț' },
  { oras: 'Roman', judet: 'Neamț' },
  { oras: 'Târgu Neamț', judet: 'Neamț' },
  
  // Olt
  { oras: 'Slatina', judet: 'Olt' },
  { oras: 'Caracal', judet: 'Olt' },
  { oras: 'Corabia', judet: 'Olt' },
  
  // Prahova
  { oras: 'Ploiești', judet: 'Prahova' },
  { oras: 'Câmpina', judet: 'Prahova' },
  { oras: 'Sinaia', judet: 'Prahova' },
  { oras: 'Bușteni', judet: 'Prahova' },
  { oras: 'Azuga', judet: 'Prahova' },
  { oras: 'Comarnic', judet: 'Prahova' },
  
  // Satu Mare
  { oras: 'Satu Mare', judet: 'Satu Mare' },
  { oras: 'Carei', judet: 'Satu Mare' },
  { oras: 'Negrești-Oaș', judet: 'Satu Mare' },
  
  // Sălaj
  { oras: 'Zalău', judet: 'Sălaj' },
  { oras: 'Șimleu Silvaniei', judet: 'Sălaj' },
  { oras: 'Jibou', judet: 'Sălaj' },
  
  // Sibiu
  { oras: 'Sibiu', judet: 'Sibiu' },
  { oras: 'Mediaș', judet: 'Sibiu' },
  { oras: 'Cisnădie', judet: 'Sibiu' },
  { oras: 'Avrig', judet: 'Sibiu' },
  
  // Suceava
  { oras: 'Suceava', judet: 'Suceava' },
  { oras: 'Fălticeni', judet: 'Suceava' },
  { oras: 'Rădăuți', judet: 'Suceava' },
  { oras: 'Câmpulung Moldovenesc', judet: 'Suceava' },
  { oras: 'Vatra Dornei', judet: 'Suceava' },
  
  // Teleorman
  { oras: 'Alexandria', judet: 'Teleorman' },
  { oras: 'Roșiori de Vede', judet: 'Teleorman' },
  { oras: 'Turnu Măgurele', judet: 'Teleorman' },
  
  // Timiș
  { oras: 'Timișoara', judet: 'Timiș' },
  { oras: 'Lugoj', judet: 'Timiș' },
  { oras: 'Sânnicolau Mare', judet: 'Timiș' },
  { oras: 'Jimbolia', judet: 'Timiș' },
  
  // Tulcea
  { oras: 'Tulcea', judet: 'Tulcea' },
  { oras: 'Babadag', judet: 'Tulcea' },
  { oras: 'Măcin', judet: 'Tulcea' },
  
  // Vaslui
  { oras: 'Vaslui', judet: 'Vaslui' },
  { oras: 'Bârlad', judet: 'Vaslui' },
  { oras: 'Huși', judet: 'Vaslui' },
  
  // Vâlcea
  { oras: 'Râmnicu Vâlcea', judet: 'Vâlcea' },
  { oras: 'Drăgășani', judet: 'Vâlcea' },
  { oras: 'Băile Olănești', judet: 'Vâlcea' },
  { oras: 'Călimănești', judet: 'Vâlcea' },
  
  // Vrancea
  { oras: 'Focșani', judet: 'Vrancea' },
  { oras: 'Adjud', judet: 'Vrancea' },
  { oras: 'Panciu', judet: 'Vrancea' },
];

// Funcție pentru căutare
export const searchOrase = (query: string): OrasData[] => {
  if (!query || query.length < 2) return [];
  
  const searchLower = query.toLowerCase();
  
  return oraseRomania
    .filter(o => 
      o.oras.toLowerCase().includes(searchLower) ||
      o.judet.toLowerCase().includes(searchLower)
    )
    .slice(0, 10); // Maxim 10 rezultate
};

// Funcție pentru a găsi județul după oraș
export const getJudetByOras = (oras: string): string | null => {
  const found = oraseRomania.find(
    o => o.oras.toLowerCase() === oras.toLowerCase()
  );
  return found ? found.judet : null;
};
