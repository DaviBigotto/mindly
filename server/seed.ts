// Database seed script - populate with initial meditation categories and sessions
import { db } from "./db";
import { meditationCategories, meditationSessions, proTracks, trackSteps, premiumSounds } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    await db.delete(trackSteps);
    await db.delete(proTracks);
    await db.delete(meditationSessions);
    await db.delete(meditationCategories);
    await db.delete(premiumSounds);

    // Seed meditation categories
    const categories = await db.insert(meditationCategories).values([
      {
        id: "focus",
        name: "Foco",
        description: "Meditações para concentração e clareza mental",
        isPro: false,
      },
      {
        id: "relaxation",
        name: "Relaxamento",
        description: "Acalme sua mente e reduza o estresse",
        isPro: false,
      },
      {
        id: "sleep",
        name: "Sono",
        description: "Meditações guiadas para dormir melhor",
        isPro: true,
      },
      {
        id: "anxiety",
        name: "Ansiedade",
        description: "Técnicas para gerenciar ansiedade e preocupações",
        isPro: true,
      },
      {
        id: "confidence",
        name: "Autoconfiança",
        description: "Fortaleça sua autoestima e confiança interior",
        isPro: true,
      },
    ]).returning();

    console.log("✅ Created meditation categories");

    // Seed meditation sessions
    await db.insert(meditationSessions).values([
      // Focus category (Free)
      {
        categoryId: "focus",
        title: "Respiração para Foco",
        description: "Aumente sua concentração com técnicas de respiração consciente",
        duration: 10,
        audioUrl: "/audio/focus-breathing.mp3",
        isPro: false,
      },
      {
        categoryId: "focus",
        title: "Atenção Plena no Trabalho",
        description: "Meditação rápida para melhorar produtividade",
        duration: 5,
        audioUrl: "/audio/mindful-work.mp3",
        isPro: false,
      },
      // Relaxation category (Free)
      {
        categoryId: "relaxation",
        title: "Relaxamento Guiado",
        description: "Libere tensões e encontre paz interior",
        duration: 15,
        audioUrl: "/audio/guided-relaxation.mp3",
        isPro: false,
      },
      {
        categoryId: "relaxation",
        title: "Meditação do Mar",
        description: "Deixe-se levar pelas ondas da tranquilidade",
        duration: 20,
        audioUrl: "/audio/ocean-meditation.mp3",
        isPro: false,
      },
      // Sleep category (PRO)
      {
        categoryId: "sleep",
        title: "Sono Profundo",
        description: "Adormeça naturalmente com esta meditação suave",
        duration: 30,
        audioUrl: "/audio/deep-sleep.mp3",
        isPro: true,
      },
      {
        categoryId: "sleep",
        title: "Visualização para Dormir",
        description: "Viaje para um lugar de paz e descanso",
        duration: 25,
        audioUrl: "/audio/sleep-visualization.mp3",
        isPro: true,
      },
      // Anxiety category (PRO)
      {
        categoryId: "anxiety",
        title: "Liberando Ansiedade",
        description: "Técnicas eficazes para acalmar a mente ansiosa",
        duration: 15,
        audioUrl: "/audio/releasing-anxiety.mp3",
        isPro: true,
      },
      {
        categoryId: "anxiety",
        title: "Respiração 4-7-8",
        description: "Método cientificamente comprovado para reduzir ansiedade",
        duration: 10,
        audioUrl: "/audio/478-breathing.mp3",
        isPro: true,
      },
      // Confidence category (PRO)
      {
        categoryId: "confidence",
        title: "Afirmações Positivas",
        description: "Fortaleça sua autoestima com afirmações poderosas",
        duration: 12,
        audioUrl: "/audio/positive-affirmations.mp3",
        isPro: true,
      },
      {
        categoryId: "confidence",
        title: "Seu Eu Poderoso",
        description: "Conecte-se com sua força e confiança interior",
        duration: 18,
        audioUrl: "/audio/powerful-self.mp3",
        isPro: true,
      },
    ]);

    console.log("✅ Created meditation sessions");

    // Seed Pro tracks
    const tracks = await db.insert(proTracks).values([
      {
        id: "focus-21",
        title: "21 Dias de Foco e Clareza Mental",
        description: "Melhore a produtividade consciente com técnicas de foco, visualização e reprogramação mental",
        duration: 21,
      },
      {
        id: "peace-7",
        title: "7 Dias de Paz Interior",
        description: "Combata o estresse e fortaleça o equilíbrio emocional com gratidão, respiração e autoaceitação",
        duration: 7,
      },
      {
        id: "sleep-challenge",
        title: "Desafio Sono Perfeito",
        description: "Guia para melhorar a qualidade do sono e o relaxamento profundo com rituais noturnos",
        duration: 7,
      },
    ]).returning();

    console.log("✅ Created Pro tracks");

    // Seed track steps for "21 Dias de Foco"
    await db.insert(trackSteps).values([
      {
        trackId: "focus-21",
        dayNumber: 1,
        title: "Descobrindo seu Porquê",
        description: "Identifique suas motivações e objetivos pessoais",
        content: "Hoje você vai refletir sobre o que realmente importa na sua vida e por que você quer melhorar seu foco.",
      },
      {
        trackId: "focus-21",
        dayNumber: 2,
        title: "Respiração Consciente",
        description: "Aprenda a técnica fundamental de respiração para foco",
        content: "A respiração consciente é a base de toda meditação. Pratique a respiração 4-4-4 hoje.",
      },
      {
        trackId: "focus-21",
        dayNumber: 3,
        title: "Eliminando Distrações",
        description: "Identifique e minimize suas maiores distrações",
        content: "Faça uma lista das suas principais distrações e crie um plano para minimizá-las.",
      },
    ]);

    // Seed track steps for "7 Dias de Paz Interior"
    await db.insert(trackSteps).values([
      {
        trackId: "peace-7",
        dayNumber: 1,
        title: "Gratidão Matinal",
        description: "Comece o dia agradecendo por 3 coisas",
        content: "A gratidão é o caminho mais rápido para a paz interior. Liste 3 coisas pelas quais você é grato hoje.",
      },
      {
        trackId: "peace-7",
        dayNumber: 2,
        title: "Perdão e Libertação",
        description: "Libere ressentimentos e encontre paz",
        content: "Hoje você vai praticar o perdão - primeiro de si mesmo, depois dos outros.",
      },
    ]);

    // Seed track steps for "Desafio Sono Perfeito"
    await db.insert(trackSteps).values([
      {
        trackId: "sleep-challenge",
        dayNumber: 1,
        title: "Criando seu Ritual Noturno",
        description: "Estabeleça uma rotina relaxante antes de dormir",
        content: "Crie um ritual de 30 minutos que sinalize ao seu corpo que é hora de descansar.",
      },
      {
        trackId: "sleep-challenge",
        dayNumber: 2,
        title: "Desconexão Digital",
        description: "Aprenda a desligar dispositivos 1h antes de dormir",
        content: "A luz azul interfere na produção de melatonina. Pratique desligar telas cedo hoje.",
      },
    ]);

    console.log("✅ Created track steps");

    // Seed premium sounds
    await db.insert(premiumSounds).values([
      {
        title: "Chuva na Floresta 3D",
        description: "Áudio binaural imersivo de chuva tropical",
        audioUrl: "/audio/premium/rain-forest-3d.mp3",
        duration: 60,
        category: "nature",
      },
      {
        title: "Ondas do Oceano",
        description: "Som relaxante de ondas quebrando na praia",
        audioUrl: "/audio/premium/ocean-waves.mp3",
        duration: 45,
        category: "nature",
      },
      {
        title: "Frequência 432Hz",
        description: "Tom puro em frequência de cura",
        audioUrl: "/audio/premium/432hz.mp3",
        duration: 30,
        category: "tones",
      },
      {
        title: "Batidas Binaurais - Foco",
        description: "Frequências específicas para concentração",
        audioUrl: "/audio/premium/binaural-focus.mp3",
        duration: 20,
        category: "binaural",
      },
    ]);

    console.log("✅ Created premium sounds");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
