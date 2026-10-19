// ---------------------------------------------------------------------------
// ALL SITE TEXT LIVES IN THIS FILE.
//
// Edit copy here — section headings, labels, buttons, bio, experience,
// publications and articles are all defined below. Components read from this
// module, so no text needs to be hunted down in .tsx files.
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Rohith Teja',
  firstName: 'Rohith',
  role: 'Data Scientist',
  focus: 'Complex Systems & Energy Intelligence',
  tagline: 'chaos to clarity',
  location: 'Paris, France',
  email: 'rohithtejam@gmail.com',
  website: 'https://rohithteja.is-a.dev/',
  linkedin: 'https://www.linkedin.com/in/rohithteja/',
  github: 'https://github.com/rohithteja',
  twitter: 'https://x.com/rohithtejam',
  medium: 'https://medium.com/@rohithtejam',
  photo: 'https://rohithteja.github.io/images/pic2.jpeg',
  // shown under the greeting in the About section; leave empty to hide
  headline: '',
}

export const bio = {
  intro:
    'I’m a data scientist and researcher working at the intersection of forecasting, energy intelligence, urban mobility, and AI.',
  body: [
    'At CEA Paris-Saclay, I built and oversee the modeling for India\'s traffic component of a €1M project, where I developed a street-scale emission intelligence framework that transforms terabytes of floating car data from 100 Indian cities into daily 500m-resolution CO₂ and pollutant estimates.',
    'I specialise in large-scale time-series forecasting, interpretable ML, and causal inference. My work spans natural gas demand forecasting across 1,000 U.S. counties to urban emissions modelling, using SHAP and causal ML to turn complex data into decisions people can trust.',
    'My research has been published in Science Advances and Nature Scientific Data, with collaborations across UC Irvine, Tsinghua University, and IIT Bombay.',
  ],
  // highlights: [
  //   'Technical lead, €1M street-scale emissions platform',
  //   'Terabytes of floating car data · 100 Indian cities',
  //   'India\'s 1st 500m-resolution daily CO₂ & pollutant maps',
  //   '83% short-term gas forecast accuracy · 1,000 U.S. counties',
  //   'Science Advances & Nature Scientific Data author',
  // ],
  domains: ['Urban Mobility', 'Climate & Energy', 'Forecasting', 'Causal Inference', 'Knowledge Graphs', 'LLMs & RAG'],
  specialties: ['Forecasting & Time Series', 'Graph ML', 'Interpretable ML (SHAP)', 'Causal ML & DAGs', 'MLOps & Big Data', 'Interactive Data Viz'],
}

export const stats = [
  { value: 5, suffix: 'TB+', label: 'Floating car data processed', decimals: 0 },
  { value: 100, suffix: ' ', label: 'Indian cities with street-scale emission maps', decimals: 0 },
  { value: 1000, suffix: '', label: 'U.S. counties under natural gas forecast', decimals: 0 },
  { value: 83, suffix: '%', label: 'Short-term forecast accuracy', decimals: 0 },
  { value: 8, suffix: '', label: 'Publications & preprints', decimals: 0 },
  { value: 500, suffix: 'K+', label: 'Views on science communication', decimals: 0 },
  { value: 500, suffix: 'm', label: 'Emission grid resolution', decimals: 0 },
  { value: 1000, suffix: '+', label: 'Medium subscribers ', decimals: 0 },
]

