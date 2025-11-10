import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, ArrowLeft, Play, Pause, Clock, Sparkles, Waves, Volume2, VolumeX, Maximize2, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { MeditationCategory, MeditationSession } from "@shared/schema";
import { useAppData } from "@/context/app-data";
import { motion } from "framer-motion";

export default function Meditate() {
  const { user, isPro } = useAuth();
  const { meditationCategories, getMeditationSessions } = useAppData();
  const [, setLocation] = useLocation();
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MeditationCategory | null>(null);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categories = meditationCategories;

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const handleCategoryClick = (category: MeditationCategory) => {
    console.log("Category clicked:", category.name, "isPro:", isPro, "user.isPro:", user?.isPro);
    if (!isPro) {
      console.log("User is not Pro, showing paywall");
      setShowPaywall(true);
      return;
    }
    // Se for Pro, mostra as sessões da categoria
    console.log("✅ Acesso Pro autorizado: abrindo categoria", category.name);
    setSelectedCategory(category);
    setShowSessionsModal(true);
  };

  const sessions = selectedCategory ? getMeditationSessions(selectedCategory.id) : [];

  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes) return "0 min";
    return `${minutes} min`;
  };

  const formatDurationLong = (minutes: number | null | undefined) => {
    if (!minutes) return "0 minutos";
    return `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  };

  const handleSessionClick = (session: MeditationSession) => {
    console.log("Starting session:", session.title, "Duration:", session.duration);
    if (session.audioUrl) {
      // Abre o player de vídeo integrado
      setSelectedSession(session);
      setShowSessionsModal(false);
      setShowPlayer(true);
      setIsPlaying(false);
      setCurrentTime(0);
    } else {
      // Sessão sem áudio - pode ser uma sessão guiada apenas por texto
      alert(`Iniciando sessão: ${session.title}\nDuração: ${formatDurationLong(session.duration ?? 0)}\n\n${session.description}`);
    }
  };

  // Controles do player de vídeo
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Event listeners do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [selectedSession]);

  // Reset quando fecha o player
  useEffect(() => {
    if (!showPlayer && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [showPlayer]);

  // Limpar timeout quando componente desmontar
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-48 -left-16 h-[360px] w-[360px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-16 right-0 h-[320px] w-[320px] translate-x-1/3 rounded-full bg-primary/10 blur-3xl" />
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
                  Espaço de serenidade
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
        <div className="mx-auto max-w-5xl space-y-10 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 p-8 shadow-xl shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="absolute -right-20 top-6 h-40 w-40 rounded-full bg-primary/10" />
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <Badge className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary">
                  <Waves className="h-4 w-4" />
                  Respiração guiada
                </Badge>
                <h1 className="text-4xl font-heading font-semibold text-foreground md:text-[2.65rem]">
                  Medite com suavidade, encontre sua frequência.
                </h1>
                <p className="max-w-xl text-base text-muted-foreground">
                  Escolha uma categoria, respire com consciência e acompanhe o
                  fluxo de energia em seu corpo. Cada sessão foi desenhada para
                  abraçar a sua rotina com calma e presença.
                </p>
              </div>
              <div className="w-full max-w-sm rounded-2xl border border-primary/15 bg-primary/10 p-5 text-primary shadow-inner shadow-primary/20">
                <p className="text-xs uppercase tracking-[0.25em]">
                  Próxima sugestão
                </p>
                <p className="mt-2 text-lg font-heading font-semibold">
                  Luz dourada matinal
                </p>
                <p className="mt-3 text-sm text-primary/80">
                  Inspire generosidade, expire tensão. Ideal para iniciar o dia
                  com clareza e leveza.
                </p>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/20 bg-white/50 px-4 py-3 text-sm text-primary shadow">
                  <span>Duração</span>
                  <span className="font-heading text-lg">06:15</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group relative h-full cursor-pointer overflow-hidden border border-pro/40 bg-white/70 shadow-lg shadow-primary/10 backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:border-pro/30 dark:bg-white/10"
                onClick={() => handleCategoryClick(category)}
                data-testid={`card-category-${category.name.toLowerCase()}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-3 rounded-[22px] border border-pro/50 shadow-[0_14px_32px_rgba(37,99,235,0.22)]" />
                <CardHeader className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner shadow-primary/20">
                      <Brain className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-heading font-semibold text-foreground">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
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

      {/* Sessions Modal */}
      <Dialog open={showSessionsModal} onOpenChange={setShowSessionsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="modal-sessions">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              {selectedCategory?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedCategory?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma sessão disponível nesta categoria.</p>
              </div>
            ) : (
              sessions.map((session) => (
                <Card
                  key={session.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => handleSessionClick(session)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-semibold text-lg">
                            {session.title}
                          </h3>
                          {session.isPro && (
                            <Badge className="bg-pro/15 text-pro text-xs">PRO</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{formatDuration(session.duration ?? 0)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        className="rounded-full bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSessionClick(session);
                        }}
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal */}
      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-4xl w-full p-0 gap-0" data-testid="modal-player">
          {selectedSession && (
            <div className="relative bg-black rounded-lg overflow-hidden">
              {/* Vídeo */}
              <div 
                className="relative w-full aspect-video bg-black group"
                onMouseMove={() => {
                  setShowControls(true);
                  if (controlsTimeoutRef.current) {
                    clearTimeout(controlsTimeoutRef.current);
                  }
                  controlsTimeoutRef.current = setTimeout(() => {
                    if (isPlaying) {
                      setShowControls(false);
                    }
                  }, 3000);
                }}
                onMouseLeave={() => {
                  if (isPlaying) {
                    setShowControls(false);
                  }
                }}
              >
                <video
                  ref={videoRef}
                  src={selectedSession.audioUrl || undefined}
                  className="w-full h-full object-contain"
                  playsInline
                  onClick={togglePlayPause}
                />
                
                {/* Overlay de controles central */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Button
                    size="icon"
                    className="rounded-full w-20 h-20 bg-black/40 hover:bg-black/50 backdrop-blur-md border-2 border-white/40 shadow-xl pointer-events-auto transition-all hover:scale-110"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-10 w-10 text-white" />
                    ) : (
                      <Play className="h-10 w-10 text-white ml-1" />
                    )}
                  </Button>
                </div>

                {/* Barra de progresso sobre o vídeo (estilo YouTube) */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                  }`}
                  onMouseEnter={() => {
                    setShowControls(true);
                    if (controlsTimeoutRef.current) {
                      clearTimeout(controlsTimeoutRef.current);
                    }
                  }}
                  onMouseMove={() => {
                    setShowControls(true);
                    if (controlsTimeoutRef.current) {
                      clearTimeout(controlsTimeoutRef.current);
                    }
                  }}
                >
                  {/* Gradiente de fundo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                  
                  {/* Conteúdo dos controles */}
                  <div className="relative px-4 pb-3.5 pt-5">
                    {/* Barra de progresso com tempos - estilo YouTube */}
                    <div className="relative w-full group/progress mb-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      {/* Barra de fundo - branca semitransparente */}
                      <div className="absolute inset-y-0 left-0 right-0 h-1 bg-white/50 rounded-full" />
                      {/* Barra de progresso preenchida - vermelha estilo YouTube */}
                      <div 
                        className="absolute inset-y-0 left-0 h-1 bg-red-600 rounded-full transition-all duration-100"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      />
                      {/* Indicador circular branco - aparece no hover */}
                      {duration > 0 && (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
                          style={{ 
                            left: `calc(${(currentTime / duration) * 100}% - 6px)`,
                          }}
                        />
                      )}
                      {/* Input range para controle - área clicável maior */}
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="relative w-full h-2 bg-transparent appearance-none cursor-pointer video-progress-slider z-10 -my-0.5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {/* Tempos - estilo YouTube (sempre visíveis quando controles estão visíveis) */}
                    {duration > 0 && (
                      <div className="flex items-center justify-between text-xs text-white font-medium drop-shadow-lg">
                        <span className="tabular-nums">{formatTime(currentTime)}</span>
                        <span className="tabular-nums opacity-85">/ {formatTime(duration)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controles do player */}
              <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 p-4">
                {/* Informações da sessão */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-heading font-semibold text-lg truncate text-foreground">
                        {selectedSession.title}
                      </h3>
                      {selectedSession.isPro && (
                        <Badge className="bg-pro/20 text-pro border-pro/30 text-xs shrink-0 font-medium px-2 py-0.5">
                          PRO
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {selectedSession.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPlayer(false)}
                    className="shrink-0 hover:bg-muted/50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Controles inferiores */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors h-9 w-9"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors h-9 w-9"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>

                  <div className="relative flex items-center gap-2 group/volume">
                    <div className="relative w-20">
                      {/* Barra de fundo do volume */}
                      <div className="absolute inset-y-0 left-0 right-0 h-1 bg-slate-700/40 dark:bg-slate-600/30 rounded-full" />
                      {/* Barra de volume preenchida */}
                      <div 
                        className="absolute inset-y-0 left-0 h-1 bg-primary rounded-full transition-all duration-150"
                        style={{ width: `${volume * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="relative w-full h-1 bg-transparent appearance-none cursor-pointer volume-slider z-10"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[2.5rem] tabular-nums font-medium">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>

                  <div className="flex-1" />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFullscreen}
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors h-9 w-9"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
