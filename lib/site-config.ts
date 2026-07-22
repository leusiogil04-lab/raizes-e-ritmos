/**
 * =====================================================================
 *  RAÍZES E RITMOS — ARQUIVO CENTRAL DE CONFIGURAÇÃO
 * =====================================================================
 *
 *  Este é o ÚNICO arquivo que você precisa editar para atualizar o site.
 *  Tudo que aparece na página é lido daqui.
 *
 *  COMO EDITAR:
 *   - EVENTOS / TURMAS ........ veja `events` (mais abaixo)
 *   - DATAS / HORÁRIOS ........ dentro de cada evento em `events`
 *   - VALORES ................. `price` / `pricePerMeeting` em cada evento
 *   - LINKS DE PAGAMENTO ...... `checkoutUrl` em cada evento
 *   - STATUS DAS INSCRIÇÕES ... `status` em cada evento
 *   - REDES SOCIAIS ........... veja `socialConfig`
 *   - FACILITADOR ............. veja `instructorConfig`
 *   - TEXTOS / SEÇÕES ......... veja `projectConfig` e `sectionsConfig`
 *   - FAQ ..................... veja `faqConfig`
 *   - DEPOIMENTOS ............. veja `testimonialsConfig`
 *   - FOTOS ................... campos `image` / `images` / `gallery`
 *
 *  ARQUITETURA PREPARADA PARA CMS:
 *   No futuro, basta trocar estas constantes por chamadas a um CMS
 *   (Sanity, Supabase, Firebase, Strapi) mantendo os mesmos formatos.
 * =====================================================================
 */

/* ---------------------------------------------------------------------
 *  STATUS DOS EVENTOS
 *  Cada status muda automaticamente a aparência do card e do botão.
 * ------------------------------------------------------------------- */
export type EventStatus =
  | "inscricoes_abertas"
  | "ultimas_vagas"
  | "turma_quase_lotada"
  | "esgotado"
  | "encerrado"
  | "em_breve"

export interface StatusStyle {
  /** Texto exibido na etiqueta de status */
  label: string
  /** Texto do botão para este status */
  cta: string
  /** Se o botão leva ao checkout (true) ou é apenas informativo (false) */
  actionable: boolean
  /** Cor de destaque (token do tema) */
  tone: "open" | "warning" | "closed" | "soon"
}

export const statusConfig: Record<EventStatus, StatusStyle> = {
  inscricoes_abertas: {
    label: "Inscrições abertas",
    cta: "Garantir minha vaga",
    actionable: true,
    tone: "open",
  },
  ultimas_vagas: {
    label: "Últimas vagas",
    cta: "Garantir minha vaga",
    actionable: true,
    tone: "warning",
  },
  turma_quase_lotada: {
    label: "Turma quase lotada",
    cta: "Garantir minha vaga",
    actionable: true,
    tone: "warning",
  },
  esgotado: {
    label: "Esgotado",
    cta: "Lista de espera",
    actionable: true,
    tone: "closed",
  },
  encerrado: {
    label: "Encerrado",
    cta: "Ver próximos eventos",
    actionable: false,
    tone: "closed",
  },
  em_breve: {
    label: "Em breve",
    cta: "Avise-me",
    actionable: true,
    tone: "soon",
  },
}

/* ---------------------------------------------------------------------
 *  EVENTO / TURMA
 * ------------------------------------------------------------------- */
export interface EventItem {
  id: string
  slug: string
  title: string
  subtitle?: string
  audience: string
  description: string
  dates: string[]
  time: string
  numberOfMeetings: number
  city: string
  location: string
  address: string
  price: string
  pricePerMeeting?: string
  minAge?: number
  maxAge?: number
  availableSpots?: number
  status: EventStatus
  /** Link externo de pagamento (Sympla, Mercado Pago, Stripe...) */
  checkoutUrl: string
  image: string
}

/* =====================================================================
 *  >>> EVENTOS / TURMAS <<<
 *  Adicione, edite ou remova objetos deste array.
 *  Cada objeto é uma turma independente.
 * ===================================================================== */
