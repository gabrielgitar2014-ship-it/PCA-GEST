import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/Header";
import { CheckCircle2, AlertCircle, BarChart3, FileText, Lock, Smartphone, Clock, Shield, Users, TrendingUp } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Recursos Completos do PCA-GES
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tudo que você precisa para gerenciar o Programa de Conservação Auditiva com eficiência e conformidade regulatória
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="flex gap-4">
              <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Monitoramento de Exposição ao Ruído</h3>
                <p className="text-muted-foreground mb-4">
                  Monitore automaticamente os níveis de exposição ao ruído dos trabalhadores em tempo real. Receba alertas imediatos quando os limites estabelecidos pela NR-15 são ultrapassados.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Monitoramento em tempo real</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Alertas automáticos de limite ultrapassado</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Histórico completo de exposição</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Conformidade com NR-15</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Monitoramento de Ruído</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Audiometrias Ocupacionais</p>
              </div>
            </div>

            <div className="flex gap-4 order-1 md:order-2">
              <BarChart3 className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Audiometrias Ocupacionais</h3>
                <p className="text-muted-foreground mb-4">
                  Realize e registre audiometrias ocupacionais com integração automática de dados. Compare resultados com históricos anteriores para identificar tendências e mudanças na audição.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Registro de audiometrias</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Comparação com históricos</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Análise de tendências auditivas</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Integração com equipamentos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="flex gap-4">
              <TrendingUp className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Detecção Automática de Alterações</h3>
                <p className="text-muted-foreground mb-4">
                  Sistema inteligente que identifica automaticamente desencadeamentos e alterações auditivas nos dados coletados. Receba alertas imediatos para ação preventiva e intervenção rápida.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Identificação automática de alterações</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Alertas em tempo real</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Análise de desencadeadores</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Recomendações de ação</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Detecção Automática</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Relatórios Automatizados</p>
              </div>
            </div>

            <div className="flex gap-4 order-1 md:order-2">
              <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Relatórios Automatizados de Conformidade</h3>
                <p className="text-muted-foreground mb-4">
                  Gere relatórios profissionais e detalhados em segundos, com conformidade garantida com NR-15 e NR-7. Exporte em múltiplos formatos para auditorias e inspeções.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Relatórios NR-15 e NR-7</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Geração automática</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Múltiplos formatos (PDF, Excel)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Gráficos e análises detalhadas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="flex gap-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Gestão de EPIs</h3>
                <p className="text-muted-foreground mb-4">
                  Controle e acompanhamento completo de Equipamentos de Proteção Individual. Registre distribuição, validade, inspeções e conformidade com padrões de qualidade.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Inventário de EPIs</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Histórico de distribuição</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Controle de validade</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Rastreamento de inspeções</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Gestão de EPIs</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <Users className="w-16 h-16 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Treinamento e Educação</p>
              </div>
            </div>

            <div className="flex gap-4 order-1 md:order-2">
              <Users className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">Treinamento e Educação</h3>
                <p className="text-muted-foreground mb-4">
                  Módulos de treinamento interativos sobre conservação auditiva, uso correto de EPIs e prevenção de perdas auditivas. Acompanhe conclusão e compreensão dos trabalhadores.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Módulos de treinamento</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Rastreamento de conclusão</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Avaliações e testes</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Certificados de conclusão</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Adicionais</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <Smartphone className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Acesso Multiplataforma</h3>
              <p className="text-muted-foreground">
                Acesse de qualquer lugar - desktop, tablet ou smartphone com sincronização em tempo real entre dispositivos.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <Lock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Segurança e Privacidade</h3>
              <p className="text-muted-foreground">
                Criptografia de ponta a ponta, conformidade com LGPD e regulamentações de saúde ocupacional, backups automáticos.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Economia de Tempo</h3>
              <p className="text-muted-foreground">
                Reduza o tempo gasto em tarefas administrativas com automação de relatórios e alertas inteligentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Solicite uma demonstração gratuita e veja como o PCA-GES pode transformar seu programa de conservação auditiva.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Solicitar Demonstração
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">PCA-GES</h4>
              <p className="text-sm text-muted-foreground">
                Gerenciador de Programa de Conservação Auditiva para saúde ocupacional.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features"><a className="text-muted-foreground hover:text-foreground">Recursos</a></Link></li>
                <li><Link href="/pricing"><a className="text-muted-foreground hover:text-foreground">Preços</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about"><a className="text-muted-foreground hover:text-foreground">Sobre</a></Link></li>
                <li><Link href="/contact"><a className="text-muted-foreground hover:text-foreground">Contato</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacidade</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PCA-GES. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

