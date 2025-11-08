import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Target, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-semibold">Mindly</span>
          </div>
          <Button
            asChild
            size="default"
            data-testid="button-login"
          >
            <a href="/api/login">Entrar</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
            Equilíbrio entre Mente e Produtividade
          </h1>
          <p className="text-xl text-muted-foreground">
            Um aplicativo de saúde mental e foco que combina inteligência artificial,
            meditações guiadas e acompanhamento emocional para ajudar você a reduzir
            o estresse, melhorar o foco e viver com mais equilíbrio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              asChild
              className="text-base"
              data-testid="button-get-started"
            >
              <a href="/api/login">Começar Agora</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base"
              data-testid="button-learn-more"
            >
              <a href="#features">Saiba Mais</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover-elevate border-border transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold">Meditações Guiadas</h3>
              <p className="text-muted-foreground">
                Sessões de 3 a 10 minutos para foco, relaxamento, sono e ansiedade.
                Encontre a paz interior com práticas personalizadas.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate border-border transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold">Diário Emocional</h3>
              <p className="text-muted-foreground">
                Registre seus sentimentos e receba análises empáticas da IA.
                Acompanhe seu humor e desenvolva autoconhecimento.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate border-border transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold">Modo Foco</h3>
              <p className="text-muted-foreground">
                Timer Pomodoro, sons ambiente e técnicas de respiração para
                aumentar sua produtividade consciente.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pro Features Section */}
      <section className="bg-gradient-to-br from-pro/10 to-primary/5 py-16 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-pro" />
              <h2 className="text-3xl font-heading font-bold">Mindly Pro</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Desbloqueie trilhas exclusivas de transformação, análise de humor
              ilimitada com IA e sons premium para meditação profunda.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pro" />
                <span>Meditações ilimitadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pro" />
                <span>IA emocional ilimitada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pro" />
                <span>Trilhas de transformação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pro" />
                <span>Sons premium</span>
              </div>
            </div>
            <p className="text-2xl font-heading font-semibold text-foreground pt-4">
              R$ 29,90/mês
            </p>
            <Button
              size="lg"
              asChild
              className="text-base bg-pro hover:bg-pro/90 text-white"
              data-testid="button-try-pro"
            >
              <a href="/api/login">Experimentar Pro</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Mindly. Invista em sua paz mental.</p>
        </div>
      </footer>
    </div>
  );
}
