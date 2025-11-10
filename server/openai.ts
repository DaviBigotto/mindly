// Sistema de análise de sentimento baseado em palavras-chave
// Não utiliza OpenAI ou ChatGPT

// Palavras-chave para detecção de sentimento positivo
const positiveKeywords = [
  "feliz", "alegre", "alegria", "grato", "gratidão", "grata", "orgulho", "orgulhoso", "orgulhosa",
  "paz", "calma", "calmo", "calma", "bem", "ótimo", "excelente", "maravilhoso", "maravilhosa",
  "incrível", "perfeito", "perfeita", "fantástico", "fantástica", "ótima", "bom", "boa",
  "satisfeito", "satisfeita", "contente", "realizado", "realizada", "vencedor", "vencedora",
  "sucesso", "conquista", "conquistas", "vitória", "esperança", "esperançoso", "esperançosa",
  "animado", "animada", "empolgado", "empolgada", "entusiasmado", "entusiasmada", "motivado", "motivada",
  "energia", "energético", "energética", "positivo", "positiva", "otimista", "confiante",
  "amor", "amar", "amado", "amada", "querido", "querida", "carinho", "carinhoso", "carinhosa",
  "amoroso", "amorosa", "afeto", "afetuoso", "afetuosa", "abrigo", "seguro", "segura",
  "tranquilo", "tranquila", "sereno", "serena", "relaxado", "relaxada", "descansado", "descansada",
  "renovado", "renovada", "revigorado", "revigorada", "forte", "fortaleza", "resiliente",
  "coragem", "corajoso", "corajosa", "bravo", "brava", "determinado", "determinada",
  "foco", "focado", "focada", "concentrado", "concentrada", "produtivo", "produtiva",
  "crescer", "crescimento", "evoluir", "evolução", "aprender", "aprendizado", "desenvolver",
  "progresso", "melhorar", "melhoria", "superar", "superação", "vencer", "vencedor", "vencedora",
];

// Palavras-chave para detecção de sentimento negativo
const negativeKeywords = [
  "triste", "tristeza", "deprimido", "deprimida", "depressão", "ansioso", "ansiosa", "ansiedade",
  "medo", "amedrontado", "amedrontada", "assustado", "assustada", "pavor", "terror",
  "raiva", "irritado", "irritada", "irritação", "nervoso", "nervosa", "nervosismo",
  "frustrado", "frustrada", "frustração", "desapontado", "desapontada", "decepção",
  "mal", "ruim", "péssimo", "péssima", "horrível", "terrível", "pior", "piora",
  "cansado", "cansada", "cansaço", "exausto", "exausta", "exaustão", "esgotado", "esgotada",
  "estressado", "estressada", "estresse", "tensão", "tenso", "tensa", "pressão",
  "preocupado", "preocupada", "preocupação", "inquieto", "inquieta", "inquietude",
  "desanimado", "desanimada", "desânimo", "desesperança", "desesperado", "desesperada",
  "sozinho", "sozinha", "solidão", "isolado", "isolada", "isolamento", "abandonado", "abandonada",
  "culpa", "culpado", "culpada", "culpabilidade", "vergonha", "envergonhado", "envergonhada",
  "inseguro", "insegura", "insegurança", "dúvida", "duvidar", "incerto", "incerta",
  "confuso", "confusa", "confusão", "perdido", "perdida", "perda", "luto", "chorar",
  "dor", "dolorido", "dolorida", "machucado", "machucada", "ferido", "ferida", "ferimento",
  "difícil", "dificuldade", "problema", "problemas", "complicado", "complicada",
  "falha", "fracasso", "falhar", "errar", "erro", "erros", "derrota", "perder",
  "ódio", "odiar", "raiva", "rancor", "ressentimento", "mágoa", "machucado", "machucada",
  "vazio", "vazia", "vazio interior", "sem sentido", "sem propósito", "sem esperança",
  "desmotivado", "desmotivada", "sem energia", "sem forças", "fraco", "fraca", "fragilidade",
];

// Palavras de negação que invertem o sentimento
const negationWords = [
  "não", "nunca", "jamais", "nem", "nenhum", "nenhuma", "ninguém", "nada",
  "sem", "falta", "faltando", "ausente", "ausência", "deixar de", "parar de",
];

