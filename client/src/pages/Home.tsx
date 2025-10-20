import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/Header";
import { CheckCircle2, BarChart3, FileText, Users, Lock, Smartphone, AlertCircle, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            PCA-GES: Gerenciador de Programa de Conservação Auditiva
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Solução completa para saúde auditiva ocupacional. Monitore exposição ao ruído, realize audiometrias, identifique alterações auditivas automaticamente e gere relatórios de conformidade regulatória.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Solicitar Demonstração
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                Conhecer Recursos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Desafios na Saúde Auditiva Ocupacional</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Dificuldade em monitorar exposição ao ruído de múltiplos trabalhadores</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Falta de identificação automática de alterações auditivas</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Tempo excessivo na geração de relatórios de conformidade</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Desorganização de dados de audiometrias e históricos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Risco de não conformidade com regulamentações (NR-15, NR-7)</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Solução PCA-GES</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Monitoramento automático de exposição ao ruído</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Identificação automática de desencadeamentos e alterações auditivas</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Relatórios automatizados de conformidade regulatória</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Banco de dados centralizado e seguro</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Conformidade garantida com NR-15 e NR-7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Funcionalidades Principais</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar a saúde auditiva ocupacional de forma eficiente e em conformidade com a legislação
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <AlertCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Monitoramento de Ruído</h3>
              <p className="text-muted-foreground">
                Monitore automaticamente a exposição ao ruído dos trabalhadores com dados em tempo real e alertas quando limites são ultrapassados.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Audiometrias Ocupacionais</h3>
              <p className="text-muted-foreground">
                Realize e registre audiometrias ocupacionais com integração automática de dados e comparação com históricos anteriores.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <AlertCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Detecção Automática</h3>
              <p className="text-muted-foreground">
                Identificação automática de desencadeamentos e alterações auditivas com alertas imediatos para ação preventiva.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Relatórios Automatizados</h3>
              <p className="text-muted-foreground">
                Geração rápida de relatórios de conformidade regulatória (NR-15, NR-7) com dados consolidados e análises detalhadas.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Gestão de EPIs</h3>
              <p className="text-muted-foreground">
                Controle e acompanhamento de Equipamentos de Proteção Individual com histórico de distribuição e conformidade.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Treinamento e Educação</h3>
              <p className="text-muted-foreground">
                Módulos de treinamento para trabalhadores sobre conservação auditiva e uso correto de EPIs com rastreamento de conclusão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios para sua Empresa</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Conformidade Regulatória Garantida</h3>
                <p className="text-muted-foreground">
                  Atenda plenamente aos requisitos da NR-15 (Atividades e Operações Insalubres) e NR-7 (Programa de Controle Médico de Saúde Ocupacional).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Redução de Custos</h3>
                <p className="text-muted-foreground">
                  Diminua custos administrativos e de saúde ocupacional com automação de processos e prevenção de problemas auditivos.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Proteção de Trabalhadores</h3>
                <p className="text-muted-foreground">
                  Proteja a saúde auditiva dos seus funcionários com monitoramento contínuo e intervenções preventivas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Redução de Riscos Legais</h3>
                <p className="text-muted-foreground">
                  Minimize riscos de processos trabalhistas e multas regulatórias com documentação completa e conformidade comprovada.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Eficiência Operacional</h3>
                <p className="text-muted-foreground">
                  Economize tempo com automação de relatórios, alertas inteligentes e gestão centralizada de dados.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Reputação Corporativa</h3>
                <p className="text-muted-foreground">
                  Demonstre compromisso com a saúde e segurança dos trabalhadores, melhorando a imagem da empresa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">O que Nossos Clientes Dizem</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="mb-4 italic">
                "O PCA-GES transformou completamente nosso programa de conservação auditiva. Agora temos conformidade garantida com as normas e os trabalhadores estão mais protegidos."
              </p>
              <p className="font-bold">Gerente de Saúde Ocupacional</p>
              <p className="text-sm text-muted-foreground">Indústria de Manufatura</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="mb-4 italic">
                "A identificação automática de alterações auditivas nos permite agir rapidamente. Economizamos muito tempo em relatórios e temos mais dados para análise."
              </p>
              <p className="font-bold">Médico do Trabalho</p>
              <p className="text-sm text-muted-foreground">Clínica de Saúde Ocupacional</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Proteja a Saúde Auditiva dos Seus Trabalhadores</h2>
          <p className="text-lg mb-8 text-blue-100">
            Implemente o PCA-GES e garanta conformidade regulatória com eficiência. Solicite uma demonstração gratuita hoje.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Solicitar Demonstração Gratuita
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

