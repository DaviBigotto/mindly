import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Brain, ArrowLeft, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAppData } from "@/context/app-data";
import { motion } from "framer-motion";

export default function Focus() {
  const { user, isPro } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { recordFocusSession } = useAppData();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const focusElapsedMinutes = Math.max(
    0,
    Math.floor((25 * 60 - timeLeft) / 60),
  );

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            // Save completed session
            recordFocusSession(25);
            toast({
              title: "Tempo esgotado!",
              description: "Parabéns! Você completou uma sessão de foco de 25 minutos",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, recordFocusSession, toast]);

  const toggleTimer = () => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const breathingTips = [
    "Respire fundo pelo nariz contando até 4",
    "Segure a respiração por 4 segundos",
    "Expire lentamente pela boca contando até 6",
    "Você está indo bem. Continue focado",
    "Faça uma pausa a cada 25 minutos",
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % breathingTips.length);
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 -right-16 h-[360px] w-[360px] rounded-full bg-secondary/20 blur-3xl" />
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
                  Modo foco consciente
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
            <div className="absolute -right-20 top-10 h-44 w-44 rounded-full bg-primary/10" />
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <Badge className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary">
                  Ritmo Mindly
                </Badge>
                <h1 className="text-4xl font-heading font-semibold text-foreground md:text-[2.6rem]">
                  Entre em foco com gentileza.
                </h1>
                <p className="text-base text-muted-foreground">
                  Use ciclos de atenção guiados e pausas
                  restauradoras para manter produtividade sem esgotamento.
                  Estamos aqui para lembrar você de respirar entre as entregas.
                </p>
              </div>
              <div className="w-full max-w-xs rounded-2xl border border-primary/15 bg-primary/10 p-5 text-primary shadow-inner shadow-primary/20">
                <p className="text-xs uppercase tracking-[0.3em]">
                  Minutos focados hoje
                </p>
                <p className="mt-3 text-3xl font-heading font-semibold">
                  {focusElapsedMinutes} min
                </p>
                <p className="mt-2 text-xs text-primary/80">
                  Mantenha ciclos curtos e gentis. Pausas conscientes evitam o
                  cansaço e preservam sua criatividade.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="overflow-hidden rounded-[32px] border border-white/50 bg-white/70 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <CardContent className="p-10 md:p-12">
              <div className="space-y-8">
                <div className="text-center space-y-7">
                  <div className="relative mx-auto inline-block">
                    <svg className="h-64 w-64 -rotate-90 text-primary/10">
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 120}`}
                        strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                        className="transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-6xl font-heading font-semibold text-foreground"
                        data-testid="text-timer"
                      >
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm uppercase tracking-[0.4em] text-primary/70">
                    Ciclo Pomodoro Mindly
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={toggleTimer}
                      className="min-w-[150px] rounded-full bg-primary shadow-lg shadow-primary/25"
                      data-testid="button-toggle-timer"
                    >
                      {isActive ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          {timeLeft === 25 * 60 ? "Iniciar" : "Continuar"}
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetTimer}
                      className="rounded-full border-primary/30 text-primary"
                      data-testid="button-reset-timer"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Resetar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <Card className="border border-white/50 bg-white/80 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium text-foreground transition-all duration-500">
                  {breathingTips[currentTip]}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Dica mindful
                    </p>
                    <p className="text-xs text-muted-foreground">
                      A cada ciclo concluído, levante-se, alongue os ombros e
                      solte o maxilar. Seu corpo agradece.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-primary"
                  onClick={() => {
                    if (!isPro) {
                      setShowPaywall(true);
                    }
                  }}
                >
                  Abrir biblioteca de alongamentos
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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
                  <span>Modo foco com timer Pomodoro</span>
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
              Tornar-se Pro - R$ 19,90/mês
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Invista em sua paz mental — menos café, mais calma
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
