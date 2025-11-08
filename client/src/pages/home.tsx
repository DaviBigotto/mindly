import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, BookOpen, Target, Sparkles, User } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isPro } = useAuth();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-semibold">Mindly</span>
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
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-heading font-bold">
              Bem-vindo de volta, {user?.firstName || ""}
            </h1>
            <p className="text-lg text-muted-foreground">
              Como está sua mente hoje?
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/meditate">
              <Card className="hover-elevate cursor-pointer transition-all duration-300 h-full" data-testid="card-meditate">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-heading">Meditar Agora</CardTitle>
                    <CardDescription className="mt-2">
                      Sessões guiadas para foco, relaxamento e paz interior
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/journal">
              <Card className="hover-elevate cursor-pointer transition-all duration-300 h-full" data-testid="card-journal">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-heading">Diário Emocional</CardTitle>
                    <CardDescription className="mt-2">
                      Registre seus sentimentos e receba insights da IA
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/focus">
              <Card className="hover-elevate cursor-pointer transition-all duration-300 h-full" data-testid="card-focus">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-heading">Modo Foco</CardTitle>
                    <CardDescription className="mt-2">
                      Timer Pomodoro e técnicas para produtividade consciente
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Pro Bonus Card - Only for Pro users */}
          {isPro && (
            <Link href="/pro-tracks">
              <Card className="hover-elevate cursor-pointer transition-all duration-300 border-pro/30 bg-gradient-to-br from-pro/5 to-transparent" data-testid="card-pro-tracks">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-pro/20 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-pro" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-heading">Área Bônus Pro</CardTitle>
                        <span className="text-xs px-2 py-1 rounded-full bg-pro/20 text-pro font-semibold">PRO</span>
                      </div>
                      <CardDescription className="mt-2">
                        Trilhas de Transformação - Desafios e experiências guiadas para evoluir mente, foco e equilíbrio
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )}

          {/* Free tier upgrade CTA */}
          {!isPro && (
            <Card className="border-pro/30 bg-gradient-to-br from-pro/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-pro" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-xl font-heading font-semibold">
                      Desbloqueie o Mindly Pro
                    </h3>
                    <p className="text-muted-foreground">
                      Meditações exclusivas, IA emocional ilimitada, trilhas de transformação e muito mais
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="bg-pro hover:bg-pro/90 text-white flex-shrink-0"
                    data-testid="button-upgrade-pro"
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
