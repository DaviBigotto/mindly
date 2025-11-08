import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Brain, ArrowLeft, Play, Pause, RotateCcw, Cloud, Music, Wind } from "lucide-react";
import { Link } from "wouter";

type AmbientSound = "none" | "rain" | "forest" | "wind";

export default function Focus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [selectedSound, setSelectedSound] = useState<AmbientSound>("none");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveMutation = useMutation({
    mutationFn: async (duration: number) => {
      await apiRequest("POST", "/api/focus/complete", { duration });
    },
    onSuccess: () => {
      toast({
        title: "Sessão concluída",
        description: "Parabéns! Sua sessão de foco foi registrada",
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
    },
  });

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            // Save completed session
            saveMutation.mutate(25);
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
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
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
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-heading font-bold">
              Entre em Foco
            </h1>
            <p className="text-lg text-muted-foreground">
              Use o timer Pomodoro para produtividade consciente
            </p>
          </div>

          {/* Timer Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-12">
              <div className="space-y-8">
                {/* Timer Display */}
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <svg className="w-64 h-64 -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 120}`}
                        strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                        className="text-primary transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-heading font-bold" data-testid="text-timer">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={toggleTimer}
                      className="min-w-[140px]"
                      data-testid="button-toggle-timer"
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          {timeLeft === 25 * 60 ? "Iniciar" : "Continuar"}
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetTimer}
                      data-testid="button-reset-timer"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Resetar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ambient Sounds */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-semibold mb-4">Sons Ambiente</h3>
              <div className="grid grid-cols-4 gap-3">
                <Button
                  variant={selectedSound === "none" ? "default" : "outline"}
                  onClick={() => setSelectedSound("none")}
                  className="flex flex-col h-auto py-4 gap-2"
                  data-testid="button-sound-none"
                >
                  <Music className="w-5 h-5" />
                  <span className="text-xs">Silêncio</span>
                </Button>
                <Button
                  variant={selectedSound === "rain" ? "default" : "outline"}
                  onClick={() => setSelectedSound("rain")}
                  className="flex flex-col h-auto py-4 gap-2"
                  data-testid="button-sound-rain"
                >
                  <Cloud className="w-5 h-5" />
                  <span className="text-xs">Chuva</span>
                </Button>
                <Button
                  variant={selectedSound === "forest" ? "default" : "outline"}
                  onClick={() => setSelectedSound("forest")}
                  className="flex flex-col h-auto py-4 gap-2"
                  data-testid="button-sound-forest"
                >
                  <Brain className="w-5 h-5" />
                  <span className="text-xs">Floresta</span>
                </Button>
                <Button
                  variant={selectedSound === "wind" ? "default" : "outline"}
                  onClick={() => setSelectedSound("wind")}
                  className="flex flex-col h-auto py-4 gap-2"
                  data-testid="button-sound-wind"
                >
                  <Wind className="w-5 h-5" />
                  <span className="text-xs">Vento</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Breathing Tips */}
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-foreground font-medium transition-all duration-500">
                {breathingTips[currentTip]}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