export const experience = [
  {
    role: 'Data Scientist',
    company: 'CEA Paris-Saclay',
    location: 'Paris, France',
    period: '2024 - Present',
    type: 'Fundamental research & applied data science',
    summary: 'Technical lead on building street-scale emission intelligence for India.',
    highlights: [
      'Built a street-scale emission intelligence platform processing 5TB+ of floating car data across 100 Indian cities. ',
      'Designed a multivariate pipeline combining physics-informed scaling with gradient-boosting bias correction → first-ever 500m-resolution daily CO₂ & pollutant emission estimates for India.',
      'Identified urban drivers of traffic congestion with interpretable machine learning (SHAP).',
      'Built causal inference framework (DAGs + causal ML) to estimate the average treatment effect of long-term traffic NOx exposure on respiratory health.',
      'Collaborated with UC Irvine (USA), Tsinghua University (China) and IIT Bombay (India).',
    ],
    tags: ['Forecasting', 'Causal ML', 'SHAP', 'Distributed Computing'],
  },
  {
    role: 'Data Scientist',
    company: 'ATOS',
    location: 'Bezons, France',
    period: '2021 — 2024',
    type: 'IT Services',
    summary: 'Production-grade time-series forecasting for national energy systems.',
    highlights: [
      'Built & deployed forecasting systems for residential natural gas consumption across 1,000 U.S. counties — 83% short-term and 73% medium-term accuracy.',
      'Applied interpretable machine learning (SHAP) to identify socio-economic drivers with the potential to cut national household gas consumption by up to 25%.',
    ],
    tags: ['Time Series', 'Forecasting', 'SHAP', 'Deployment'],
  },
  {
    role: 'Machine Learning Intern',
    company: 'Orange Labs',
    location: 'Cesson-Sévigné, France',
    period: '02/2021 — 08/2021',
    type: 'Telecom R&D',
    summary: 'Improved IoT knowledge graph quality using graph ML.',
    highlights: [
      'Improved IoT knowledge graph quality using graph machine learning and link prediction — over 85% average precision.',
    ],
    tags: ['Knowledge Graphs', 'Graph ML', 'Link Prediction'],
  },
  {
    role: 'Research Intern',
    company: 'Laboratoire Hubert Curien',
    location: 'Saint-Étienne, France',
    period: '04/2020 — 07/2020',
    type: 'Research Lab',
    summary: 'Predicted missing protein interactions with deep learning.',
    highlights: [
      'Predicted missing protein interactions using deep autoencoders and graph embedding techniques with 80% accuracy.',
    ],
    tags: ['Deep Learning', 'Graph Embeddings', 'Bioinformatics'],
  },
  // {
  //   role: 'Data Analyst (Freelance)',
  //   company: 'Independent',
  //   location: 'Hyderabad, India',
  //   period: '2014 — 2017',
  //   type: 'Consulting',
  //   summary: 'Built predictive models that shaped resource allocation for 10,000+ farm households.',
  //   highlights: [
  //     'Developed predictive models on demographic and agricultural data to drive resource allocation decisions across 10,000+ farm households in India.',
  //   ],
  //   tags: ['Predictive Modeling', 'Data Analysis'],
  // },
]

export const education = [
  {
    degree: 'PhD · Complex Systems & Machine Learning',
    school: 'Université Paris-Saclay, France',
    // period: '2027',
    detail: 'Research on urban mobility, energy intelligence and causal ML.',
  },
  {
    degree: 'Master · Machine Learning & Data Mining',
    school: 'Université Jean Monnet, France',
    // period: '2021', 
    detail: 'Specialised in graph neural networks and deep learning.',
  },
  {
    degree: 'Bachelor of Technology',
    school: 'NIT Raipur, India',
    // period: '2014', 
    detail: 'Distributed computing and systems.',
  },
]

export const keywords = [
  'DATA SCIENCE',
  'MACHINE LEARNING',
  'FORECASTING',
  'ENERGY INTELLIGENCE',
  'TIME SERIES',
  'GRAPH NEURAL NETWORKS',
  'CAUSAL INFERENCE',
  'SHAP',
  'PYTHON',
  'CLIMATE SCIENCE',
  'URBAN MOBILITY',
  'RAG',
  'LLMs',
  'MLOps',
  'PYTORCH',
  'DASK',
  'DEEP LEARNING',
  'INTERACTIVE VISUALIZATION',
]

export interface Publication {
  id: string
  title: string
  venue: string
  year: string
  type: string
  description: string
  tags: string[]
  link: string
}

