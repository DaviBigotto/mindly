import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, Sparkles, TrendingUp, Minus, TrendingDown, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { JournalEntry } from "@shared/schema";
import { useAppData } from "@/context/app-data";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Journal() {
  const { user, isPro } = useAuth();
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { journalEntries, dailyJournalCount, addJournalEntryFromAPI } = useAppData();
  const { toast } = useToast();
  const entries: JournalEntry[] = journalEntries;
  const subscribeSectionRef = useRef<HTMLDivElement>(null);

  // Helper para obter headers com email do usuário
  const getApiHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (user?.email) {
      headers["X-User-Email"] = user.email;
    }
    return headers;
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!content.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, escreva algo antes de analisar seu humor.",
        variant: "destructive",
      });
      return;
    }

    if (!isPro) {
      // Rola até a seção "Assinar Mindly Pro"
      subscribeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Se for Pro, processa a análise via API
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        credentials: "include",
        headers: getApiHeaders(),
        body: JSON.stringify({
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao analisar seu humor");
      }

      const entry: JournalEntry = await response.json();
      console.log("Journal entry created:", entry);

      // Adiciona a entrada completa (com análise de IA) ao estado local
      addJournalEntryFromAPI(entry);

      // Limpa o campo de texto
      setContent("");

      // Mostra mensagem de sucesso
      toast({
        title: "Análise concluída! ✨",
        description: "Sua entrada foi salva e analisada com carinho.",
      });

      // Rola até a nova entrada após um pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        const newEntryElement = document.querySelector(`[data-testid="entry-${entry.id}"]`);
        if (newEntryElement) {
          newEntryElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 300);
    } catch (error) {
      console.error("Error analyzing mood:", error);
      toast({
        title: "Erro ao analisar",
        description: error instanceof Error ? error.message : "Não foi possível analisar seu humor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  // Prepare mood chart data (last 7 days)
  const moodChartData = entries
    .slice(-7)
    .map((entry, index) => ({
      day: `Dia ${index + 1}`,
      mood: entry.mood === "positive" ? 3 : entry.mood === "neutral" ? 2 : 1,
    }));

  const getMoodIcon = (mood: string) => {
    if (mood === "positive") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (mood === "neutral") return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getMoodLabel = (mood: string) => {
    if (mood === "positive") return "Positivo";
    if (mood === "neutral") return "Neutro";
    return "Negativo";
  };

  const getMoodColor = (mood: string) => {
    if (mood === "positive") return "bg-green-500/10 text-green-600 border-green-500/20";
    if (mood === "neutral") return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    return "bg-red-500/10 text-red-600 border-red-500/20";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[360px] w-[360px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-8 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full border border-primary/20 bg-primary/10 text-primary shadow-inner shadow-primary/20"
              data-testid="button-back"
            >
              <Link href="/home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 shadow-lg shadow-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-primary/70">
                  Mindly
                </p>
                <p className="font-heading text-lg font-semibold text-foreground">
                  Diário emocional
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full border border-primary/20 bg-primary/10 shadow-inner shadow-primary/20"
              data-testid="button-profile"
            >
              <Link href="/profile">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt="Perfil" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16 pt-12">
        <div className="mx-auto max-w-4xl space-y-10 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 p-8 shadow-xl shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="absolute -right-16 top-10 h-44 w-44 rounded-full bg-primary/10" />
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <Badge className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary">
                  Seu espaço seguro
                </Badge>
                <h1 className="text-4xl font-heading font-semibold text-foreground md:text-[2.6rem]">
                  Como está o seu coração hoje?
                </h1>
                <p className="text-base text-muted-foreground">
                  Reserve alguns minutos para acolher pensamentos, celebrar
                  conquistas ou simplesmente desabafar. A Mindly cuida do resto
                  com um olhar gentil e atento.
                </p>
              </div>
              <div className="w-full max-w-xs rounded-2xl border border-primary/15 bg-primary/10 p-5 text-primary shadow-inner shadow-primary/20">
                <p className="text-xs uppercase tracking-[0.3em]">
                  Análises hoje
                </p>
                <p className="mt-3 text-3xl font-heading font-semibold">
                  {dailyJournalCount}/2
                </p>
                <p className="mt-2 text-xs text-primary/80">
                  {isPro
                    ? "Membro Pro: análises ilimitadas ativadas."
                    : dailyJournalCount < 2
                    ? "Ainda há espaço para mais partilhas hoje."
                    : "Atingiu o limite gratuito. Considere desbloquear o Mindly Pro."}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="rounded-[28px] border border-white/50 bg-white/70 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <CardHeader className="space-y-2">
              <CardTitle className="font-heading text-2xl text-foreground">
                Seu Diário Mindly
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Use palavras para aliviar o peito. Nossa IA responde com carinho
                e guarda suas emoções com segurança.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Textarea
                placeholder="Escreva sobre como você está se sentindo hoje. O que mexeu com você? Do que você tem orgulho?"
                className="min-h-[220px] resize-none rounded-2xl bg-background/70 p-4 shadow-inner shadow-primary/10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                data-testid="input-journal-content"
              />
              <Button
                onClick={handleSubmit}
                className="w-full rounded-full bg-primary shadow-lg shadow-primary/25"
                size="lg"
                data-testid="button-analyze-mood"
                disabled={isAnalyzing || !content.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  "Analisar meu humor com carinho"
                )}
              </Button>
            </CardContent>
          </motion.div>

          {entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="rounded-[28px] border border-white/50 bg-white/70 p-6 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <CardHeader className="-mx-6 -mt-6 rounded-t-[28px] bg-primary/10 px-6 py-5">
                <CardTitle className="font-heading text-xl text-primary">
                  Evolução do seu humor
                </CardTitle>
                <CardDescription className="text-sm text-primary/80">
                  Observe padrões e celebre progressos. Cada escrita é um passo
                  rumo a mais autocuidado.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis domain={[0, 4]} ticks={[1, 2, 3]} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.75rem",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </motion.div>
          )}

          {entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Seus últimos registros
              </h2>
              <div className="space-y-4">
                {entries.slice(-5).reverse().map((entry) => (
                  <Card
                    key={entry.id}
                    className="border border-white/50 bg-white/80 shadow-md shadow-primary/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
                    data-testid={`entry-${entry.id}`}
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                          {entry.content}
                        </p>
                        {entry.mood && (
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1 flex-shrink-0 ${getMoodColor(entry.mood)}`}
                          >
                            {getMoodIcon(entry.mood)}
                            {getMoodLabel(entry.mood)}
                          </Badge>
                        )}
                      </div>
                      {entry.aiAnalysis && (
                        <div className="rounded-2xl border border-primary/10 bg-primary/10 p-4">
                          <div className="flex gap-3">
                            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                            <p className="text-sm text-foreground">
                              {entry.aiAnalysis}
                            </p>
                          </div>
                        </div>
                      )}
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {entries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="border border-white/50 bg-white/80 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <CardContent className="space-y-4 p-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-heading font-semibold text-foreground">
                      Comece seu diário emocional
                    </h3>
                    <p className="text-muted-foreground">
                      Escreva no campo acima e receba insights empáticos e
                      personalizados. Cada registro é um passo rumo a mais
                      bem-estar.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!isPro && (
            <div ref={subscribeSectionRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <Card className="overflow-hidden border-pro/40 bg-gradient-to-br from-pro/10 via-background to-primary/10 shadow-xl shadow-pro/30">
                <CardContent className="relative p-6 md:p-8">
                  <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-pro/25 blur-2xl" />
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-pro/20 px-3 py-1 text-xs font-semibold text-pro">
                        Mindly Pro
                      </span>
                      <h3 className="text-2xl font-heading font-semibold text-foreground">
                        Desbloqueie análises ilimitadas com Mindly Pro
                      </h3>
                      <p className="max-w-xl text-sm text-muted-foreground">
                        Receba respostas acolhedoras sem limites, métricas
                        avançadas e playlists sonoras para escrever com calma.
                      </p>
                    </div>
                    <Button
                      asChild
                      size="lg"
                      className="gap-2 bg-pro hover:bg-pro/90 text-white shadow-lg shadow-pro/30"
                      data-testid="button-upgrade-pro-journal"
                    >
                      <Link href="/subscribe">Assinar Mindly Pro</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
