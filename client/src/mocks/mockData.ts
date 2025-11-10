import type {
  FocusSession,
  JournalEntry,
  MeditationCategory,
  MeditationSession,
  ProTrack,
  User,
} from "@shared/schema";

const now = new Date();

export const mockUser: User = {
  id: "user-demo",
  email: "demo@mindly.app",
  firstName: "Alex",
  lastName: "Silva",
  profileImageUrl: "",
  isPro: true,
  plan: "pro",
  storageLimitMb: 2048,
  dailyJournalCount: 1,
  lastJournalDate: now,
  createdAt: now,
  updatedAt: now,
};

export const mockJournalEntries: JournalEntry[] = [
  {
    id: "journal-1",
    userId: mockUser.id,
    content:
      "Hoje consegui manter o foco por mais tempo e fiz uma meditação curta após o almoço.",
    aiAnalysis:
      "Parabéns por cuidar do seu foco e da sua mente! Continue celebrando essas pequenas vitórias.",
    mood: "positive",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "journal-2",
    userId: mockUser.id,
    content:
      "Senti ansiedade antes da apresentação, mas consegui controlar a respiração e finalizar meu trabalho.",
    aiAnalysis:
      "Você demonstrou muita coragem ao enfrentar a ansiedade. Continue acolhendo suas emoções com gentileza.",
    mood: "neutral",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
  },
];

export const mockMeditationCategories: MeditationCategory[] = [
  {
    id: "cat-focus",
    name: "Foco Produtivo",
    description: "Sessões rápidas para ativar clareza mental antes do trabalho.",
    isPro: false,
    icon: "Target",
    createdAt: now,
  },
  {
    id: "cat-sleep",
    name: "Sono Restaurador",
    description: "Meditações noturnas para desacelerar e dormir melhor.",
    isPro: true,
    icon: "Moon",
    createdAt: now,
  },
];

export const mockMeditationSessions: MeditationSession[] = [
  {
    id: "session-1",
    categoryId: "cat-focus",
    title: "Respiração de Clareza",
    description: "Respiração profunda e visualização para entrar em estado de foco.",
    duration: 6,
    audioUrl:
      "https://xzulekqzbwieeiahskwb.supabase.co/storage/v1/object/public/video%20meditacao/YTDown.com_YouTube_5-Minute-Meditation-You-Can-Do-Anywhere_Media_inpok4MKVLM_001_1080p.mp4",
    isPro: false,
    createdAt: now,
  },
  {
    id: "session-2",
    categoryId: "cat-focus",
    title: "Reset de 5 Minutos",
    description: "Pausa curta para reorganizar ideias e retomar a produtividade.",
    duration: 5,
    audioUrl:
      "https://xzulekqzbwieeiahskwb.supabase.co/storage/v1/object/public/video%20meditacao/YTDown.com_YouTube_Media_2w-FNiySmKk_001_1080p.mp4",
    isPro: false,
    createdAt: now,
  },
  {
    id: "session-5",
    categoryId: "cat-sleep",
    title: "Ritual do Sono Profundo",
    description: "Sequência de relaxamento para desligar a mente antes de dormir.",
    duration: 12,
    audioUrl:
      "https://xzulekqzbwieeiahskwb.supabase.co/storage/v1/object/public/video%20meditacao/YTDown.com_YouTube_Media_dfi11cxr1NM_003_480p.mp4",
    isPro: true,
    createdAt: now,
  },
];

export const mockProTracks: ProTrack[] = [
  {
    id: "track-focus",
    title: "21 Dias de Foco e Clareza Mental",
    description: "Construa hábitos de alta performance com um roteiro guiado pela Mindly.",
    duration: 21,
    icon: "Target",
    createdAt: now,
  },
  {
    id: "track-calm",
    title: "7 Dias de Paz Interior",
    description: "Reduza a ansiedade e reequilibre emoções com exercícios práticos.",
    duration: 7,
    icon: "Sparkles",
    createdAt: now,
  },
  {
    id: "track-sleep",
    title: "Desafio Sono Perfeito",
    description: "Ritual completo para noites tranquilas e revigorantes.",
    duration: 10,
    icon: "Moon",
    createdAt: now,
  },
];

export const mockFocusSessions: FocusSession[] = [
  {
    id: "focus-1",
    userId: mockUser.id,
    duration: 25,
    completedAt: new Date(now.getTime() - 1000 * 60 * 60 * 48),
    date: new Date(now.getTime() - 1000 * 60 * 60 * 48),
  },
  {
    id: "focus-2",
    userId: mockUser.id,
    duration: 25,
    completedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    date: new Date(now.getTime() - 1000 * 60 * 60 * 24),
  },
];

export const mockMeditationMinutes = 120;

