import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  Heart,
  Sparkles,
  Target,
  Waves,
  Wind,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const stats = [
  { label: "Sessões guiadas mensais", value: "4.8k+" },
  { label: "Usuários em equilíbrio", value: "120k+" },
  { label: "Avaliação média", value: "4.9/5" },
];

const features = [
  {
    icon: <Brain className="w-6 h-6 text-primary" />,
    title: "Meditações Immersivas",
    description:
      "Experiências sonoras binaurais, respiração guiada e visualizações que desaceleram a mente em minutos.",
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: "Diário Emocional com IA",
    description:
      "Registre sentimentos e receba respostas empáticas automáticas, com acompanhamento do seu humor ao longo da semana.",
  },
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: "Foco Consciente",
    description:
      "Timers inteligentes, sons ambientes e micro-pausas respiratórias para manter produtividade sem perder a leveza.",
  },
];

const journeys = [
  {
    title: "Respire",
    description:
      "Inicie seu dia com um ritual de respiração que acalma o sistema nervoso e ajusta o foco.",
  },
  {
    title: "Sinta",
    description:
      "Use o diário emocional para dar nome às emoções e receber acolhimento imediato da IA.",
  },
  {
    title: "Transforme",
    description:
      "Mantenha a evolução com trilhas Mindly Pro e hábitos positivos sustentados semana a semana.",
  },
];