export const publications: Publication[] = [
  {
    id: '01',
    title: 'High-resolution gridded CO₂ and pollutant emission data from road traffic in Indian cities',
    venue: 'Nature Scientific Data',
    year: '2025',
    type: 'Journal Article',
    description:
      'A comprehensive 500-meter gridded dataset of city traffic emissions for 15 Indian cities, derived from street-level floating-car data (GPS positions and speeds of individual vehicles). Statistical and ML techniques improved data quality and extrapolated to all city traffic, not just GPS-equipped vehicles.',
    tags: ['Machine Learning', 'Emission Science', 'Python'],
    link: 'https://www.nature.com/articles/s41597-025-06287-9',
  },
  {
    id: '02',
    title: 'Drivers of natural gas use in U.S. residential buildings',
    venue: 'Science Advances',
    year: '2024',
    type: 'Journal Article',
    description:
      'Daily county-level gas consumption across 1,000 U.S. counties is analysed for spatial patterns and temperature sensitivity. Interpretable ML identifies key predictors: income, employment, building characteristics and estimates a potential 2.47 million MtCO₂ annual emission reduction from insulation and behavioural change.',
    tags: ['Interpretable ML', 'Energy Analytics', 'Policy'],
    link: 'https://www.science.org/doi/full/10.1126/sciadv.adh5543',
  },
  {
    id: '03',
    title: 'Short-to-medium range forecast of natural gas use in the United States residential buildings',
    venue: 'Journal of Cleaner Production',
    year: '2024',
    type: 'Journal Article',
    description:
      'A systematic framework for predicting short-to-medium-range natural gas consumption in U.S. homes using interpretable linear-plus-plateau models and seasonal temperature forecast ensembles. Reaches 80% average accuracy, up to 82% in Midwest and East Coast regions.',
    tags: ['Forecasting', 'Time Series', 'Energy Systems'],
    link: 'https://www.sciencedirect.com/science/article/abs/pii/S0959652624001343',
  },
  {
    id: '04',
    title: 'High-resolution modeling and conservation scenario analysis of French gas consumption under climate and gas-supply shifts',
    venue: 'SSRN',
    year: '2025',
    type: 'Working Paper',
    description:
      'High-resolution modeling of French gas consumption with conservation scenario analysis under changing climate and gas-supply conditions: informing national energy resilience and demand-side policy.',
    tags: ['Forecasting', 'Climate', 'Energy Policy'],
    link: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5824807',
  },
  {
    id: '05',
    title: 'A Study on Knowledge Graph Embeddings and Graph Neural Networks for Web Of Things',
    venue: 'arXiv',
    year: '2023',
    type: 'Preprint',
    description:
      'An exploration of state-of-the-art knowledge graph embedding methods and Graph Neural Networks for the Web of Things. Evaluates both on link prediction, node classification and triple classification to guide WoT implementations.',
    tags: ['Knowledge Graphs', 'Graph Neural Networks', 'WoT'],
    link: 'https://arxiv.org/abs/2310.14866',
  },
  {
    id: '06',
    title: 'Harmonized Annual Averaged Traffic Data at Street Segment Level for European Cities',
    venue: 'Nature Scientific Data',
    year: '2025',
    type: 'Journal Article',
    description:
      'A harmonized dataset of annual averaged traffic data at street segment level across European cities: a common reference for mobility, emission and urban-planning research.',
    tags: ['Data Curation', 'Urban Mobility', 'GIS'],
    link: 'https://www.nature.com/articles/s41597-025-05698-y',
  },
  {
    id: '07',
    title: 'High spatiotemporal resolution traffic CO₂ emission maps derived from Floating Car Data (FCD) for 20 European cities',
    venue: 'Earth System Science Data',
    year: '2026',
    type: 'Journal Article',
    description:
      'High spatiotemporal resolution traffic CO₂ emission maps for 20 European cities derived from Floating Car Data: enabling city-scale comparison of mobility emissions.',
    tags: ['Floating Car Data', 'Emission Mapping', 'Europe'],
    link: 'https://essd.copernicus.org/articles/18/927/2026/',
  },
  {
    id: '08',
    title: 'Global Marine LNG Terminals, Tankers & Trade: A High-Resolution AIS-Based Dataset of LNG Trade (2020–2024)',
    venue: 'Nature Scientific Data',
    year: '2026',
    type: 'Journal Article',
    description:
      'A high-resolution AIS-based dataset tracking global LNG terminals, tankers and trade from 2020 to 2024: a foundation for energy market and maritime analytics.',
    tags: ['AIS Data', 'Energy Trade', 'Maritime Analytics'],
    link: 'https://www.nature.com/articles/s41597-026-07454-2',
  },
]