export const events: EventItem[] = [
  {
    id: "adultos-julho",
    slug: "raizes-e-ritmos-adultos",
    title: "Raízes e Ritmos",
    subtitle: "Vivência para adultos",
    audience: "Adultos",
    description:
      "Uma imersão em música, corpo e encontro. Três encontros para cantar, experimentar ritmos de Moçambique e criar coletivamente.",
    dates: ["29 de julho", "30 de julho", "31 de julho"],
    time: "16h às 18h",
    numberOfMeetings: 3,
    city: "Tatuí, SP",
    location: "Afetos Terapia, Arte e Vivencias",
    address: "Rua Jose Bonifacio, 1121 — Centro",
    price: "R$ 120",
    pricePerMeeting: "R$ 40",
    minAge: 16,
    maxAge: 99,
    availableSpots: 20,
    status: "inscricoes_abertas",
    checkoutUrl: "https://www.sympla.com.br/evento/vivencias-de-mocambique-para-o-bem-estar/3505004?share_id=copiarlink", // TROQUE pelo link real de pagamento
    image: "/images/raizes6.jpg",
  },
  {
    id: "criancas-agosto",
    slug: "raizes-e-ritmos-criancas",
    title: "Raízes e Ritmos",
    subtitle: "Vivência para crianças",
    audience: "Crianças",
    description:
      "Jogos tradicionais africanos, ritmo e brincadeira. Uma experiência lúdica de música e movimento para os pequenos.",
    dates: ["12 de agosto", "13 de agosto"],
    time: "10h às 11h30",
    numberOfMeetings: 2,
    city: "São Paulo, SP",
    location: "Espaço Cultural Raízes",
    address: "Rua da Consolação, 1000 — Consolação",
    price: "R$ 80",
    pricePerMeeting: "R$ 40",
    minAge: 6,
    maxAge: 11,
    availableSpots: 15,
    status: "ultimas_vagas",
    checkoutUrl: "https://www.sympla.com.br/", // TROQUE pelo link real de pagamento
    image: "/images/event-kids.png",
  },
  {
    id: "adultos-setembro",
    slug: "raizes-e-ritmos-imersao",
    title: "Raízes e Ritmos",
    subtitle: "Imersão de fim de semana",
    audience: "Adultos",
    description:
      "Uma imersão intensiva de dois dias mergulhando na música, na dança e na criação coletiva moçambicana.",
    dates: ["20 de setembro", "21 de setembro"],
    time: "14h às 18h",
    numberOfMeetings: 2,
    city: "Rio de Janeiro, RJ",
    location: "Casa das Artes",
    address: "Rua do Catete, 200 — Catete",
    price: "R$ 180",
    pricePerMeeting: "R$ 90",
    minAge: 16,
    maxAge: 99,
    availableSpots: 25,
    status: "em_breve",
    checkoutUrl: "https://www.sympla.com.br/", // TROQUE pelo link real de pagamento
    image: "/images/event-adults.png",
  },
]

/* =====================================================================
 *  >>> EVENTOS ENCERRADOS / HISTÓRICO ("Já vivemos juntos") <<<
 * ===================================================================== */
export interface PastEvent {
  id: string
  title: string
  city: string
  date: string
  image: string
  videoUrl?: string
}

export const pastEvents: PastEvent[] = [
  {
    id: "past-sp-2024",
    title: "Vivência Raízes e Ritmos",
    city: "Tatuí, SP",
    date: "Maio de 2026",
    image: "/images/raizes9.jpg",
    videoUrl: "", // opcional: link de vídeo do YouTube
  },
  {
    id: "past-bh-2024",
    title: "Imersão de Música e Movimento",
    city: "Tatuí, SP",
    date: "Março de 2026",
    image: "/images/raizes1.jpg",
  },
  {
    id: "past-rj-2023",
    title: "Encontro Intercultural com estudantes de musicalização",
    city: "Tatuí, SP",
    date: "Abril de 2026",
    image: "/images/raizes4.jpg",
  },
]

