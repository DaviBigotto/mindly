import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Brain, ArrowLeft, Sparkles, TrendingUp, Minus, TrendingDown, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { JournalEntry, User } from "@shared/schema";

export default function Journal() {
  const { user, isPro } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const { data: entries = [] } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });

  const { data: userData } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const canAnalyze = isPro || (userData?.dailyJournalCount ?? 0) < 2;

  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/journal/analyze", { content: text });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setContent("");
      toast({
        title: "Análise concluída",
        description: "Seu registro foi salvo com sucesso",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "Você precisa estar logado para continuar",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Aviso",
        description: "Por favor, escreva algo antes de analisar",
        variant: "destructive",
      });
      return;
    }

    if (!canAnalyze) {
      setShowPaywall(true);
      return;
    }

    analyzeMutation.mutate(content);
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
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
              data-testid="button-back"
            >
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-semibold">Mindly</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
              data-testid="button-profile"
            >
              <Link href="/profile">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt="Perfil" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-heading font-bold">
              Como você se sente hoje?
            </h1>
            <p className="text-lg text-muted-foreground">
              Escreva livremente sobre seus sentimentos e pensamentos
            </p>
          </div>

          {/* Usage Limit Badge */}
          {!isPro && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-sm">
                Análises hoje: {userData?.dailyJournalCount ?? 0}/2
                {(userData?.dailyJournalCount ?? 0) >= 2 && " - Faça upgrade para Pro para análises ilimitadas"}
              </Badge>
            </div>
          )}

          {/* Journal Input */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Seu Diário</CardTitle>
              <CardDescription>
                A IA analisará seu texto e oferecerá insights empáticos sobre seu humor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Escreva sobre como você está se sentindo hoje..."
                className="min-h-[200px] resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                data-testid="input-journal-content"
              />
              <Button
                onClick={handleSubmit}
                disabled={analyzeMutation.isPending || !content.trim()}
                className="w-full"
                size="lg"
                data-testid="button-analyze-mood"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  "Analisar meu humor"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Mood Chart */}
          {entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Gráfico de Humor Semanal</CardTitle>
                <CardDescription>
                  Acompanhe a variação do seu humor ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          borderRadius: "0.375rem",
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
            </Card>
          )}

          {/* Recent Entries */}
          {entries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-semibold">Registros Recentes</h2>
              <div className="space-y-4">
                {entries.slice(-5).reverse().map((entry) => (
                  <Card key={entry.id} data-testid={`entry-${entry.id}`}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-muted-foreground flex-1">
                          {entry.content}
                        </p>
                        {entry.mood && (
                          <Badge variant="outline" className={`flex items-center gap-1 flex-shrink-0 ${getMoodColor(entry.mood)}`}>
                            {getMoodIcon(entry.mood)}
                            {getMoodLabel(entry.mood)}
                          </Badge>
                        )}
                      </div>
                      {entry.aiAnalysis && (
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                          <div className="flex gap-3">
                            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground">
                              {entry.aiAnalysis}
                            </p>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
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
            </div>
          )}

          {/* Empty State */}
          {entries.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-semibold">
                    Comece seu diário emocional
                  </h3>
                  <p className="text-muted-foreground">
                    Escreva acima e receba análises empáticas da IA sobre seus sentimentos
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upgrade CTA for free users who hit limit */}
          {!isPro && !canAnalyze && (
            <Card className="border-pro/30 bg-gradient-to-br from-pro/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-pro" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-xl font-heading font-semibold">
                      Análises ilimitadas com Mindly Pro
                    </h3>
                    <p className="text-muted-foreground">
                      Você atingiu o limite de 2 análises diárias. Faça upgrade para Pro e tenha acesso ilimitado à IA emocional
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="bg-pro hover:bg-pro/90 text-white flex-shrink-0"
                    data-testid="button-upgrade-pro-journal"
                  >
                    <Link href="/subscribe">
                      Assinar Pro
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