const testimonials = [
  {
    name: "Marina Couto",
    role: "Empreendedora",
    quote:
      "O Mindly virou meu ritual matinal. O visual é suave, os sons são incríveis e eu realmente consigo sentir a mente desacelerar.",
  },
  {
    name: "Carlos Ribeiro",
    role: "Designer",
    quote:
      "As trilhas Pro me ajudaram a criar novas rotinas sem culpa. O app parece um abraço digital.",
  },
  {
    name: "Fernanda Lima",
    role: "Estudante de Medicina",
    quote:
      "O modo foco com sons ambientes e as respirações guiadas salvaram meu ciclo de estudos. Experiência impecável.",
  },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 -left-32 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-20 -right-16 h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/40 to-primary/5" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 shadow-lg shadow-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">
                Mindly
              </p>
              <p className="font-heading text-lg font-semibold text-foreground">
                Calma que move você
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <a href="#experiencia">Experiência</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#beneficios">Benefícios</a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Criar conta</Link>
            </Button>
            <Button asChild data-testid="button-login">
              <Link href="/signup?mode=login">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 pb-24 pt-16 md:pb-32 lg:flex lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left"
          >
            <Badge
              variant="secondary"
              className="mb-6 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary"
            >
              <Waves className="h-4 w-4" />
              Bem-estar guiado por IA
            </Badge>
            <h1 className="text-4xl font-heading font-semibold leading-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Respire com tranquilidade, mantenha o foco e transforme a sua
              rotina em equilíbrio.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Mindly combina meditações cinematográficas, diário emocional
              inteligente, trilhas de transformação e um modo foco que respeita
              seus limites. Tudo em um ambiente visual suave, preparado para
              te acolher nos momentos mais intensos do dia.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="w-full gap-2 bg-primary shadow-lg shadow-primary/30 sm:w-auto"
                data-testid="button-get-started"
                asChild
              >
                <Link href="/subscribe">
                  Começar jornada Pro
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full border border-border/70 bg-background/60 backdrop-blur sm:w-auto"
                asChild
              >
                <a href="#demo">Explorar experiência</a>
              </Button>
            </div>
            <div className="mt-10 grid gap-6 rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-primary/10 backdrop-blur dark:border-white/10 dark:bg-white/5 md:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="text-center md:text-left">
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            id="demo"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="relative mt-16 flex w-full justify-center lg:mt-0 lg:w-[460px]"
          >
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 blur-2xl" />
            <Card className="relative w-full max-w-[420px] overflow-hidden border-white/40 bg-white/70 shadow-2xl shadow-primary/20 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              <CardContent className="relative p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                      Sessão guiada
                    </p>
                    <p className="text-lg font-heading font-medium text-foreground">
                      Banho de Luz Matinal
                    </p>
                  </div>
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Sente-se confortavelmente, relaxe os ombros e permita que este
                  banho de luz percorra seu corpo. Respire em quatro tempos,
                  solte em seis. A cada expiração, o corpo entende: é hora de
                  desacelerar.
                </p>
                <div className="mt-8 grid gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Waves className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Respiração Fluxo Azul
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Inale calma, exale clareza – 8 minutos de serenidade.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/30 bg-white/80 px-4 py-3 text-sm text-muted-foreground shadow-inner shadow-primary/10">
                    <span>Duração total</span>
                    <span className="font-heading text-lg text-foreground">
                      08:32
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-lg border border-primary/10 bg-primary/10 px-4 py-3 text-sm text-primary">
                  <span>Respiração guiada em andamento</span>
                  <Wind className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section
          id="beneficios"
          className="container mx-auto px-4 pb-16 pt-4 md:pb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid gap-6 md:grid-cols-3"
          >
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-white/40 bg-white/60 shadow-lg shadow-primary/10 backdrop-blur-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:border-white/10 dark:bg-white/5"
              >
                <CardContent className="relative space-y-4 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner shadow-primary/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="absolute -right-6 top-6 h-24 w-24 rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>

        <section
          id="experiencia"
          className="container mx-auto px-4 pb-16 md:pb-24"
        >
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <Badge className="rounded-full bg-primary/15 text-primary">
                Um fluxo pensado para você
              </Badge>
              <h2 className="text-3xl font-heading font-semibold leading-tight text-foreground md:text-4xl">
                Um caminho suave: do primeiro respiro ao sono profundo.
              </h2>
              <p className="text-lg text-muted-foreground">
                O Mindly foi desenhado para silenciar ruídos, com uma estética
                minimalista, transições suaves e micro animações fluídas.
                Construímos uma interface que parece respirar com você.
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                {journeys.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-primary/15 bg-primary/5 p-5"
                  >
                    <p className="font-heading text-xl text-primary">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[32px] bg-secondary/20 blur-2xl" />
              <Card className="relative overflow-hidden border-white/40 bg-white/70 shadow-xl shadow-secondary/20 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                <CardContent className="space-y-8 p-10">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-primary/70">
                      Interface Mindly
                    </p>
                    <h3 className="text-2xl font-heading font-semibold text-foreground">
                      Visual calm e animações orgânicas
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Cards com efeito glassmorphism, gradientes respiratórios,
                      botões suaves e navegação intuitiva. A cada toque, uma
                      micro animação acolhe o usuário – sem exageros, apenas a
                      dose certa de movimento.
                    </p>
                  </div>
                  <div className="grid gap-4 text-sm">
                    <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/10 px-4 py-3 text-primary">
                      <span>Sons 3D e binaurais</span>
                      <span className="font-heading text-base">14 playlists</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-primary">
                      <span>Animações mindful</span>
                      <span className="font-heading text-base">
                        32 interações guiadas
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-secondary/20 bg-secondary/15 px-4 py-3 text-primary">
                      <span>Métricas emocionais</span>
                      <span className="font-heading text-base">Painel visual</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-[32px] border border-white/30 bg-gradient-to-br from-primary/15 via-background to-secondary/20 p-10 shadow-2xl shadow-primary/20 backdrop-blur-xl"
          >
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <Badge className="rounded-full border border-white/40 bg-white/20 text-white shadow-sm shadow-white/40 backdrop-blur">
                  Mindly Pro
                </Badge>
                <h2 className="mt-4 text-3xl font-heading font-semibold text-white md:text-4xl">
                  Eleve sua jornada com trilhas exclusivas e suporte personalizado
                </h2>
                <p className="mt-4 text-base text-white/80">
                  Receba planos construídos por terapeutas, respirações rápidas
                  durante o dia e acompanhamento emocional ilimitado. Ideal para
                  quem precisa manter produtividade e serenidade em ritmo intenso.
                </p>
                <div className="mt-6 flex flex-col gap-3 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-white" />
                    IA emocional sem limites
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-white" />
                    Trilhas transformadoras de 7, 14 e 21 dias
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-white" />
                    Sons premium e exercícios de foco expandidos
                  </div>
                </div>
              </div>
              <Card className="border-white/30 bg-white/80 p-6 shadow-xl shadow-primary/20 backdrop-blur-lg dark:border-white/10 dark:bg-white/10">
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Investimento mensal
                    </p>
                    <Badge className="bg-white text-primary shadow">
                      Mais popular
                    </Badge>
                  </div>
                  <p className="text-2xl font-heading font-semibold text-foreground pt-4">
                    R$ 19,90/mês
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cancele a qualquer momento. Seu bem-estar vale mais que um
                    café por dia.
                  </p>
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                    data-testid="button-try-pro"
                    asChild
                  >
                    <Link href="/subscribe">Experimentar Mindly Pro</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-center text-3xl font-heading font-semibold text-foreground md:text-4xl">
              Histórias verdadeira mente tranquilas
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground">
              Profissionais criativos, empreendedores e estudantes escolhem o
              Mindly para desacelerar sem perder desempenho. Veja como eles
              descrevem a experiência.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <Card
                  key={item.name}
                  className="border border-white/50 bg-white/70 p-6 shadow-lg shadow-primary/10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:border-white/10 dark:bg-white/10"
                >
                  <CardContent className="space-y-4 p-0">
                    <p className="text-base leading-relaxed text-muted-foreground">
                      “{item.quote}”
                    </p>
                    <div>
                      <p className="font-heading text-lg font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/80 py-10 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2025 Mindly. Respire, foque, transforme.</p>
          <div className="flex items-center gap-4">
            <a
              href="#beneficios"
              className="transition-colors hover:text-primary"
            >
              Funcionalidades
            </a>
            <a
              href="#experiencia"
              className="transition-colors hover:text-primary"
            >
              Experiência
            </a>
            <Link
              href="/subscribe"
              className="transition-colors hover:text-primary"
            >
              Mindly Pro
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
