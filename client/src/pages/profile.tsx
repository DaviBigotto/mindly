import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, ArrowLeft, Sparkles, Heart, Target, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Profile() {
  const { user, isPro } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/profile/stats"],
  });

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

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
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt="Perfil" />
                  <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                    <h1 className="text-2xl font-heading font-bold">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    {isPro && (
                      <Badge className="bg-pro/20 text-pro border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <Button
                  variant="outline"
                  asChild
                  data-testid="button-logout"
                >
                  <a href="/api/logout">Sair</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Registros de Humor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-heading font-bold" data-testid="text-journal-count">
                  {stats?.journalCount ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Minutos Meditados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-heading font-bold" data-testid="text-meditation-minutes">
                  {stats?.meditationMinutes ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Sessões de Foco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-heading font-bold" data-testid="text-focus-count">
                  {stats?.focusCount ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mood Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Humor da Semana</CardTitle>
              <CardDescription>
                Acompanhe suas emoções ao longo dos últimos 7 dias
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

          {/* Subscription Management */}
          {isPro ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Assinatura e Faturamento
                </CardTitle>
                <CardDescription>
                  Gerencie sua assinatura Mindly Pro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    Plano Mindly Pro Ativo
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Valor</span>
                  <span className="font-semibold">R$ 29,90/mês</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Método de Pagamento</span>
                  <span className="text-sm">Gerenciado pela Stripe</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid="button-manage-subscription"
                >
                  Gerenciar Assinatura e Faturas
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Você pode cancelar ou atualizar sua forma de pagamento a qualquer momento
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
                      Desbloqueie todo o potencial do Mindly
                    </h3>
                    <p className="text-muted-foreground">
                      Acesso ilimitado a meditações, IA emocional, trilhas de transformação e sons premium
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="bg-pro hover:bg-pro/90 text-white mt-4"
                    data-testid="button-upgrade-profile"
                  >
                    <Link href="/subscribe">
                      Assinar Pro - R$ 29,90/mês
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
