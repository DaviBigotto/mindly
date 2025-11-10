import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardContent className="p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-heading font-bold">404</h1>
            <h2 className="text-2xl font-heading font-semibold">Página não encontrada</h2>
            <p className="text-muted-foreground">
              A página que você procura não existe ou foi movida
            </p>
          </div>
          <Button asChild size="lg" className="w-full" data-testid="button-home">
            <Link href="/signup">Voltar ao Início</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