export const articles = [
  {
    id: '01',
    title: 'ChatGPT, Random Numbers and the Lottery',
    description:
      'An interesting exploration of how ChatGPT handles random number generation and what this reveals about AI systems when applied to lottery scenarios.',
    category: 'AI & Technology',
    readTime: '7 min read',
    link: 'https://medium.com/geekculture/chatgpt-random-numbers-and-the-lottery-4285c7296098',
    image: '/medium_images/m1.webp',
  },
  {
    id: '02',
    title: 'How to Generate and Evaluate Knowledge Graph Embeddings',
    description:
      'A comprehensive guide on generating and evaluating the performance of knowledge graph embeddings, covering practical implementation and evaluation metrics.',
    category: 'Machine Learning',
    readTime: '12 min read',
    link: 'https://medium.com/data-science/how-to-generate-and-evaluate-the-performance-of-knowledge-graph-embeddings-95789abcb0c1',
    image: '/medium_images/m2.webp',
  },
  {
    id: '03',
    title: 'What Does an Eerie Song on Global Warming Tell Us?',
    description:
      'An intriguing analysis connecting music, data, and climate change messaging. Exploring how artistic expression can communicate environmental data and climate science.',
    category: 'Climate Science',
    readTime: '8 min read',
    link: 'https://medium.com/@rohithtejam/what-does-an-eerie-song-on-global-warming-and-climate-change-tell-us-4e0b0f8a9eac',
    image: '/medium_images/m3.webp',
  },
  {
    id: '04',
    title: "Let's Talk About Graph Neural Network Python Libraries",
    description:
      'A comprehensive comparison and guide to the most popular Graph Neural Network libraries in Python, helping developers choose the right tools for their projects.',
    category: 'Tutorial',
    readTime: '15 min read',
    link: 'https://medium.com/data-science/lets-talk-about-graph-neural-network-python-libraries-a0b23ec983b0',
    image: '/medium_images/m4.webp',
  },
  {
    id: '05',
    title: 'I Created Music from Data Using Python',
    description:
      'A creative exploration of data sonification - transforming datasets into musical compositions using Python. Discover how data can become art through sound.',
    category: 'Data Visualization',
    readTime: '10 min read',
    link: 'https://medium.com/data-science/i-created-music-from-data-using-python-adfc349f55f1',
    image: '/medium_images/m5.webp',
  },
  {
    id: '06',
    title: 'Graph Machine Learning in Biomedical Networks',
    description:
      'An in-depth discussion on applying graph machine learning techniques to biomedical networks, exploring applications in drug discovery and biological analysis.',
    category: 'Bioinformatics',
    readTime: '14 min read',
    link: 'https://medium.com/data-science/lets-talk-about-graph-machine-learning-in-biomedical-networks-8a84139e970b',
    image: '/medium_images/m6.webp',
  },
]

// ---------------------------------------------------------------------------
// Page copy — every string rendered by a component belongs here.
// ---------------------------------------------------------------------------