/* ---------------------------------------------------------------------
 *  PROJETO (identidade e textos principais)
 * ------------------------------------------------------------------- */
export const projectConfig = {
  name: "Raízes e Ritmos",
  tagline: "Vivências Musicais de Moçambique",
  hero: {
    eyebrow: "Vivências Musicais de Moçambique",
    titleLines: ["Raízes", "e", "Ritmos"],
    subtitle:
      "Vivências musicais interculturais de Moçambique através da música, do movimento, do canto, da dança e da criação coletiva.",
    withText: "Com Leusio Gil",
    withSubtext: "Músico, compositor e educador moçambicano.",
    primaryCta: "Quero viver essa experiência",
    secondaryCta: "Conhecer as oficinas",
    scrollHint: "Scroll para viver",
    /** Imagem de fundo do Hero (troque por vídeo se desejar) */
    media: "/images/hero.png",
    /** Opcional: URL de vídeo de fundo (mp4). Se preenchido, tem prioridade. */
    videoUrl: "",
  },
}

/* ---------------------------------------------------------------------
 *  SEÇÕES DE CONTEÚDO
 * ------------------------------------------------------------------- */
export const sectionsConfig = {
  experience: {
    title: "Você não vai apenas aprender.\nVocê vai viver.",
    text: "Raízes e Ritmos é uma experiência intercultural que aproxima pessoas da cultura de Moçambique através da música, do corpo e do encontro. Durante as vivências, os participantes são convidados a cantar, experimentar ritmos, movimentar o corpo, conhecer jogos tradicionais africanos e criar música coletivamente.",
    keywords: [
      "Música",
      "Ritmo",
      "Canto",
      "Dança",
      "Movimento",
      "Jogos",
      "Cultura",
      "Conexão",
    ],
  },
  events: {
    eyebrow: "Eventos disponíveis",
    title: "Escolha sua experiência",
  },
  methodology: {
    eyebrow: "Metodologia",
    title: "Uma experiência inspirada em música, corpo e encontro.",
    text: "A metodologia do Raízes e Ritmos é inspirada nos princípios da musicoterapia de Kenneth Bruscia e na abordagem de educação musical de Carl Orff, integrando música, corpo, voz, ritmo, movimento, improvisação e criação coletiva. Os encontros valorizam a participação ativa, a escuta, a criatividade e a experiência musical como forma de expressão e interação.",
    keywords: ["Corpo", "Ritmo", "Voz", "Movimento", "Criação", "Conexão"],
    note: "A proposta possui caráter artístico, educativo e intercultural, não tendo finalidade de atendimento clínico ou terapêutico.",
  },
  culture: {
    eyebrow: "Cultura",
    title: "Uma cultura que se escuta.\nSe move.\nSe vive.",
    text: "Moçambique é um país de muitas culturas, línguas, ritmos e tradições. O Raízes e Ritmos convida você a conhecer parte desse universo através da música e da perspectiva de um artista moçambicano.",
    /** Galeria de imagens */
    gallery: [
      "/images/raizes8.jpg",
      "/images/raizes7.jpg",
      "/images/raizes5.jpg",
    ],
  },
  upcoming: {
    eyebrow: "Agenda",
    title: "Próximas experiências",
  },
  past: {
    eyebrow: "Histórico",
    title: "Já vivemos juntos",
    text: "Momentos que construímos em roda, em diferentes cidades.",
  },
  testimonials: {
    eyebrow: "Depoimentos",
    title: "O que dizem quem já viveu",
  },
  faq: {
    eyebrow: "Dúvidas",
    title: "Perguntas frequentes",
  },
  finalCta: {
    title: "Seu ritmo também faz parte dessa roda.",
    text: "Venha conhecer novos ritmos, experimentar novas formas de expressão e descobrir um pouco da cultura de Moçambique.",
    cta: "Quero viver essa experiência",
  },
}

/* ---------------------------------------------------------------------
 *  FACILITADOR
 * ------------------------------------------------------------------- */
