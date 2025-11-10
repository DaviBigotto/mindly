import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, Sparkles, Target, Heart, Moon, Clock } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { ProTrack } from "../../../../schema";
import { useAppData } from "@/context/app-data";

export default function ProTracks() {
  const { user, isPro } = useAuth();
  const { proTracks } = useAppData();
  const tracks: ProTrack[] = isPro ? proTracks : [];

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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-48 -right-16 h-[360px] w-[360px] rounded-full bg-pro/20 blur-3xl" />
        </div>
        <Card className="max-w-md border border-white/50 bg-white/75 shadow-xl shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <CardContent className="space-y-4 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pro/20 text-pro">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Área exclusiva Pro
              </h2>
              <p className="text-sm text-muted-foreground">
                As Trilhas de Transformação são conteúdos premium preparados
                para quem busca evolução guiada passo a passo.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-pro hover:bg-pro/90 text-white mt-4"
              data-testid="button-upgrade-tracks"
            >
              <Link href="/subscribe">
                Assinar Pro - R$ 19,90/mês
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -right-16 h-[360px] w-[360px] rounded-full bg-pro/20 blur-3xl" />
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
                <ArrowLeft className="w-5 h-5" />
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
                  Trilhas de transformação
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
        <div className="mx-auto max-w-5xl space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-pro" />
              <h1 className="text-4xl font-heading font-semibold text-foreground">
                Bem-vindo à sua jornada Mindly Pro
              </h1>
            </div>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Trilhas exclusivas para cultivar novos hábitos com leveza.
              Escolha um caminho e deixe a Mindly guiar seus próximos passos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="grid gap-6 md:grid-cols-3"
          >
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
          </motion.div>

          {/* Empty State - Mock data for now */}
          {tracks.length === 0 && (
            <div className="grid gap-6 md:grid-cols-3">
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
