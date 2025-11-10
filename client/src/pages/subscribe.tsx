import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Timer,
  Sparkle,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const KIWIFY_URL = import.meta.env.VITE_KIWIFY_CHECKOUT_URL ?? "https://pay.kiwify.com.br/TXmPcok";
const OFFER_DURATION_MINUTES = Number(import.meta.env.VITE_KIWIFY_OFFER_MINUTES ?? 30);
const OFFER_DEADLINE_STORAGE_KEY = "mindly.kiwify.offer.deadline";

export default function Subscribe() {
  const { user } = useAuth();
  const [deadline] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now();
    const stored = window.localStorage.getItem(OFFER_DEADLINE_STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed) && parsed > Date.now()) return parsed;
    }
    const next = Date.now() + OFFER_DURATION_MINUTES * 60 * 1000;
    window.localStorage.setItem(OFFER_DEADLINE_STORAGE_KEY, String(next));
    return next;
  });
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    Math.max(0, deadline - Date.now()),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [deadline]);

  const isExpired = timeLeft <= 0;

  useEffect(() => {
    if (isExpired && typeof window !== "undefined") {
      window.localStorage.removeItem(OFFER_DEADLINE_STORAGE_KEY);
    }
  }, [isExpired]);

  const formattedCountdown = useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000));
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, [timeLeft]);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const kiwifyLink = useMemo(() => KIWIFY_URL, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -right-16 h-[360px] w-[360px] rounded-full bg-pro/25 blur-3xl" />
      </div>

      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
              data-testid="button-back"
            >
              <Link href="/home">
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

      <main className="container mx-auto px-4 pb-16 pt-12">
        <div className="mx-auto max-w-3xl space-y-10 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center space-y-4"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pro/20 text-pro">
              <Sparkles className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-heading font-semibold text-foreground md:text-[2.7rem]">
              Assinatura Mindly Pro
            </h1>
            <p className="text-lg text-muted-foreground">
              Invista em serenidade diária com trilhas exclusivas, IA emocional
              ilimitada e experiências sonoras imersivas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          >
            <Card className="relative overflow-hidden border-pro/30">
              <div className="absolute inset-0 bg-gradient-to-br from-pro/10 via-transparent to-transparent" />
              <div className="absolute right-4 top-4 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-200 shadow shadow-yellow-500/20">
                Oferta relâmpago
              </div>
              <CardHeader className="relative">
                <CardTitle className="font-heading">O que está incluído</CardTitle>
                <CardDescription>
                  Acesso completo a todas as funcionalidades premium
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-3">
                {[
                  {
                    title: "Meditações Ilimitadas",
                    description:
                      "Todas as categorias: foco, relaxamento, sono, ansiedade e autoconfiança.",
                  },
                  {
                    title: "IA emocional sem limites",
                    description:
                      "Receba análises empáticas sempre que precisar desabafar.",
                  },
                  {
                    title: "Trilhas transformadoras",
                    description:
                      "21 Dias de Foco, 7 Dias de Paz Interior e Desafio Sono Perfeito.",
                  },
                  {
                    title: "Sons premium 3D",
                    description:
                      "Biblioteca exclusiva para mergulhar em estados profundos de calma.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <CheckCircle2 className="mt-0.5 flex-shrink-0 text-pro" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="font-heading">Resumo do investimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 rounded-2xl border border-primary/15 bg-primary/10 p-4 text-primary shadow-inner shadow-primary/20 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="space-y-2">
                    <span className="text-sm uppercase tracking-[0.25em] text-primary/60">
                      Licença Mindly Pro completa
                    </span>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-xl font-heading font-semibold text-primary/70 line-through">
                        R$ 197,00
                      </span>
                      <span className="text-3xl font-heading font-semibold text-pro">
                        R$ 19,90
                      </span>
                      <Badge className="bg-pro/20 text-pro border-0">
                        90% OFF
                      </Badge>
                    </div>
                    <p className="text-xs text-primary/80">
                      Oferta exclusiva para quem está conhecendo o Mindly agora. Aproveite antes que o cronômetro zere.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="inline-flex items-center gap-2 rounded-full bg-pro/15 px-4 py-2 text-xs font-semibold uppercase text-pro shadow-inner shadow-pro/30">
                      <Sparkle className="h-4 w-4" />
                      Oferta especial
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary/80">
                      <Timer className="h-4 w-4" />
                      <span>{isExpired ? "00:00:00" : formattedCountdown} restantes</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compra única realizada pela Kiwify. Você recebe acesso imediato ao Mindly Pro para uso ilimitado.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <Card className="border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-foreground">
                  <ShieldCheck className="h-5 w-5" />
                  Pagamento seguro via Kiwify
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Finalize a compra na plataforma Kiwify e receba por e-mail o passo a passo para ativar seu acesso Pro.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-pro hover:bg-pro/90 text-white shadow-lg shadow-pro/30"
                  data-testid="button-go-kiwify"
                  disabled={isExpired}
                >
                  <a
                    href={isExpired ? undefined : kiwifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {isExpired ? "Oferta encerrada" : "Garantir acesso por R$ 19,90"}
                    {!isExpired && <ExternalLink className="ml-2 h-4 w-4" />}
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Após a confirmação do pagamento você receberá um e-mail com instruções para desbloquear todos os
                  recursos premium dentro do app Mindly. Oferta válida enquanto o cronômetro estiver ativo.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="space-y-4 text-center"
          >
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm">Pagamento 100% seguro via Kiwify, com suporte ao cartão e Pix.</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Ficou com dúvidas? Entre em contato com nossa equipe pelo WhatsApp após a compra e ativaremos seu acesso Pro.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