export const instructorConfig = {
  name: "Leusio Gil",
  roles: ["Músico", "Compositor", "Educador", "Artista Moçambicano"],
  bio: "Leusio Gil é músico, compositor e educador moçambicano. Através de sua trajetória artística, dedica-se a compartilhar a riqueza cultural de Moçambique, criando experiências que conectam música, corpo e encontro. Seu trabalho atravessa fronteiras, aproximando pessoas de diferentes lugares por meio do ritmo e da criação coletiva.",
  image: "/images/fotobioleusiogil.jpg",
}

/* ---------------------------------------------------------------------
 *  DEPOIMENTOS
 * ------------------------------------------------------------------- */
export interface Testimonial {
  id: string
  name: string
  city: string
  text: string
  image?: string
}

export const testimonialsConfig: Testimonial[] = [
  {
    id: "t1",
    name: "Mariana Alves",
    city: "São Paulo, SP",
    text: "Foi uma das experiências mais transformadoras que já vivi. Saí de lá leve, conectada e com vontade de cantar.",
  },
  {
    id: "t2",
    name: "Rafael Costa",
    city: "Rio de Janeiro, RJ",
    text: "O Leusio conduz de forma tão acolhedora que mesmo quem nunca fez música se sente à vontade. Recomendo demais.",
  },
  {
    id: "t3",
    name: "Juliana Santos",
    city: "Belo Horizonte, MG",
    text: "Muito mais que uma oficina — é um mergulho na cultura de Moçambique através do corpo e do ritmo.",
  },
]

/* ---------------------------------------------------------------------
 *  FAQ
 * ------------------------------------------------------------------- */
export interface FaqItem {
  question: string
  answer: string
}

export const faqConfig: FaqItem[] = [
  {
    question: "Preciso saber música?",
    answer:
      "Não. As vivências são abertas a todos os níveis. Você não precisa de nenhuma experiência prévia — o convite é para experimentar e sentir.",
  },
  {
    question: "Qual é a idade da turma?",
    answer:
      "Cada turma tem uma faixa etária indicada. Confira as informações de cada evento na seção de experiências disponíveis.",
  },
  {
    question: "O que devo levar?",
    answer:
      "Apenas roupas confortáveis que permitam movimento. Todos os instrumentos e materiais são fornecidos.",
  },
  {
    question: "Posso participar sem experiência?",
    answer:
      "Sim! A proposta valoriza a participação ativa e a escuta. Não é necessário nenhum conhecimento musical.",
  },
  {
    question: "Como faço minha inscrição?",
    answer:
      "Escolha a turma desejada na seção de eventos e clique em 'Garantir minha vaga'. Você será direcionado ao pagamento.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento é feito de forma segura na plataforma parceira. O valor e as condições estão descritos em cada turma.",
  },
  {
    question: "A oficina é musicoterapia?",
    answer:
      "Não. A proposta possui caráter artístico, educativo e intercultural, não tendo finalidade de atendimento clínico ou terapêutico.",
  },
]

/* ---------------------------------------------------------------------
 *  REDES SOCIAIS E CONTATO
 * ------------------------------------------------------------------- */
export const socialConfig = {
  whatsapp: "https://wa.me/5511999999999", 
  instagram: "https://instagram.com/raizeseritmos", 
  youtube: "https://youtube.com/@raizeseritmos", 
  email: "contato@raizeseritmos.com",
}

/* ---------------------------------------------------------------------
 *  SEO / METADADOS
 * ------------------------------------------------------------------- */
export const seoConfig = {
  title: "Raízes e Ritmos — Vivências Musicais de Moçambique",
  description:
    "Leusio Gil é músico, compositor e educador moçambicano no Brasil. Conheça o Raízes e Ritmos, projeto de vivências interculturais com música, canto, dança, movimento e criação coletiva.",
  url: "https://www.raizeseritmos.art.br",
  ogImage: "/images/raizes.png",
  locale: "pt_BR",
}