export const ui = {
  meta: {
    title: 'Rohith Teja - Data Scientist | Complex Systems & Energy Intelligence',
    description:
      'Data Scientist specializing in complex systems, forecasting, energy intelligence and urban mobility. PhD @ Université Paris-Saclay, published in Science Advances and Nature Scientific Data. Built street-scale CO₂ emission maps for 100 Indian cities.',
    author: 'Rohith Teja',
    keywords: [
      'data science',
      'machine learning',
      'forecasting',
      'time series',
      'energy intelligence',
      'climate change',
      'urban mobility',
      'graph neural networks',
      'causal inference',
      'SHAP',
    ],
    openGraph: {
      title: 'Rohith Teja — Data Scientist',
      description: 'Complex systems & energy intelligence · PhD @ Université Paris-Saclay',
      siteName: 'Rohith Teja',
    },
    twitter: {
      title: 'Rohith Teja — Data Scientist',
      description: 'Complex systems & energy intelligence · PhD @ Université Paris-Saclay',
    },
  },

  nav: {
    about: 'About',
    work: 'Work',
    experience: 'Experience',
    blog: 'Blog',
    research: 'Research',
    contact: 'Contact',
    connect: "Let's Connect",
    scrollCue: 'Scroll',
    homeLabel: 'Rohith Teja — Home',
    toggleMenuLabel: 'Toggle menu',
    backToTopLabel: 'Back to top',
  },

  socials: {
    medium: { label: 'Medium', href: profile.medium },
    linkedin: { label: 'LinkedIn', href: profile.linkedin },
    github: { label: 'GitHub', href: profile.github },
    x: { label: 'X', href: profile.twitter },
  },

  about: {
    greetings: ['i am rohith', 'je suis rohith', 'ich bin rohith', '私は rohith です'],
    photoAlt: 'Rohith Teja',
    labels: {
      domains: 'Domains',
      specialties: 'Specialties',
      currently: 'Currently',
      education: 'Education',
      location: 'Location',
    },
    currently: 'Data Scientist @ CEA Paris-Saclay in complex systems & energy intelligence',
    education: 'PhD Complex Systems & Machine Learning, Université Paris-Saclay',
    location: 'Paris, France',
  },

  hero: {
    turning: 'turning',
    row1a: 'chaos ',
    row1b: 'to ',
    row2a: 'clarity ',
    hiddenLine: 'complex systevi to clean code',
    ariaLabel: 'turning chaos to clarity — complex systems to clean code',
  },

  stats: {
    heading: 'numbers that',
    headingAccent: 'tell a story', 
    subheading: 'scale · resolution · accuracy : what a my journey of data science looks like',
  },
 
  work: {
    loadingMap: 'Loading map...',
    loadingDashboard: 'Loading dashboard...',
    heading: 'interact with my work',
    intro: 'try the dashboard from my Nature Scientific Data paper:',
    subheading: '500m-resolution traffic CO₂ estimates · 100 Indian cities · hover a city to explore',
    cards: {
      totalCities: 'Total Cities',
      totalCo2: 'Total CO₂ Emissions',
      perCapitaCo2: 'Per Capita CO₂ Emissions',
      totalPopulation: 'Total Population',
    },
    units: {
      tonsPerYear: 'tons/year',
      tonsPerPersonPerYear: 'tons/person/year',
    },
    mapTitle: 'Interactive Map',
    legend: {
      title: 'CO₂ Emissions:',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      size: 'Circle size = Population',
    },
    panel: {
      emissionDetails: 'Emission Details',
      cityInformation: 'City Information',
      hoverHint: 'Hover over a city on the map to see detailed information',
    },
    fields: {
      city: 'City:',
      state: 'State:',
      population: 'Population:',
      co2: 'CO₂ Emissions:',
      perCapita: 'Per Capita CO₂:',
      gdp: 'GDP (2020):',
      urbanArea: 'Urban Area:',
      roadLength: 'Road Length:',
      statePopulation: 'State Population:',
    },
  },

  experience: {
    heading: 'experience',
    subheading: 'of turning data into decisions',
    countSuffix: 'roles · click to expand',
    educationHeading: 'education',
  },

  articles: {
    heading: 'i write',
    subheading: 'on all things data science!',
    readOnMedium: 'Read on Medium',
    ctaHeading: 'Want to read more?',
    ctaBody: 'Check out my Medium blog for more articles on data science and AI.',
    ctaButton: 'Visit My Medium Blog',
    ctaHref: profile.medium,
  },

  publications: {
    heading: 'research',
    subheading: 'published papers & contributions',
    countSuffix: 'papers',
    filters: ['All', 'Journal Article', 'Preprint', 'Working Paper'] as const,
    readPaper: 'Read Paper',
  },

  contact: {
    badge: 'Open to opportunities',
    heading: "let's build something",
    headingAccent: "data can't solve alone",
    body: "I'm open to senior data scientist, AI research and energy / mobility intelligence roles. Got a messy dataset or a hard forecasting problem?",
    findMe: 'find me here',
  },

  footer: {
    linkOrder: [
      { label: 'About', id: 'about' },
      { label: 'Work', id: 'work' },
      { label: 'Experience', id: 'experience' },
      { label: 'Blog', id: 'articles' },
      { label: 'Research', id: 'publications' },
    ],
    socialOrder: ['linkedin', 'github', 'medium', 'x'] as const,
    rights: 'All rights reserved.',
  },
}
