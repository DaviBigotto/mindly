import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Brain, Sparkles, ShieldCheck, Lock, UserRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { authenticate, login } = useAuth();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const initialMode = params.get("mode");
    if (initialMode === "login") {
      setMode("login");
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "signup" && form.password !== form.confirmPassword) {
      toast({
        title: "As senhas não conferem",
        description: "Verifique e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        authenticate({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        });
        toast({
          title: "Conta criada com sucesso",
          description: `Bem-vindo, ${form.firstName}! Preparamos uma experiência calma para sua jornada Mindly.`,
        });
      } else {
        login({ email: form.email, password: form.password });
        toast({
          title: "Login realizado",
          description: "Bom te ver por aqui novamente. Continue sua jornada mindful.",
        });
      }
      setLocation("/home");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir a ação.";
      toast({
        title: mode === "signup" ? "Erro ao criar conta" : "Erro ao entrar",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-[360px] w-[360px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-16 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/landing">
              <a className="flex items-center gap-3 text-foreground transition hover:text-primary">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 shadow-lg shadow-primary/20">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Mindly</p>
                  <p className="font-heading text-lg font-semibold">Crie sua jornada</p>
                </div>
              </a>
            </Link>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/landing">
              <a>Voltar para o início</a>
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20 pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <Badge className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
              {isSignup ? "Bem-vindo à família Mindly" : "Que bom te ver novamente"}
            </Badge>
            <h1 className="text-4xl font-heading font-semibold text-foreground md:text-[2.75rem]">
              {isSignup
                ? "Respire fundo, a sua nova rotina começa aqui."
                : "Entre para continuar cuidando da sua mente."}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {isSignup
                ? "Crie uma conta para acompanhar suas meditações, registrar emoções e desbloquear trilhas de transformação. Nosso time prepara experiências cuidadosas para equilibrar foco e bem-estar."
                : "Acesse a sua conta para retomar trilhas, atualizar seu diário emocional e continuar evoluindo com serenidade."}
            </p>
            <div className="grid gap-4 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Seus dados pessoais são armazenados com segurança e usados apenas para melhorar a sua jornada mindfulness.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Tenha acesso às novidades do Mindly antes de todo mundo e receba convites para práticas especiais.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <Card className="border border-white/50 bg-white/80 shadow-2xl shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <CardContent className="space-y-6 p-8">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-heading font-semibold text-foreground">
                    {isSignup ? "Crie sua conta Mindly" : "Entre com seus dados"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isSignup
                      ? "Leva menos de dois minutos e você já começa a respirar com mais calma."
                      : "Digite o e-mail e a senha cadastrados para continuar se cuidando."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {isSignup && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2 text-sm">
                          <UserRound className="h-4 w-4 text-primary" />
                          Nome
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Seu nome"
                          value={form.firstName}
                          onChange={handleChange}
                          required={isSignup}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-2 text-sm">
                          <UserRound className="h-4 w-4 text-primary" />
                          Sobrenome
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Seu sobrenome"
                          value={form.lastName}
                          onChange={handleChange}
                          required={isSignup}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="voce@exemplo.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="password" className="flex items-center gap-2 text-sm">
                        <Lock className="h-4 w-4 text-primary" />
                        Senha
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder={isSignup ? "Crie uma senha segura" : "Digite sua senha"}
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {isSignup && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm">
                          <Lock className="h-4 w-4 text-primary" />
                          Confirmar senha
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Repita a senha"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required={isSignup}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? isSignup
                        ? "Criando conta..."
                        : "Entrando..."
                      : isSignup
                      ? "Quero ser Mindly"
                      : "Entrar"}
                  </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground">
                  Ao continuar, você concorda em receber conteúdos inspiradores e aceita nossa política de privacidade.
                </p>

                <div className="text-center text-sm text-muted-foreground">
                  {isSignup ? "Já tem uma conta? " : "Ainda não tem conta? "}
                  <button
                    type="button"
                    onClick={() => setMode(isSignup ? "login" : "signup")}
                    className="font-medium text-primary hover:underline"
                  >
                    {isSignup ? "Entrar" : "Criar conta"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
