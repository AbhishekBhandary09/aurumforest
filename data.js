/* ═══════════════════════════════════════════════════
   DATA — destinations, itinerary, gallery
═══════════════════════════════════════════════════ */

const DESTS=[
  {img:'https://images.unsplash.com/photo-1508804052814-cd3ba865a116?w=700&q=80',tag:'Most Popular',location:'Switzerland',title:'Zermatt & the Matterhorn',price:'£4,200',unit:'per person / 5 nights'},
  {img:'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=80',tag:'Exclusive',location:'Maldives',title:'Overwater Sanctuary',price:'£6,800',unit:'per person / 7 nights'},
  {img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80',tag:'Adventure',location:'Patagonia, Argentina',title:'Torres del Paine',price:'£5,450',unit:'per person / 10 nights'},
  {img:'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=700&q=80',tag:'Cultural',location:'Japan',title:'Ryokan & Zen Trail',price:'£5,900',unit:'per person / 8 nights'},
  {img:'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=80',tag:'Remote',location:'Morocco',title:'Sahara Under Stars',price:'£3,600',unit:'per person / 5 nights'},
];

const ITIN=[
  {day:'Day 01',icon:'✈',event:'Arrival in Zurich',desc:'Private transfer to Zermatt. Evening welcome dinner at a candlelit mountain fondue restaurant.'},
  {day:'Day 02',icon:'⛰',event:'Matterhorn Glacier Paradise',desc:'Cable car ascent to 3,883m. Guided glacier walk with your expert alpine guide.'},
  {day:'Day 03',icon:'🌟',event:'Gornergrat & Stargazing',desc:'Cog railway to the observatory. Evening stargazing session — champagne included.'},
  {day:'Day 04',icon:'🎿',event:'Grindelwald & the Eiger',desc:'Exclusive ski experience or snowshoe trail through the Bernese Oberland.'},
  {day:'Day 05',icon:'✦',event:'Farewell & Departure',desc:'Final morning spa treatment at the chalet. Private transfer to Zurich Airport.'},
];

const GAL=[
  {img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80',t:'Eloise & Marcus',l:'Lofoten, Norway'},
  {img:'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=500&q=80',t:'Priya S.',l:'Kerala Backwaters'},
  {img:'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&q=80',t:'James & Fiona',l:'Bora Bora'},
  {img:'https://images.unsplash.com/photo-1526659666037-99c2d4d01c4e?w=500&q=80',t:'Aiko T.',l:'Kyoto, Japan'},
  {img:'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80',t:'Henri & Claire',l:'Dolomites, Italy'},
  {img:'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=500&q=80',t:'Sofia M.',l:'Maldives'},
  {img:'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=500&q=80',t:'Oliver K.',l:'Swiss Alps'},
  {img:'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?w=500&q=80',t:'Camille & Remi',l:'Sahara, Morocco'},
];
