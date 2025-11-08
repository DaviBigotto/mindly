import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, ArrowLeft, Lock, Play, Clock, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { MeditationCategory, MeditationSession } from "@shared/schema";

export default function Meditate() {
  const { user, isPro } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);

  const { data: categories = [] } = useQuery<MeditationCategory[]>({
    queryKey: ["/api/meditation/categories"],
  });

  const { data: sessions = [] } = useQuery<MeditationSession[]>({
    queryKey: ["/api/meditation/sessions", selectedCategory],
    enabled: !!selectedCategory,
  });

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const handleCategoryClick = (category: MeditationCategory) => {
    if (category.isPro && !isPro) {
      setShowPaywall(true);
      return;
    }
    setSelectedCategory(category.id);
  };

  const handleSessionClick = (session: MeditationSession) => {
    setSelectedSession(session);
    setShowSessionModal(true);
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
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-heading font-bold">
              Medite com o Mindly
            </h1>
            <p className="text-lg text-muted-foreground">
              Escolha uma categoria e encontre a paz interior
            </p>
          </div>

          {/* Categories */}
          {!selectedCategory ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const isLocked = category.isPro && !isPro;
                return (
                  <Card
                    key={category.id}
                    className={`hover-elevate cursor-pointer transition-all duration-300 ${
                      isLocked ? "opacity-80" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                    data-testid={`card-category-${category.name.toLowerCase()}`}
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-primary" />
                        </div>
                        {isLocked && (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                        {category.isPro && isPro && (
                          <Badge variant="secondary" className="bg-pro/20 text-pro border-0">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-heading">{category.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {category.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Sessions List */
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="gap-2"
                data-testid="button-back-categories"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar às Categorias
              </Button>

              <div className="grid gap-4">
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="hover-elevate cursor-pointer transition-all duration-300"
                    onClick={() => handleSessionClick(session)}
                    data-testid={`card-session-${session.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Play className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-lg font-heading font-semibold">{session.title}</h3>
                            <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
                              <Clock className="w-3 h-3" />
                              {session.duration} min
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Paywall Modal */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="max-w-md" data-testid="modal-paywall">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-pro" />
            </div>
            <DialogTitle className="text-2xl font-heading text-center">
              Desbloqueie o Mindly Pro
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p className="text-base">
                Acesse meditações exclusivas, IA emocional ilimitada e relatórios de bem-estar
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 justify-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-pro" />
                  <span>Todas as categorias de meditação</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-pro" />
                  <span>IA emocional ilimitada</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-pro" />
                  <span>Trilhas de transformação</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Button
              className="w-full bg-pro hover:bg-pro/90 text-white"
              size="lg"
              onClick={() => setLocation("/subscribe")}
              data-testid="button-subscribe-pro"
            >
              Tornar-se Pro - R$ 29,90/mês
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Invista em sua paz mental — menos café, mais calma
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Modal */}
      <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
        <DialogContent className="max-w-2xl" data-testid="modal-session">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-heading text-center">
              {selectedSession?.title}
            </DialogTitle>
            <DialogDescription className="text-center">
              <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                <Clock className="w-3 h-3" />
                {selectedSession?.duration} minutos
              </Badge>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-center text-muted-foreground">
              {selectedSession?.description}
            </p>
            <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Play className="w-10 h-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Player de áudio será implementado aqui
              </p>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => setShowSessionModal(false)}
              data-testid="button-complete-session"
            >
              Concluir Sessão
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
