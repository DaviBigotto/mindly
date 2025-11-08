import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, ArrowLeft, Sparkles, Shield, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SiVisa, SiMastercard, SiStripe } from "react-icons/si";

// Stripe integration - javascript_stripe blueprint
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Falha no Pagamento",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Pagamento Bem-Sucedido",
        description: "Bem-vindo ao Mindly Pro!",
      });
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-pro hover:bg-pro/90 text-white"
        size="lg"
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Finalizar Assinatura
          </>
        )}
      </Button>
    </form>
  );
}

export default function Subscribe() {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create subscription as soon as the page loads - javascript_stripe blueprint
    apiRequest("POST", "/api/get-or-create-subscription", {})
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating subscription:", error);
      });
  }, []);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

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
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-pro/20 flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-pro" />
            </div>
            <h1 className="text-4xl font-heading font-bold">
              Assinatura Mindly Pro
            </h1>
            <p className="text-lg text-muted-foreground">
              Invista em sua paz mental e desbloqueie todo o potencial do Mindly
            </p>
          </div>

          {/* Benefits */}
          <Card className="border-pro/30">
            <CardHeader>
              <CardTitle className="font-heading">O que está incluído</CardTitle>
              <CardDescription>
                Acesso completo a todas as funcionalidades premium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pro flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Meditações Ilimitadas</p>
                  <p className="text-sm text-muted-foreground">
                    Acesso a todas as categorias: Foco, Relaxamento, Sono, Ansiedade e Autoconfiança
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pro flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">IA Emocional Ilimitada</p>
                  <p className="text-sm text-muted-foreground">
                    Análises de humor ilimitadas com insights personalizados da IA
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pro flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Trilhas de Transformação</p>
                  <p className="text-sm text-muted-foreground">
                    21 Dias de Foco, 7 Dias de Paz Interior e Desafio Sono Perfeito
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pro flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Sons Premium</p>
                  <p className="text-sm text-muted-foreground">
                    Biblioteca exclusiva de áudio 3D para meditação profunda
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-muted-foreground">Plano Mensal</span>
                <span className="text-2xl font-heading font-bold">R$ 29,90</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Acesso completo a todas as meditações e IA emocional. Cancele a qualquer momento.
              </p>
            </CardContent>
          </Card>

          {/* Payment Form */}
          {!clientSecret ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Preparando checkout seguro...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Informações de Pagamento
                </CardTitle>
                <CardDescription>
                  Todos os pagamentos são processados de forma segura pela Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              </CardContent>
            </Card>
          )}

          {/* Trust Badges */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Shield className="w-5 h-5" />
              <p className="text-sm">Pagamento 100% seguro via Stripe</p>
            </div>
            <div className="flex items-center justify-center gap-6 opacity-60">
              <SiStripe className="w-12 h-12" />
              <SiVisa className="w-12 h-12" />
              <SiMastercard className="w-12 h-12" />
            </div>
            <p className="text-xs text-muted-foreground">
              Sua tranquilidade está em boas mãos. Cancele a qualquer momento.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
