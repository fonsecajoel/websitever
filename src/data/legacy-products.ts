export type ProductCategory =
  | 'scarpin'
  | 'sandalia'
  | 'tamanco'
  | 'tenis'
  | 'mule'
  | 'bota'
  | 'rasteira'
  | 'bolsa';

export type Collection = 'aurora' | 'heritage' | 'noir' | 'verao' | 'essentials';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collection: Collection;
  price: number;
  oldPrice?: number;
  currency: 'BRL';
  shortDescription: string;
  description: string;
  details: string[];
  materials: string;
  origin: string;
  heelHeight?: string;
  colors: { name: string; hex: string }[];
  sizes: { label: string; available: boolean }[];
  images: { src: string; alt: string }[];
  badges?: ('novo' | 'best-seller' | 'edicao-limitada' | 'ultimas-pecas')[];
  isNew?: boolean;
}

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const standardSizes = [33, 34, 35, 36, 37, 38, 39, 40].map((n, i) => ({
  label: String(n),
  available: i !== 0 && i !== 7,
}));

export const products: Product[] = [
  {
    id: 'p01',
    slug: 'scarpin-aurora-mocha',
    name: 'Scarpin Aurora',
    category: 'scarpin',
    collection: 'aurora',
    price: 689,
    oldPrice: 829,
    currency: 'BRL',
    shortDescription: 'Scarpin clássico em couro mocha com salto fino de 9cm.',
    description:
      'O Scarpin Aurora é a tradução perfeita da elegância atemporal. Construído à mão em Franca-SP com couro legítimo italiano, apresenta um bico fino refinado e salto stiletto de 9cm que alonga a silhueta com sofisticação.',
    details: [
      'Cabedal em couro legítimo italiano',
      'Forro em couro natural',
      'Solado de couro com tira antiderrapante',
      'Salto stiletto coberto de 9cm',
      'Palmilha anatómica acolchoada',
    ],
    materials: 'Couro legítimo · Forro em couro · Solado em couro',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '9 cm',
    colors: [
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Bone', hex: '#F5EFE6' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Scarpin Aurora vista frontal' },
      { src: u('photo-1535043934128-cf0b28d52f95'), alt: 'Scarpin Aurora vista lateral' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Scarpin Aurora detalhe' },
      { src: u('photo-1554062614-6da4fa67725a'), alt: 'Scarpin Aurora composição' },
    ],
    badges: ['best-seller'],
  },
  {
    id: 'p02',
    slug: 'sandalia-celeste-creme',
    name: 'Sandália Celeste',
    category: 'sandalia',
    collection: 'verao',
    price: 549,
    currency: 'BRL',
    shortDescription: 'Sandália de tiras finas em couro creme com salto bloco.',
    description:
      'Inspirada nas tardes de Trancoso, a Celeste é leve, feminina e versátil. Tiras finas envolvem o pé com delicadeza e o salto bloco de 7cm garante conforto durante todo o dia.',
    details: [
      'Tiras finas em couro creme',
      'Fivela metálica banhada a ouro',
      'Salto bloco de 7cm',
      'Palmilha em couro acolchoado',
      'Solado em borracha tratada',
    ],
    materials: 'Couro legítimo · Ferragens douradas',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '7 cm',
    colors: [
      { name: 'Creme', hex: '#EDE3D2' },
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Negro', hex: '#1A1209' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1603487742131-4160ec999306'), alt: 'Sandália Celeste creme' },
      { src: u('photo-1562273138-f46be4ebdf33'), alt: 'Sandália Celeste detalhe' },
      { src: u('photo-1611509478264-c9b95c45ae62'), alt: 'Sandália Celeste vista superior' },
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Sandália Celeste lifestyle' },
    ],
    badges: ['novo'],
    isNew: true,
  },
  {
    id: 'p03',
    slug: 'tamanco-luna-taupe',
    name: 'Tamanco Luna',
    category: 'tamanco',
    collection: 'heritage',
    price: 619,
    currency: 'BRL',
    shortDescription: 'Tamanco trançado à mão em couro taupe com plataforma.',
    description:
      'A trama feita à mão por artesãos mineiros torna cada par único. Plataforma confortável de 8cm com 2cm de meia-pata, ideal para um dia inteiro com elegância.',
    details: [
      'Trança feita à mão',
      'Couro vegetal curtido naturalmente',
      'Plataforma de 8cm com 2cm de meia-pata',
      'Forro em couro',
      'Edição limitada',
    ],
    materials: 'Couro vegetal trançado',
    origin: 'Belo Horizonte, Minas Gerais · Brasil',
    heelHeight: '8 cm',
    colors: [
      { name: 'Taupe', hex: '#B8A189' },
      { name: 'Mocha', hex: '#6B4E3A' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1535043934128-cf0b28d52f95'), alt: 'Tamanco Luna taupe' },
      { src: u('photo-1551107696-a4b0c5a0d9a2'), alt: 'Tamanco Luna detalhe da trança' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Tamanco Luna vista frontal' },
      { src: u('photo-1542838686-37da4a9fd1b3'), alt: 'Tamanco Luna composição' },
    ],
    badges: ['edicao-limitada'],
  },
  {
    id: 'p04',
    slug: 'tenis-blanca-bone',
    name: 'Tênis Blanca',
    category: 'tenis',
    collection: 'essentials',
    price: 459,
    currency: 'BRL',
    shortDescription: 'Tênis minimalista em couro bone com solado leve.',
    description:
      'O Blanca redefine o tênis branco. Couro premium, costuras invisíveis e solado de borracha ultra-leve. Para quem entende que sofisticação está nos detalhes.',
    details: [
      'Couro pleno-flor',
      'Cadarços em algodão encerado',
      'Solado em borracha leve com 2cm',
      'Palmilha removível',
    ],
    materials: 'Couro pleno-flor · Borracha',
    origin: 'Franca, São Paulo · Brasil',
    colors: [
      { name: 'Bone', hex: '#F5EFE6' },
      { name: 'Sand', hex: '#E2D3BB' },
      { name: 'Negro', hex: '#1A1209' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1542291026-7eec264c27ff'), alt: 'Tênis Blanca bone' },
      { src: u('photo-1551107696-a4b0c5a0d9a2'), alt: 'Tênis Blanca lateral' },
      { src: u('photo-1525966222134-fcfa99b8ae77'), alt: 'Tênis Blanca detalhe' },
      { src: u('photo-1460353581641-37baddab0fa2'), alt: 'Tênis Blanca lifestyle' },
    ],
    badges: ['best-seller'],
  },
  {
    id: 'p05',
    slug: 'mule-isadora-cocoa',
    name: 'Mule Isadora',
    category: 'mule',
    collection: 'noir',
    price: 579,
    currency: 'BRL',
    shortDescription: 'Mule de bico fino em couro cocoa com salto kitten.',
    description:
      'A Isadora é a mule pensada para a mulher contemporânea. Bico fino, salto kitten de 5cm e linhas limpas que conversam com qualquer guarda-roupa.',
    details: [
      'Bico fino refinado',
      'Salto kitten de 5cm',
      'Couro pleno-flor',
      'Palmilha acolchoada',
    ],
    materials: 'Couro legítimo · Solado em couro',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '5 cm',
    colors: [
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Bone', hex: '#F5EFE6' },
      { name: 'Mocha', hex: '#6B4E3A' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1606107557195-0e29a4b5b4aa'), alt: 'Mule Isadora cocoa' },
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Mule Isadora detalhe' },
      { src: u('photo-1518049362265-d5b2a6b00b37'), alt: 'Mule Isadora vista superior' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Mule Isadora lifestyle' },
    ],
  },
  {
    id: 'p06',
    slug: 'bota-marlene-cocoa',
    name: 'Bota Marlene',
    category: 'bota',
    collection: 'noir',
    price: 1289,
    currency: 'BRL',
    shortDescription: 'Bota cano alto em couro cocoa com salto bloco.',
    description:
      'Cano alto que envolve a panturrilha com precisão. Couro encorpado, zíper invisível e salto bloco de 6cm. Uma peça-chave para o outono-inverno.',
    details: [
      'Cano alto 38cm',
      'Zíper invisível lateral',
      'Salto bloco de 6cm',
      'Forro em couro',
      'Solado de borracha tratada',
    ],
    materials: 'Couro encorpado · Borracha',
    origin: 'Novo Hamburgo, Rio Grande do Sul · Brasil',
    heelHeight: '6 cm',
    colors: [
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Mocha', hex: '#6B4E3A' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1608256246200-53e635b5b65f'), alt: 'Bota Marlene cocoa' },
      { src: u('photo-1542838686-37da4a9fd1b3'), alt: 'Bota Marlene lateral' },
      { src: u('photo-1605812860427-4024433a70fd'), alt: 'Bota Marlene detalhe do salto' },
      { src: u('photo-1551107696-a4b0c5a0d9a2'), alt: 'Bota Marlene lifestyle' },
    ],
    badges: ['novo'],
    isNew: true,
  },
  {
    id: 'p07',
    slug: 'rasteira-iris-gold',
    name: 'Rasteira Íris',
    category: 'rasteira',
    collection: 'verao',
    price: 329,
    oldPrice: 419,
    currency: 'BRL',
    shortDescription: 'Rasteira em couro com detalhe metálico dourado.',
    description:
      'Para os dias de praia e cidade. A Íris une couro macio, palmilha anatómica e um detalhe metálico que captura a luz a cada passo.',
    details: [
      'Tiras em couro macio',
      'Detalhe metálico banhado',
      'Palmilha anatómica',
      'Solado em borracha leve',
    ],
    materials: 'Couro · Metal banhado',
    origin: 'Franca, São Paulo · Brasil',
    colors: [
      { name: 'Bone', hex: '#F5EFE6' },
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Gold', hex: '#B8965A' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1603487742131-4160ec999306'), alt: 'Rasteira Íris' },
      { src: u('photo-1562273138-f46be4ebdf33'), alt: 'Rasteira Íris detalhe metálico' },
      { src: u('photo-1611509478264-c9b95c45ae62'), alt: 'Rasteira Íris vista superior' },
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Rasteira Íris lifestyle' },
    ],
    badges: ['ultimas-pecas'],
  },
  {
    id: 'p08',
    slug: 'sandalia-noir-cocoa',
    name: 'Sandália Noir',
    category: 'sandalia',
    collection: 'noir',
    price: 759,
    currency: 'BRL',
    shortDescription: 'Sandália de noite com tira fina e cristais.',
    description:
      'Pensada para os momentos que ficam na memória. Tira única em cetim cocoa adornada com cristais e salto stiletto de 10cm.',
    details: [
      'Cetim cocoa',
      'Cristais aplicados à mão',
      'Salto stiletto 10cm',
      'Tira ajustável no tornozelo',
    ],
    materials: 'Cetim · Cristais · Forro em couro',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '10 cm',
    colors: [
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Bone', hex: '#F5EFE6' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1571909068228-09b66d2d2caa'), alt: 'Sandália Noir' },
      { src: u('photo-1535043934128-cf0b28d52f95'), alt: 'Sandália Noir detalhe cristal' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Sandália Noir lateral' },
      { src: u('photo-1606107557195-0e29a4b5b4aa'), alt: 'Sandália Noir lifestyle' },
    ],
    badges: ['edicao-limitada'],
  },
  {
    id: 'p09',
    slug: 'scarpin-clara-bone',
    name: 'Scarpin Clara',
    category: 'scarpin',
    collection: 'aurora',
    price: 649,
    currency: 'BRL',
    shortDescription: 'Scarpin de salto médio em couro bone.',
    description:
      'Versão mais discreta do icónico Aurora. Salto bloco de 6cm, perfeito para o dia-a-dia profissional sem abdicar de elegância.',
    details: [
      'Couro pleno-flor bone',
      'Salto bloco 6cm',
      'Bico ligeiramente afilado',
      'Palmilha acolchoada',
    ],
    materials: 'Couro · Solado em couro',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '6 cm',
    colors: [
      { name: 'Bone', hex: '#F5EFE6' },
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Cocoa', hex: '#2E1F15' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Scarpin Clara bone' },
      { src: u('photo-1554062614-6da4fa67725a'), alt: 'Scarpin Clara detalhe' },
      { src: u('photo-1535043934128-cf0b28d52f95'), alt: 'Scarpin Clara lateral' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Scarpin Clara lifestyle' },
    ],
  },
  {
    id: 'p10',
    slug: 'tamanco-aurora-mocha',
    name: 'Tamanco Aurora',
    category: 'tamanco',
    collection: 'heritage',
    price: 689,
    currency: 'BRL',
    shortDescription: 'Tamanco de couro mocha com plataforma de madeira.',
    description:
      'Resgatamos a alma do tamanco brasileiro com madeira de reflorestamento e couro de origem rastreada. Conforto que dura.',
    details: [
      'Plataforma em madeira de reflorestamento',
      'Couro mocha',
      'Salto 9cm com 2cm de meia-pata',
      'Solado tratado antiderrapante',
    ],
    materials: 'Couro · Madeira',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '9 cm',
    colors: [
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Cocoa', hex: '#2E1F15' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1551107696-a4b0c5a0d9a2'), alt: 'Tamanco Aurora mocha' },
      { src: u('photo-1535043934128-cf0b28d52f95'), alt: 'Tamanco Aurora lateral' },
      { src: u('photo-1542838686-37da4a9fd1b3'), alt: 'Tamanco Aurora detalhe' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Tamanco Aurora lifestyle' },
    ],
  },
  {
    id: 'p11',
    slug: 'tenis-noir-cocoa',
    name: 'Tênis Noir',
    category: 'tenis',
    collection: 'noir',
    price: 519,
    currency: 'BRL',
    shortDescription: 'Tênis em couro cocoa com solado contrastante.',
    description:
      'A versão noturna do Blanca. Couro cocoa profundo e solado bone que cria contraste sofisticado.',
    details: [
      'Couro pleno-flor cocoa',
      'Solado bone em borracha',
      'Cadarços encerados',
    ],
    materials: 'Couro · Borracha',
    origin: 'Franca, São Paulo · Brasil',
    colors: [
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Mocha', hex: '#6B4E3A' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1525966222134-fcfa99b8ae77'), alt: 'Tênis Noir cocoa' },
      { src: u('photo-1542291026-7eec264c27ff'), alt: 'Tênis Noir lateral' },
      { src: u('photo-1551107696-a4b0c5a0d9a2'), alt: 'Tênis Noir detalhe' },
      { src: u('photo-1460353581641-37baddab0fa2'), alt: 'Tênis Noir lifestyle' },
    ],
  },
  {
    id: 'p12',
    slug: 'mule-aurora-bone',
    name: 'Mule Aurora',
    category: 'mule',
    collection: 'aurora',
    price: 599,
    currency: 'BRL',
    shortDescription: 'Mule de bico quadrado em couro bone.',
    description:
      'Bico quadrado contemporâneo, salto kitten de 4cm. A Mule Aurora é leveza com presença.',
    details: [
      'Bico quadrado',
      'Salto kitten 4cm',
      'Couro pleno-flor bone',
      'Palmilha acolchoada',
    ],
    materials: 'Couro · Solado em couro',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '4 cm',
    colors: [
      { name: 'Bone', hex: '#F5EFE6' },
      { name: 'Cocoa', hex: '#2E1F15' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1606107557195-0e29a4b5b4aa'), alt: 'Mule Aurora bone' },
      { src: u('photo-1518049362265-d5b2a6b00b37'), alt: 'Mule Aurora vista superior' },
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Mule Aurora detalhe' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Mule Aurora lifestyle' },
    ],
    isNew: true,
    badges: ['novo'],
  },
  {
    id: 'p13',
    slug: 'sandalia-trama-mocha',
    name: 'Sandália Trama',
    category: 'sandalia',
    collection: 'heritage',
    price: 689,
    currency: 'BRL',
    shortDescription: 'Sandália trançada à mão em couro mocha.',
    description:
      'Trabalho artesanal puro. Cada tira é trançada manualmente, criando uma textura única que se ajusta ao pé.',
    details: [
      'Trama 100% manual',
      'Couro vegetal',
      'Salto bloco 7cm',
      'Solado em couro',
    ],
    materials: 'Couro vegetal trançado',
    origin: 'Belo Horizonte, Minas Gerais · Brasil',
    heelHeight: '7 cm',
    colors: [
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Taupe', hex: '#B8A189' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1611509478264-c9b95c45ae62'), alt: 'Sandália Trama mocha' },
      { src: u('photo-1551107696-a4b0c5a0d9a2'), alt: 'Sandália Trama detalhe' },
      { src: u('photo-1535043934128-cf0b28d52f95'), alt: 'Sandália Trama vista superior' },
      { src: u('photo-1542838686-37da4a9fd1b3'), alt: 'Sandália Trama lifestyle' },
    ],
    badges: ['edicao-limitada'],
  },
  {
    id: 'p14',
    slug: 'bolsa-aurelia-mocha',
    name: 'Bolsa Aurélia',
    category: 'bolsa',
    collection: 'essentials',
    price: 1149,
    currency: 'BRL',
    shortDescription: 'Bolsa estruturada em couro mocha com fecho dourado.',
    description:
      'A bolsa que define a marca. Couro encorpado, estrutura impecável e fecho dourado feito sob medida.',
    details: [
      'Couro encorpado',
      'Forro em algodão natural',
      'Fecho dourado banhado',
      'Alça removível',
      'Bolsa de tecido inclusa',
    ],
    materials: 'Couro · Metal banhado a ouro · Algodão',
    origin: 'Franca, São Paulo · Brasil',
    colors: [
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Bone', hex: '#F5EFE6' },
    ],
    sizes: [{ label: 'Único', available: true }],
    images: [
      { src: u('photo-1584917865442-de89df76afd3'), alt: 'Bolsa Aurélia mocha' },
      { src: u('photo-1591561954557-26941169b49e'), alt: 'Bolsa Aurélia detalhe do fecho' },
      { src: u('photo-1548036328-c9fa89d128fa'), alt: 'Bolsa Aurélia interior' },
      { src: u('photo-1590874103328-eac38a683ce7'), alt: 'Bolsa Aurélia lifestyle' },
    ],
    badges: ['best-seller'],
  },
  {
    id: 'p15',
    slug: 'scarpin-noir-cocoa',
    name: 'Scarpin Noir',
    category: 'scarpin',
    collection: 'noir',
    price: 729,
    currency: 'BRL',
    shortDescription: 'Scarpin em couro envernizado cocoa.',
    description:
      'O brilho do envernizado encontra o tom mais profundo da nossa paleta. Para noites memoráveis.',
    details: [
      'Couro envernizado',
      'Salto stiletto 9cm',
      'Bico fino',
      'Palmilha em couro',
    ],
    materials: 'Couro envernizado',
    origin: 'Franca, São Paulo · Brasil',
    heelHeight: '9 cm',
    colors: [
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Mocha', hex: '#6B4E3A' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1554062614-6da4fa67725a'), alt: 'Scarpin Noir cocoa' },
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Scarpin Noir detalhe' },
      { src: u('photo-1535043934128-cf0b28d52f95'), alt: 'Scarpin Noir lateral' },
      { src: u('photo-1581101767113-1677fc2beaa8'), alt: 'Scarpin Noir lifestyle' },
    ],
  },
  {
    id: 'p16',
    slug: 'rasteira-luna-bone',
    name: 'Rasteira Luna',
    category: 'rasteira',
    collection: 'verao',
    price: 289,
    currency: 'BRL',
    shortDescription: 'Rasteira de tira única em couro bone.',
    description:
      'Simplicidade que conquista. Tira única em couro macio com palmilha anatómica para passos confortáveis.',
    details: ['Tira única em couro', 'Palmilha anatómica', 'Solado em borracha leve'],
    materials: 'Couro · Borracha',
    origin: 'Franca, São Paulo · Brasil',
    colors: [
      { name: 'Bone', hex: '#F5EFE6' },
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Cocoa', hex: '#2E1F15' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1562273138-f46be4ebdf33'), alt: 'Rasteira Luna bone' },
      { src: u('photo-1603487742131-4160ec999306'), alt: 'Rasteira Luna detalhe' },
      { src: u('photo-1611509478264-c9b95c45ae62'), alt: 'Rasteira Luna vista superior' },
      { src: u('photo-1543163521-1bf539c55dd2'), alt: 'Rasteira Luna lifestyle' },
    ],
  },
  {
    id: 'p17',
    slug: 'bota-aurora-mocha',
    name: 'Bota Aurora',
    category: 'bota',
    collection: 'aurora',
    price: 1089,
    currency: 'BRL',
    shortDescription: 'Bota cano curto em couro mocha.',
    description:
      'Cano curto, salto bloco e couro mocha. A bota essencial que combina com tudo.',
    details: ['Cano curto', 'Salto bloco 5cm', 'Couro pleno-flor', 'Zíper lateral'],
    materials: 'Couro · Borracha',
    origin: 'Novo Hamburgo, Rio Grande do Sul · Brasil',
    heelHeight: '5 cm',
    colors: [
      { name: 'Mocha', hex: '#6B4E3A' },
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Bone', hex: '#F5EFE6' },
    ],
    sizes: standardSizes,
    images: [
      { src: u('photo-1605812860427-4024433a70fd'), alt: 'Bota Aurora mocha' },
      { src: u('photo-1608256246200-53e635b5b65f'), alt: 'Bota Aurora lateral' },
      { src: u('photo-1542838686-37da4a9fd1b3'), alt: 'Bota Aurora detalhe' },
      { src: u('photo-1551107696-a4b0c5a0d9a2'), alt: 'Bota Aurora lifestyle' },
    ],
  },
  {
    id: 'p18',
    slug: 'bolsa-mini-cocoa',
    name: 'Mini Bolsa Vega',
    category: 'bolsa',
    collection: 'noir',
    price: 849,
    currency: 'BRL',
    shortDescription: 'Mini bolsa em couro cocoa com alça em corrente.',
    description:
      'Tamanho mini, presença máxima. Alça em corrente dourada e couro cocoa profundo.',
    details: ['Alça em corrente dourada', 'Couro pleno-flor', 'Forro em algodão'],
    materials: 'Couro · Metal banhado',
    origin: 'Franca, São Paulo · Brasil',
    colors: [
      { name: 'Cocoa', hex: '#2E1F15' },
      { name: 'Mocha', hex: '#6B4E3A' },
    ],
    sizes: [{ label: 'Único', available: true }],
    images: [
      { src: u('photo-1591561954557-26941169b49e'), alt: 'Mini Bolsa Vega cocoa' },
      { src: u('photo-1584917865442-de89df76afd3'), alt: 'Mini Bolsa Vega detalhe' },
      { src: u('photo-1548036328-c9fa89d128fa'), alt: 'Mini Bolsa Vega lateral' },
      { src: u('photo-1590874103328-eac38a683ce7'), alt: 'Mini Bolsa Vega lifestyle' },
    ],
    isNew: true,
    badges: ['novo'],
  },
];

export const collections: Record<Collection, { name: string; tagline: string; description: string; cover: string }> = {
  aurora: {
    name: 'Aurora',
    tagline: 'O despertar da elegância',
    description: 'Tons quentes e linhas suaves. A coleção que celebra a luz da manhã brasileira.',
    cover: u('photo-1543163521-1bf539c55dd2', 1800),
  },
  heritage: {
    name: 'Heritage',
    tagline: 'O artesanato que nos define',
    description: 'Peças trançadas e construídas à mão por mestres artesãos do interior do Brasil.',
    cover: u('photo-1551107696-a4b0c5a0d9a2', 1800),
  },
  noir: {
    name: 'Noir',
    tagline: 'A noite tem nome',
    description: 'A coleção de festa. Cetins, envernizados e cristais aplicados à mão.',
    cover: u('photo-1571909068228-09b66d2d2caa', 1800),
  },
  verao: {
    name: 'Verão',
    tagline: 'Trancoso, sempre',
    description: 'Sandálias e rasteiras pensadas para os dias longos e as noites quentes.',
    cover: u('photo-1603487742131-4160ec999306', 1800),
  },
  essentials: {
    name: 'Essentials',
    tagline: 'O que fica para sempre',
    description: 'Os clássicos atemporais que toda mulher deve ter.',
    cover: u('photo-1542291026-7eec264c27ff', 1800),
  },
};

export const categoryLabels: Record<ProductCategory, string> = {
  scarpin: 'Scarpins',
  sandalia: 'Sandálias',
  tamanco: 'Tamancos',
  tenis: 'Tênis',
  mule: 'Mules',
  bota: 'Botas',
  rasteira: 'Rasteiras',
  bolsa: 'Bolsas',
};

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsByCollection(collection: Collection): Product[] {
  return products.filter((p) => p.collection === collection);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, limit);
}
