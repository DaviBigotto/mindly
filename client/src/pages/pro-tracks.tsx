import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, ArrowLeft, Sparkles, Target, Heart, Moon, Clock } from "lucide-react";
import { Link } from "wouter";
import type { ProTrack } from "@shared/schema";

export default function ProTracks() {
  const { user, isPro } = useAuth();

  const { data: tracks = [] } = useQuery<ProTrack[]>({
    queryKey: ["/api/pro-tracks"],
    enabled: isPro,
  });

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const getTrackIcon = (title: string) => {
    if (title.includes("Foco")) return <Target className="w-8 h-8 text-pro" />;
    if (title.includes("Paz")) return <Heart className="w-8 h-8 text-pro" />;
    if (title.includes("Sono")) return <Moon className="w-8 h-8 text-pro" />;
    return <Sparkles className="w-8 h-8 text-pro" />;
  };

  // If not Pro, redirect or show upgrade message
  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-pro" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-semibold">
                Área Exclusiva Pro
              </h2>
              <p className="text-muted-foreground">
                As Trilhas de Transformação são exclusivas para assinantes Mindly Pro
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-pro hover:bg-pro/90 text-white mt-4"
              data-testid="button-upgrade-tracks"
            >
              <Link href="/subscribe">
                Assinar Pro - R$ 29,90/mês
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-pro" />
              <h1 className="text-4xl font-heading font-bold">
                Bem-vindo à sua Jornada Mindly Pro
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Aqui você encontra trilhas exclusivas para desenvolver autoconhecimento, foco e serenidade.
              Cada jornada é um passo em direção à sua melhor versão.
            </p>
          </div>

          {/* Tracks Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <Link key={track.id} href={`/track/${track.id}`}>
                <Card className="hover-elevate cursor-pointer transition-all duration-300 h-full border-pro/30 bg-gradient-to-br from-pro/5 to-transparent" data-testid={`card-track-${track.id}`}>
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center">
                      {getTrackIcon(track.title)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl font-heading">{track.title}</CardTitle>
                        <Badge variant="secondary" className="bg-pro/20 text-pro border-0 text-xs">
                          PRO
                        </Badge>
                      </div>
                      <CardDescription>{track.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{track.duration} dias</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State - Mock data for now */}
          {tracks.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-elevate cursor-pointer transition-all duration-300 h-full border-pro/30 bg-gradient-to-br from-pro/5 to-transparent">
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center">
                    <Target className="w-8 h-8 text-pro" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl font-heading">21 Dias de Foco e Clareza Mental</CardTitle>
                      <Badge variant="secondary" className="bg-pro/20 text-pro border-0 text-xs">
                        PRO
                      </Badge>
                    </div>
                    <CardDescription>
                      Melhore a produtividade consciente com técnicas de foco, visualização e reprogramação mental
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>21 dias</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer transition-all duration-300 h-full border-pro/30 bg-gradient-to-br from-pro/5 to-transparent">
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-pro" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl font-heading">7 Dias de Paz Interior</CardTitle>
                      <Badge variant="secondary" className="bg-pro/20 text-pro border-0 text-xs">
                        PRO
                      </Badge>
                    </div>
                    <CardDescription>
                      Combata o estresse e fortaleça o equilíbrio emocional com gratidão, respiração e autoaceitação
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>7 dias</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer transition-all duration-300 h-full border-pro/30 bg-gradient-to-br from-pro/5 to-transparent">
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-pro/20 flex items-center justify-center">
                    <Moon className="w-8 h-8 text-pro" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl font-heading">Desafio Sono Perfeito</CardTitle>
                      <Badge variant="secondary" className="bg-pro/20 text-pro border-0 text-xs">
                        PRO
                      </Badge>
                    </div>
                    <CardDescription>
                      Guia para melhorar a qualidade do sono e o relaxamento profundo com rituais noturnos
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>7 dias</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
