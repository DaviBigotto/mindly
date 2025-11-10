import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Brain,
  BookOpen,
  Clock,
  HeartPulse,
  LucideIcon,
  MoonStar,
  Sparkles,
  Target,
  Waves,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const quickActions: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  accent: string;
  testId: string;
}> = [
  {
    title: "Meditar Agora",
    description: "Sessões cinematográficas para foco, relaxamento e sono.",
    icon: Brain,
    href: "/meditate",
    accent: "from-primary/15 via-primary/5 to-secondary/10",
    testId: "card-meditate",
  },
  {
    title: "Diário Emocional",
    description: "Acolhimento imediato com a IA e evolução das emoções.",
    icon: BookOpen,
    href: "/journal",
    accent: "from-secondary/20 via-background to-primary/10",
    testId: "card-journal",
  },
  {
    title: "Modo Foco",
    description: "Timers, sons ambientes e micro pausas guiadas.",
    icon: Target,
    href: "/focus",
    accent: "from-primary/10 via-primary/5 to-primary/20",
    testId: "card-focus",
  },
];

const wellbeingHighlights = [
  {
    title: "Respiração Fluxo Azul",
    value: "04:30",
    description: "Recomendada para manhãs com mente acelerada.",
  },
  {
    title: "Check-in emocional",
    value: "2/5 análises",
    description: "Ainda há energia para cuidar da sua mente hoje.",
  },
];

export default function Home() {
  const { user, isPro } = useAuth();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-72 -right-24 h-[400px] w-[400px] rounded-full bg-secondary/25 blur-3xl" />
        <div className="absolute bottom-0 left-12 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 shadow-lg shadow-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-primary/70">
                Mindly
              </p>
              <p className="font-heading text-lg font-semibold text-foreground">
                Bem-estar guiado com carinho
              </p>
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
                  <AvatarImage
                    src={user?.profileImageUrl || undefined}
                    alt="Perfil"
                  />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16 pt-10 md:pt-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <section className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 p-8 shadow-xl shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-primary/10" />
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.4em] text-primary/70">
                    Hoje
                  </p>
                  <h1 className="text-4xl font-heading font-semibold text-foreground md:text-[2.55rem]">
                    Olá, {user?.firstName || "Mindly lover"} ✨
                  </h1>
                  <p className="max-w-xl text-base text-muted-foreground">
                    Vamos cuidar da sua mente com serenidade? Sugestões do dia:
                    8 minutos de respiração, 1 registro de gratidão e um banho
                    de luz para encerrar a noite.
                  </p>
                </div>
                <div className="flex h-28 w-full max-w-[220px] flex-col justify-between rounded-2xl border border-primary/15 bg-primary/10 p-4 text-sm text-primary shadow-inner shadow-primary/10">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
                    <span>Energia</span>
                    <span>76%</span>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-primary/20">
                    <div className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-primary" />
                  </div>
                  <span>Reserve um momento para respirar com intenção.</span>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {wellbeingHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-primary/15 bg-primary/5 p-4"
                  >
                    <p className="font-heading text-lg text-primary">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-primary/70">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} href={action.href}>
                    <Card
                      className={`group relative h-full cursor-pointer overflow-hidden border border-white/40 bg-white/70 shadow-lg shadow-primary/10 backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:border-white/10 dark:bg-white/10`}
                      data-testid={action.testId}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${action.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                      />
                      <CardHeader className="relative space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner shadow-primary/20">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-heading font-semibold text-foreground">
                            {action.title}
                          </CardTitle>
                          <CardDescription className="mt-2 text-sm text-muted-foreground">
                            {action.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </motion.div>

            {!isPro && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <Card className="overflow-hidden border-pro/40 bg-gradient-to-br from-pro/10 via-background to-primary/10 shadow-xl shadow-pro/30">
                  <CardContent className="relative p-7">
                    <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-pro/30 blur-3xl" />
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-pro/20 px-3 py-1 text-xs font-semibold text-pro">
                          Mindly Pro
                        </span>
                        <h3 className="text-2xl font-heading font-semibold text-foreground">
                          Desbloqueie a sua melhor versão com Mindly Pro
                        </h3>
                        <p className="max-w-lg text-sm text-muted-foreground">
                          Acesso ilimitado à IA emocional, trilhas exclusivas e
                          sons premium para mergulhar em relaxamento profundo.
                        </p>
                      </div>
                      <Button
                        asChild
                        size="lg"
                        className="gap-2 bg-pro hover:bg-pro/90 text-white shadow-lg shadow-pro/30"
                        data-testid="button-upgrade-pro"
                      >
                        <Link href="/subscribe">Assinar por R$ 19,90/mês</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {isPro && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Link href="/pro-tracks">
                  <Card className="relative cursor-pointer overflow-hidden border-pro/40 bg-gradient-to-br from-pro/10 via-background to-primary/10 shadow-xl shadow-pro/40 transition duration-300 hover:-translate-y-2">
                    <CardContent className="relative flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between">
                      <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-pro/25 blur-xl" />
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pro/20 text-pro shadow-inner shadow-pro/30">
                          <Sparkles className="h-7 w-7" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-[0.3em] text-pro">
                            Pro exclusivo
                          </p>
                          <h3 className="text-2xl font-heading font-semibold text-foreground">
                            Trilhas de Transformação
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Desafios guiados para 7, 14 e 21 dias com áudio,
                            respirações e exercícios mindfulness.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        className="border border-white/60 bg-white/40 text-pro shadow"
                        data-testid="card-pro-tracks"
                      >
                        Explorar trilhas
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )}
          </section>

          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="rounded-[28px] border border-white/50 bg-white/70 p-6 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-primary/70">
                  Bem-estar contínuo
                </p>
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 text-xl font-heading font-semibold text-foreground">
                Agenda mindful da semana
              </h3>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <Waves className="mx-auto mt-2 h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      Respiração 4-6-8
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Segunda, quarta e sexta • 6 minutos • Reinicie sua energia
                      antes do trabalho começar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <MoonStar className="mx-auto mt-2 h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      Ritual Sono Sereno
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Todas as noites • 12 minutos • Prepare sua mente para uma
                      noite de descanso profundo e restaurador.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="rounded-[28px] border border-white/50 bg-white/75 p-6 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-primary/70">
                  Estado atual
                </p>
                <HeartPulse className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 text-xl font-heading font-semibold text-foreground">
                Seu painel emocional
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-primary">
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Humor atual
                  </p>
                  <p className="mt-2 text-lg font-heading font-semibold">
                    Sereno
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-primary">
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Sessões semana
                  </p>
                  <p className="mt-2 text-lg font-heading font-semibold">6</p>
                </div>
                <div className="rounded-2xl border border-secondary/20 bg-secondary/15 p-4 text-primary">
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Tempo meditado
                  </p>
                  <p className="mt-2 text-lg font-heading font-semibold">
                    42 min
                  </p>
                </div>
                <div className="rounded-2xl border border-secondary/20 bg-secondary/15 p-4 text-primary">
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Água ingerida
                  </p>
                  <p className="mt-2 text-lg font-heading font-semibold">
                    1.8 L
                  </p>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
