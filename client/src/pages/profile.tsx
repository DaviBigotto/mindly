import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, Sparkles, Heart, Target, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/context/app-data";
import { useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, isPro, logout } = useAuth();
  const { profileStats, plan, storageLimitMb } = useAppData();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const planStatusLabel = plan === "pro" ? "Ativo" : "Básico";
  const planValue = plan === "pro" ? "Licença vitalícia" : "R$ 19,90/mês";
  const paymentInfo = plan === "pro" ? "Compra realizada via Kiwify" : "Não assinado";
  const storageInfo = `${storageLimitMb} MB`;

  // Mock mood chart data for demo
  const moodChartData = [
    { day: "Dom", mood: 2 },
    { day: "Seg", mood: 3 },
    { day: "Ter", mood: 2 },
    { day: "Qua", mood: 3 },
    { day: "Qui", mood: 2 },
    { day: "Sex", mood: 3 },
    { day: "Sáb", mood: 3 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-[360px] w-[360px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-16 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />
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
                  Perfil mindful
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16 pt-12">
        <div className="mx-auto max-w-4xl space-y-10 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border border-white/50 bg-white/70 shadow-xl shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardContent className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center">
                <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-primary/10" />
                <Avatar className="h-24 w-24 border-4 border-white/70 shadow-lg shadow-primary/20">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt="Perfil" />
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                    <h1 className="text-2xl font-heading font-semibold text-foreground md:text-3xl">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    {isPro ? (
                      <Badge className="bg-pro/20 text-pro border-0">
                        <Sparkles className="mr-1 h-3 w-3" />
                        PRO
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Básico
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    toast({
                      title: "Você saiu da Mindly",
                      description: "Volte quando quiser continuar sua jornada.",
                    });
                    setLocation("/signup");
                  }}
                  data-testid="button-logout"
                  className="rounded-full border-primary/30 text-primary"
                >
                  Sair
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  Registros de humor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p
                  className="text-3xl font-heading font-semibold text-foreground"
                  data-testid="text-journal-count"
                >
                  {profileStats.journalCount}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4" />
                  Minutos meditados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p
                  className="text-3xl font-heading font-semibold text-foreground"
                  data-testid="text-meditation-minutes"
                >
                  {profileStats.meditationMinutes}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Sessões de foco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p
                  className="text-3xl font-heading font-semibold text-foreground"
                  data-testid="text-focus-count"
                >
                  {profileStats.focusCount}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardHeader className="bg-primary/10">
                <CardTitle className="font-heading text-primary">
                  Humor da semana
                </CardTitle>
                <CardDescription className="text-primary/80">
                  Acompanhe suas emoções ao longo dos últimos 7 dias
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
            </Card>
          </motion.div>

          {/* Subscription Management */}
          {plan === "pro" ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Assinatura e Faturamento
                </CardTitle>
                <CardDescription>
                  Gerencie sua licença Mindly Pro adquirida via Kiwify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    {planStatusLabel}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Modelo</span>
                  <span className="font-semibold">{planValue}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Pagamento</span>
                  <span className="text-sm">{paymentInfo}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Limite de espaço</span>
                  <span className="text-sm font-semibold">{storageInfo}</span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  data-testid="button-manage-subscription"
                >
                  <a
                    href={import.meta.env.VITE_KIWIFY_CHECKOUT_URL ?? "https://kiwify.com.br/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver detalhes na Kiwify
                  </a>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Precisa de ajuda? Entre em contato com nosso suporte após a compra.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-pro/30 bg-gradient-to-br from-pro/5 to-transparent">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-pro" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-heading font-semibold">
                      Plano Mindly Basic
                    </h3>
                    <p className="text-muted-foreground">
                      Acesso essencial por R$ 19,90/mês. Atualize para o Mindly Pro para liberar todo o conteúdo.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-primary shadow-inner shadow-primary/20">
                    <span className="font-heading text-xl font-semibold">R$ 19,90/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Espaço disponível: {storageInfo}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-pro hover:bg-pro/90 text-white"
                    data-testid="button-upgrade-profile"
                  >
                    <Link href="/subscribe">Assinar Mindly Pro</Link>
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