// Frases empáticas para cada tipo de sentimento
const empatheticResponses = {
  positive: [
    "Que bom saber que você está se sentindo bem! Continue cultivando esses momentos positivos e celebrando suas conquistas. Você merece toda essa felicidade!",
    "É maravilhoso ver você assim! Esses momentos de bem-estar são preciosos. Aproveite para registrar e lembrar dessas sensações boas.",
    "Fico muito feliz por você! Continue cuidando de si mesmo e mantendo essa energia positiva. Você está no caminho certo!",
    "Que alegria ler suas palavras! Celebre essas conquistas e momentos de paz. Você está fazendo um trabalho incrível consigo mesmo.",
  ],
  neutral: [
    "Obrigado por compartilhar seus pensamentos. É importante reconhecer e acolher todas as suas emoções, mesmo as que parecem neutras. Continue cuidando de si mesmo.",
    "Vejo que você está em um momento de equilíbrio. Isso é natural e saudável. Continue observando suas emoções com carinho e atenção.",
    "Agradeço por confiar em mim com seus pensamentos. Cada registro é um passo importante no seu caminho de autoconhecimento. Continue escrevendo.",
    "É normal ter momentos mais neutros. Eles também fazem parte da nossa jornada emocional. Continue se observando com gentileza.",
  ],
  negative: [
    "Vejo que você está passando por um momento difícil. Saiba que seus sentimentos são válidos e você não está sozinho. Respire com calma e dê tempo para si mesmo. Você é mais forte do que imagina.",
    "Sinto muito que você esteja se sentindo assim. É corajoso da sua parte compartilhar isso. Lembre-se de que momentos difíceis passam e você tem a capacidade de superá-los. Cuide-se com carinho.",
    "Entendo que este momento não está fácil. Suas emoções são importantes e merecem ser acolhidas. Respire fundo e saiba que há esperança. Você não está sozinho nessa jornada.",
    "Vejo que você está enfrentando desafios. É normal ter dias difíceis, e reconhecer isso já é um grande passo. Permita-se sentir, mas também permita-se descansar e se cuidar. Você consegue!",
    "Agradeço por confiar em mim com seus sentimentos. Momentos difíceis fazem parte da vida, mas eles não definem quem você é. Continue se cuidando e saiba que há luz no fim do túnel.",
  ],
};

/**
 * Analisa o sentimento de um texto em português
 * @param text Texto a ser analisado
 * @returns Objeto com o humor (positive, neutral, negative) e uma análise empática
 */
export async function analyzeMood(text: string): Promise<{
  mood: "positive" | "neutral" | "negative";
  analysis: string;
}> {
  if (!text || text.trim().length === 0) {
    return {
      mood: "neutral",
      analysis: empatheticResponses.neutral[0],
    };
  }

  const lowerText = text.toLowerCase().trim();
  
  // Normaliza o texto removendo acentos e caracteres especiais para melhor matching
  const normalizedText = lowerText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ");

  // Divide o texto em palavras
  const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  // Verifica cada palavra contra as listas de palavras-chave
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = i + 1 < words.length ? words[i] + " " + words[i + 1] : "";
    const prevWord = i > 0 ? words[i - 1] : "";
    
    // Verifica se há negação antes da palavra
    const hasNegation = negationWords.some(neg => 
      prevWord.includes(neg) || normalizedText.substring(0, normalizedText.indexOf(word)).endsWith(neg + " ")
    );
    
    // Verifica palavras positivas
    if (positiveKeywords.some(keyword => word.includes(keyword) || keyword.includes(word))) {
      if (hasNegation) {
        negativeScore += 2; // Negação de palavra positiva aumenta score negativo
      } else {
        positiveScore += 1;
      }
    }
    
    // Verifica palavras negativas
    if (negativeKeywords.some(keyword => word.includes(keyword) || keyword.includes(word))) {
      if (hasNegation) {
        positiveScore += 1; // Negação de palavra negativa aumenta score positivo
      } else {
        negativeScore += 1;
      }
    }
    
    // Verifica bigramas (duas palavras juntas)
    if (nextWord) {
      if (positiveKeywords.some(keyword => nextWord.includes(keyword))) {
        positiveScore += 1.5;
      }
      if (negativeKeywords.some(keyword => nextWord.includes(keyword))) {
        negativeScore += 1.5;
      }
    }
  }
  
  // Verifica padrões específicos no texto completo
  const positivePatterns = [
    /estou bem/i,
    /me sinto bem/i,
    /estou feliz/i,
    /me sinto feliz/i,
    /estou grato/i,
    /estou grata/i,
    /tudo certo/i,
    /tudo bem/i,
    /tudo ótimo/i,
    /muito bom/i,
    /muito bem/i,
    /super bem/i,
    /ótimo dia/i,
    /bom dia/i,
    /dia perfeito/i,
  ];
  
  const negativePatterns = [
    /estou mal/i,
    /me sinto mal/i,
    /estou triste/i,
    /me sinto triste/i,
    /não estou bem/i,
    /não me sinto bem/i,
    /tudo ruim/i,
    /tudo errado/i,
    /muito ruim/i,
    /muito mal/i,
    /dia ruim/i,
    /dia péssimo/i,
    /não aguento/i,
    /não consigo/i,
    /não posso mais/i,
    /cansado de/i,
    /cansada de/i,
  ];
  
  // Aplica padrões
  positivePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      positiveScore += 2;
    }
  });
  
  negativePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      negativeScore += 2;
    }
  });
  
  // Determina o humor baseado nos scores
  let mood: "positive" | "neutral" | "negative";
  
  if (positiveScore > negativeScore && positiveScore > 0) {
    mood = "positive";
  } else if (negativeScore > positiveScore && negativeScore > 0) {
    mood = "negative";
  } else {
    mood = "neutral";
  }
  
  // Se não houver scores significativos, considera neutro
  if (positiveScore === 0 && negativeScore === 0) {
    mood = "neutral";
  }
  
  // Seleciona uma resposta empática aleatória baseada no humor
  const responses = empatheticResponses[mood];
  const randomIndex = Math.floor(Math.random() * responses.length);
  const analysis = responses[randomIndex];
  
  return {
    mood,
    analysis,
  };
}
