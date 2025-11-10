import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type KiwifyWebhookLog = {
  id: string;
  email: string | null;
  evento: string | null;
  produto: string | null;
  tokenValid: boolean;
  processed: boolean;
  status: string | null;
  message: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export default function AdminKiwify() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<KiwifyWebhookLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [evento, setEvento] = useState("assinatura renovada");
  const [produto, setProduto] = useState("Mindly Pro");
  const [customPayload, setCustomPayload] = useState("");

  const normalizedEmail = email.trim().toLowerCase();

  const disabledSubmit = useMemo(() => {
    if (!normalizedEmail) return true;
    if (!evento.trim()) return true;
    return false;
  }, [normalizedEmail, evento]);

  async function loadLogs(showToast = false) {
    try {
      setIsLoadingLogs(true);
      const response = await fetch(`${baseUrl}/api/admin/kiwify/logs`);
      if (!response.ok) {
        throw new Error("Falha ao carregar logs");
      }
      const data = (await response.json()) as KiwifyWebhookLog[];
      setLogs(data);
      if (showToast) {
        toast({
          title: "Logs atualizados",
          description: "Eventos mais recentes carregados com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar logs",
        description:
          error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  }

  useEffect(() => {
    loadLogs().catch(() => undefined);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabledSubmit) return;

    try {
      setIsSubmitting(true);
      const payload: Record<string, unknown> = {
        email: normalizedEmail,
        evento,
        produto,
      };

      if (customPayload.trim()) {
        try {
          const extra = JSON.parse(customPayload);
          Object.assign(payload, extra);
        } catch (error) {
          toast({
            title: "JSON inválido",
            description: "Não foi possível interpretar o payload adicional.",
            variant: "destructive",
          });
          return;
        }
      }

      const response = await fetch(`${baseUrl}/api/admin/kiwify/simulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Erro ao processar simulação");
      }

      toast({
        title: "Evento processado",
        description: data?.message ?? "Simulação executada com sucesso.",
      });
      setEmail("");
      loadLogs().catch(() => undefined);
    } catch (error) {
      toast({
        title: "Falha na simulação",
        description:
          error instanceof Error ? error.message : "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -right-16 h-[360px] w-[360px] rounded-full bg-pro/20 blur-3xl" />
      </div>

      <main className="container mx-auto px-4 pb-16 pt-12 space-y-8">
        <Card className="border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <CardHeader>
            <CardTitle className="font-heading text-foreground">
              Painel de Integração Kiwify
            </CardTitle>
            <CardDescription>
              Visualize logs recebidos via webhook e dispare eventos de teste sem sair do Mindly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">
                  E-mail do cliente
                </label>
                <Input
                  id="email"
                  placeholder="cliente@exemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="evento">
                  Evento
                </label>
                <Input
                  id="evento"
                  placeholder="assinatura renovada"
                  value={evento}
                  onChange={(event) => setEvento(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="produto">
                  Produto
                </label>
                <Input
                  id="produto"
                  placeholder="Mindly Pro"
                  value={produto}
                  onChange={(event) => setProduto(event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground" htmlFor="payload">
                  Payload adicional (JSON opcional)
                </label>
                <Textarea
                  id="payload"
                  placeholder='{"token":"SEUTOKENAQUI"}'
                  value={customPayload}
                  onChange={(event) => setCustomPayload(event.target.value)}
                  className="h-24"
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loadLogs(true)}
                  disabled={isLoadingLogs}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Atualizar logs
                </Button>
                <Button type="submit" disabled={disabledSubmit || isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Enviando..." : "Simular evento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-white/50 bg-white/75 shadow-lg shadow-primary/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <CardHeader>
            <CardTitle className="font-heading text-foreground">
              Logs recentes
            </CardTitle>
            <CardDescription>
              Últimos eventos recebidos pela rota <code>/api/webhooks/kiwify</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingLogs && logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Carregando eventos...</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum evento registrado até o momento.
              </p>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow-sm shadow-primary/10"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {log.email ?? "E-mail desconhecido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={log.tokenValid ? "default" : "destructive"}>
                          Token {log.tokenValid ? "válido" : "inválido"}
                        </Badge>
                        <Badge variant={log.processed ? "default" : "outline"}>
                          {log.status ?? "sem status"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-foreground">
                        Evento: <span className="font-medium">{log.evento ?? "-"}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Produto: {log.produto ?? "-"}
                      </p>
                      {log.message && (
                        <p className="text-sm text-muted-foreground">Mensagem: {log.message}</p>
                      )}
                      {log.payload && (
                        <details className="mt-2">
                          <summary className="text-sm text-primary cursor-pointer">
                            Ver payload completo
                          </summary>
                          <pre className="mt-2 overflow-x-auto rounded-lg bg-background/80 p-3 text-xs text-muted-foreground">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


